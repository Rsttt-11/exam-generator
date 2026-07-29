/**
 * PDF 生成器 v5 — HTML + KaTeX 专业考卷排版
 *
 * 生成包含 KaTeX 渲染数学公式的 HTML 页面（在 iframe 或新标签中打开），
 * 通过浏览器打印（Ctrl+P）导出为高质量 PDF。
 *
 * KaTeX 在预览页面中通过 CDN 按需加载（不增加应用主包体积）。
 *
 * 排版标准：
 * - A4 纸张，仿正式考卷版式
 * - 三大题型分板块：一、选择题 / 二、填空题 / 三、解答题
 * - 全局连续题号
 * - 公式使用 KaTeX 渲染（支持积分/极限/矩阵/分式等）
 * - 末尾保留题目来源表
 */

import type { Question, Paper, Plan } from '@/types'
import { TYPE_LABELS } from '@/types'
import { toLatex } from './latexConverter'

export interface PdfOptions {
  paper: Paper
  plan: Plan
  questions: Question[]
  bookName: string
  subjectName: string
  sourceMode: 'chapter' | 'page'
}

// ─── 样式模板 ──────────────────────────────────────────

const STYLE = `
@page { size: A4; margin: 18mm 16mm 18mm 16mm; }
@media print {
  html, body { width: 210mm; }
  body { margin: 0; padding: 0; }
}
* { box-sizing: border-box; }
body {
  font-family: "Source Han Sans CN", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif;
  font-size: 11pt;
  line-height: 1.75;
  color: #000;
  padding: 0;
  margin: 0;
}

/* 封面 */
.exam-header {
  text-align: center;
  margin: 40px 0 24px 0;
}
.exam-title {
  font-size: 26pt;
  font-weight: bold;
  letter-spacing: 4px;
  margin-bottom: 6px;
}
.exam-subtitle {
  font-size: 20pt;
  font-weight: bold;
  margin-bottom: 14px;
  color: #222;
}
.exam-divider {
  border: none;
  border-top: 2px solid #333;
  margin: 8px auto 16px auto;
  width: 80%;
}
.exam-meta {
  font-size: 11pt;
  line-height: 2.2;
}
.exam-summary {
  font-size: 10.5pt;
  margin-top: 10px;
  color: #333;
}

/* 题型标题 */
.section-header {
  font-size: 13pt;
  font-weight: bold;
  margin: 28px 0 12px 0;
  padding-bottom: 6px;
  border-bottom: 1.5px solid #999;
}

/* 题目 */
.question-block {
  margin-bottom: 16px;
  page-break-inside: avoid;
}
.question-text {
  font-size: 11pt;
  line-height: 1.8;
}
.q-number {
  font-weight: bold;
  margin-right: 0.3em;
}
.option-line {
  padding-left: 2.2em;
  font-size: 11pt;
  line-height: 1.7;
}
.content-line {
  padding-left: 1.2em;
  font-size: 11pt;
  line-height: 1.7;
}
.answer-space {
  min-height: 60px;
}

/* 来源 */
.source-section {
  margin-top: 36px;
  padding-top: 12px;
  border-top: 2px solid #666;
}
.source-title {
  font-size: 11pt;
  font-weight: bold;
  margin-bottom: 8px;
}
.source-item {
  font-size: 8.5pt;
  line-height: 1.7;
  color: #444;
  padding-left: 0.5em;
}

/* KaTeX 调整 */
.katex { font-size: 1.05em; }
.katex-display { margin: 0.3em 0; }

.page-break { page-break-after: always; }
`

// ─── 工具 ──────────────────────────────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 将一行内容中 `$...$` 包裹的片段替换为 KaTeX 渲染容器，
 * 其他内容保持 HTML 转义文本。
 */
function renderMixedLine(line: string): string {
  if (!line) return ''
  // 按 $...$ 分割
  const parts = line.split(/(\$[^$]*\$)/g)
  return parts.map(part => {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const inner = part.slice(1, -1)
      const encoded = encodeURIComponent(inner)
      return `<span class="katex-html" data-latex="${encoded}">${escHtml(inner)}</span>`
    }
    return escHtml(part)
  }).join('')
}

// ─── 题目 → HTML ───────────────────────────────────────

/**
 * 智能渲染：Markdown 模式直接传透 LaTeX，JSON 模式自动转换
 */
function renderQuestion(q: Question, globalNo: number): string {
  const rawContent = toLatex(q.content)
  // 按换行分割，不做额外重排（保留 LaTeX 完整性）
  const lines = rawContent.split('\n').map(l => l.trim()).filter(Boolean)
  let html = '<div class="question-block">'

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li]
    const isOpt = /^[A-D]\s*[.、）)]/.test(line)

    if (li === 0) {
      html += `<div class="question-text"><span class="q-number">${globalNo}.</span> ${renderMixedLine(line)}</div>`
    } else if (isOpt) {
      const optText = line.replace(/^([A-D])\s*[.、）)]\s*/, '$1. ')
      html += `<div class="option-line">${renderMixedLine(optText)}</div>`
    } else {
      html += `<div class="content-line">${renderMixedLine(line)}</div>`
    }
  }

  html += '</div>'

  if (q.type === 'answer') {
    html += '<div class="answer-space"></div>'
  }

  return html
}

