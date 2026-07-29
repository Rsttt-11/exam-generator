/**
 * PDF 生成器 v6 — HTML + KaTeX 专业考卷排版
 *
 * 生成包含 KaTeX 渲染数学公式的 HTML 页面，
 * 通过浏览器打印（Ctrl+P）导出为高质量 PDF。
 *
 * 排版对标正规考研数学试卷：
 * - A4 纸张，页边距 18mm/16mm
 * - 封面简洁规范
 * - 题型分块：一、选择题 / 二、填空题 / 三、解答题
 * - 全局连续题号
 * - 选项 A. 单行排列
 * - 解答题预留答题空白
 * - 末尾题目来源表
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

const STYLE = `
@page { size: A4; margin: 18mm 16mm 18mm 16mm; }
@media print {
  html, body { width: 210mm; margin: 0; padding: 0; }
  .no-break { page-break-inside: avoid; }
}
* { box-sizing: border-box; }
body {
  font-family: "Source Han Sans CN", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 10.5pt;
  line-height: 1.8;
  color: #000;
  margin: 0;
  padding: 0;
}

/* 封面 */
.exam-header {
  text-align: center;
  margin: 60px 0 28px 0;
}
.exam-title {
  font-size: 26pt;
  font-weight: bold;
  letter-spacing: 4px;
}
.exam-subtitle {
  font-size: 20pt;
  font-weight: bold;
  margin: 4px 0 16px 0;
}
.exam-divider {
  border: none;
  border-top: 2px solid #333;
  margin: 8px auto 16px auto;
  width: 70%;
}
.exam-meta {
  font-size: 11pt;
  line-height: 2.0;
}
.exam-summary {
  font-size: 10.5pt;
  margin-top: 10px;
}

/* 题型标题 */
.section-header {
  font-size: 12pt;
  font-weight: bold;
  margin: 24px 0 12px 0;
  padding-bottom: 4px;
  border-bottom: 1.5px solid #666;
}

/* 题目区 */
.question-block {
  margin-bottom: 14px;
  page-break-inside: avoid;
}
.question-text {
  font-size: 10.5pt;
  line-height: 1.8;
}
.q-number {
  font-weight: bold;
  margin-right: 0.4em;
}
.option-line {
  padding-left: 2.4em;
  font-size: 10.5pt;
  line-height: 1.7;
}
.content-line {
  padding-left: 1.4em;
  font-size: 10.5pt;
  line-height: 1.8;
}
.answer-space {
  min-height: 50px;
}

/* 来源 */
.source-section {
  margin-top: 30px;
  padding-top: 10px;
  border-top: 2px solid #666;
}
.source-title {
  font-size: 10.5pt;
  font-weight: bold;
  margin-bottom: 6px;
}
.source-item {
  font-size: 8pt;
  line-height: 1.6;
  color: #555;
}

/* KaTeX 调整 */
.katex { font-size: 1.08em; }
.katex-display { margin: 0.4em 0; text-align: center; }
`

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 清理内容：去除 MinerU 插入的图片标记、合并异常换行
 */
function cleanContent(raw: string): string {
  // 去除 ![...](url)
  let s = raw.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  // 去除单独残留的图片引用行
  s = s.replace(/^\[image\].*$/gm, '')
  // 去除空行和仅空格行
  s = s.replace(/^\s*[\n\r]/gm, '\n')
  // 去除多余的空白行
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

function renderMixedLine(line: string): string {
  if (!line) return ''
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

function renderQuestion(q: Question, globalNo: number): string {
  const rawContent = toLatex(q.content)
  const cleaned = cleanContent(rawContent)
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length === 0) return ''

  let html = '<div class="question-block no-break">'

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li]
    const isOpt = /^[A-D]\s*[.、）)]/.test(line)

    if (li === 0) {
      html += `<div class="question-text"><span class="q-number">${globalNo}.</span> ${renderMixedLine(line)}</div>`
    } else if (isOpt) {
      const optText = line.replace(/^([A-D])\s*[.、）)]\s*/, '$1.  ')
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

interface KatexBundles { css: string; js: string }
let katexBundleCache: KatexBundles | null = null

async function loadKatexBundles(): Promise<KatexBundles | null> {
  if (katexBundleCache) return katexBundleCache
  try {
    const resp = await fetch('./katex-base64.json')
    if (!resp.ok) throw new Error('HTTP ' + resp.status)
    const data = await resp.json()
    katexBundleCache = { css: atob(data.css), js: atob(data.js) }
    return katexBundleCache
  } catch (e) {
    console.warn('Failed to load KaTeX bundles:', e)
    return null
  }
}

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
  body += '<div class="source-section no-break">'
  body += '<div class="source-title">题目来源</div>'
  questions.forEach((q, idx) => {
    const src = `[${q.sectionName} · 第${q.chapter}章 · ${TYPE_LABELS[q.type]} · 第${q.questionNumber}题(P${q.page})]`
    body += `<div class="source-item">第${idx + 1}题：${escHtml(src)}</div>`
  })
  body += '</div>'

  const katexData = await loadKatexBundles()
  if (!katexData) return ''

  const script = `
  <script>
  (function() {
    var css = document.createElement('style');
    css.textContent = ${JSON.stringify(katexData.css)};
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.textContent = ${JSON.stringify(katexData.js)};
    document.body.appendChild(js);
    var check = setInterval(function() {
      if (typeof katex !== 'undefined') {
        clearInterval(check);
        document.querySelectorAll('.katex-html[data-latex]').forEach(function(el) {
          try {
            var latex = decodeURIComponent(el.getAttribute('data-latex'));
            el.outerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: false });
          } catch(e) { el.style.color = '#c00'; }
        });
      }
    }, 50);
  })();
  <\/script>`

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${STYLE}</style>
<title>${escHtml(plan.name)} - ${escHtml(paper.name)}</title>
</head>
<body>${body}${script}</body></html>`
}

export async function previewPdf(opts: PdfOptions): Promise<string> {
  const html = await buildHtml(opts)
  if (!html) return fallbackHtml(opts)
  return URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
}

function fallbackHtml(opts: PdfOptions): string {
  const { plan } = opts
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><style>${STYLE}</style>
<title>${escHtml(plan.name)}</title></head>
<body>
<p style="color:#c00;text-align:center;margin:40px;font-size:14px;">公式渲染组件加载中，请刷新后重试</p>
</body></html>`
}

export async function downloadPdf(opts: PdfOptions) {
  const url = await previewPdf(opts)
  const w = window.open(url, '_blank')
  if (w) {
    const timer = setInterval(() => {
      try {
        if (w.document.readyState === 'complete') {
          clearInterval(timer)
          setTimeout(() => w.print(), 1000)
        }
      } catch {}
    }, 200)
  }
}