// ─── 内联 KaTeX ───────────────────────────────────────

interface KatexBundles {
  css: string
  js: string
}

let katexBundleCache: KatexBundles | null = null

async function loadKatexBundles(): Promise<KatexBundles | null> {
  if (katexBundleCache) return katexBundleCache
  try {
    // 从 public 目录预编译的 base64 文件读取 KaTeX
    const resp = await fetch('./katex-base64.json')
    if (!resp.ok) throw new Error('HTTP ' + resp.status)
    const data = await resp.json()
    const bundles: KatexBundles = {
      css: atob(data.css),
      js: atob(data.js),
    }
    katexBundleCache = bundles
    return bundles
  } catch (e) {
    console.warn('Failed to load KaTeX bundles:', e)
    return null
  }
}

// ─── 构建完整 HTML ─────────────────────────────────────

async function buildHtml(opts: PdfOptions): Promise<string> {
  const { paper, plan, questions, subjectName } = opts
  const { choice, blank, answer } = paper.config

  let body = ''

  // 封面
  body += '<div class="exam-header">'
  body += '<div class="exam-title">2027 考研数学</div>'
  body += '<div class="exam-subtitle">模拟试卷</div>'
  body += '<hr class="exam-divider">'
  body += `<div class="exam-meta">数学类别：${escHtml(subjectName)}</div>`
  body += `<div class="exam-meta">方案名称：${escHtml(plan.name)}</div>`
  body += `<div class="exam-meta">试卷编号：${escHtml(paper.name)}</div>`
  body += `<div class="exam-meta">生成时间：${new Date(paper.createdAt).toLocaleString('zh-CN')}</div>`
  body += `<div class="exam-summary">一、选择题 ${choice} 道　二、填空题 ${blank} 道　三、解答题 ${answer} 道　共计 ${questions.length} 题</div>`
  body += '</div>'

  // 试题
  const SECTIONS = [
    { type: 'choice' as const, num: '一', label: '选择题' },
    { type: 'blank' as const, num: '二', label: '填空题' },
    { type: 'answer' as const, num: '三', label: '解答题' },
  ]

  let globalNo = 0

  for (const sec of SECTIONS) {
    const qs = questions.filter(q => q.type === sec.type)
    if (!qs.length) continue

    body += `<div class="section-header">${sec.num}、${sec.label}（共${qs.length}题）</div>`

    for (const q of qs) {
      globalNo++
      body += renderQuestion(q, globalNo)
    }
  }

  // 来源
  body += '<div class="source-section">'
  body += '<div class="source-title">题目来源</div>'
  questions.forEach((q, idx) => {
    const src = `[${q.sectionName} · 第${q.chapter}章 · ${TYPE_LABELS[q.type]} · 第${q.questionNumber}题(P${q.page})]`
    body += `<div class="source-item">第${idx + 1}题：${escHtml(src)}</div>`
  })
  body += '</div>'

  // ─── 内联 KaTeX ───────────────────────────────────────
  // 预先读取 KaTeX 文件并内联到 HTML 中（iframe/blob URL 无法动态引用外部文件）
  const katexData = await loadKatexBundles()
  if (!katexData) {
    return ''
  }

  // 客户端 KaTeX 渲染脚本
  const script = `
  <script>
  (function() {
    var css = document.createElement('style');
    css.textContent = ${JSON.stringify(katexData.css)};
    document.head.appendChild(css);

    var script = document.createElement('script');
    script.textContent = ${JSON.stringify(katexData.js)};
    document.body.appendChild(script);

    var checkKatex = setInterval(function() {
      if (typeof katex !== 'undefined') {
        clearInterval(checkKatex);
        document.querySelectorAll('.katex-html[data-latex]').forEach(function(el) {
          try {
            var latex = decodeURIComponent(el.getAttribute('data-latex'));
            el.outerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: false });
          } catch(e) {
            el.style.color = '#c00';
          }
        });
      }
    }, 50);
  })();
  <\/script>`

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${STYLE}</style>
<title>${escHtml(plan.name)} - ${escHtml(paper.name)}</title>
</head>
<body>
${body}
${script}
</body>
</html>`
}

// ─── 导出接口 ──────────────────────────────────────────

/**
 * 预览 PDF（在新标签页中打开可打印的 HTML）
 */
export async function previewPdf(opts: PdfOptions): Promise<string> {
  const html = await buildHtml(opts)
  if (!html) {
    return fallbackHtml(opts)
  }
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  return URL.createObjectURL(blob)
}

function fallbackHtml(opts: PdfOptions): string {
  const { plan, paper } = opts
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><style>${STYLE}</style>
<title>${escHtml(plan.name)} - ${escHtml(paper.name)}</title></head>
<body>
<p style="color:#c00;text-align:center;margin:40px;font-size:14px;">
公式渲染加载中，请刷新页面或稍后重试</p>
</body></html>`
}

/**
 * 下载 PDF（打开打印对话框）
 */
export async function downloadPdf(opts: PdfOptions) {
  const url = await previewPdf(opts)
  const w = window.open(url, '_blank')
  if (w) {
    const timer = setInterval(() => {
      try {
        if (w.document.readyState === 'complete') {
          clearInterval(timer)
          setTimeout(() => w.print(), 800)
        }
      } catch {}
    }, 200)
  }
}
