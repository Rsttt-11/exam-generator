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

/* 按页码排序（暂未使用，保留接口）
function _sortByPage(questions: Question[]): Question[] {
  const categoryOf = (ch: number) => {
    if (ch <= 9) return 0
    if (ch <= 15) return 1
    return 2
  }
  return [...questions].sort((a, b) => {
    const catA = categoryOf(a.chapter)
    const catB = categoryOf(b.chapter)
    if (catA !== catB) return catA - catB
    if (a.page !== b.page) return a.page - b.page
    return a.questionNumber - b.questionNumber
  })
}
*/

export interface PdfOptions {
  paper: Paper
  plan: Plan
  questions: Question[]
  bookName: string
  subjectName: string
  sourceMode: 'chapter' | 'page'
  sourceOrder?: 'questionNumber' | 'page'
}

const STYLE = `
@page { size: A4; margin: 14mm 12mm 14mm 12mm; }
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
  line-height: 1.9;
  margin-bottom: 6px;
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
.source-divider {
  border-top: 1px dashed #aaa;
  margin: 6px 0;
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
  // 保留 $$ 行，仅去除空行和仅空格行
  s = s.replace(/^[ \t]+$/gm, '')
  // 去除多余的空白行（不超过2个连续换行）
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

/**
 * 拆分选项后的题号：MinerU 经常会写成
 *   D. $\lim_{x\to\infty}f(x)=1$ (4) 设当 $x\to+\infty$ 时...
 *   或  A. 选项 B. 选项 C. 选项 D. 选项(7)下一题
 * 需要在每个选项前断行，并在题号前断行
 */
function splitOptionsAndQuestions(line: string): string[] {
  let s = line

  // Step 0: 保护 $$...$$ 显示数学块（临时替换为占位符避免被后续拆分破坏）
  const displayMathBlocks: string[] = []
  s = s.replace(/\$\$[\s\S]*?\$\$/g, (m) => {
    displayMathBlocks.push(m)
    return `\x00DISPLAY_MATH_${displayMathBlocks.length - 1}\x00`
  })

  // Step 1: 在任何 A. B. C. D. 选项前断行（注意不要在 $ 数学模式内触发）
  const parts = s.split(/(\$[^$]*\$)/g)
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // 在文本部分（非数学模式）的 A. B. C. D. 前断行
      parts[i] = parts[i].replace(/\s+(?=[A-D]\s*[.、）)])/g, '\n')
    }
  }
  s = parts.join('')

  // Step 2: 如果 D 选项行包含题号（(N)），断开
  s = s.replace(/([Dd]\.\s*[^$]*?)\s*\((\d+)\)(\s*)/g, '$1\n\n($2) ')

  // 恢复显示数学块
  s = s.replace(/\x00DISPLAY_MATH_(\d+)\x00/g, (_, idx) => displayMathBlocks[parseInt(idx)] || '')

  // Step 3: 如果数字选项挤在一起 A.xx B.xx 中间没有换行时强制拆分
  const result = s.split('\n').map(l => l.trim()).filter(Boolean)

  // Step 4: 把行首和行尾的空格清理掉
  return result
}

function renderMixedLine(line: string): string {
  if (!line) return ''
  // 处理 $$...$$ 显示数学（整行）
  const trimmed = line.trim()
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
    const inner = trimmed.slice(2, -2).trim()
    const encoded = encodeURIComponent(inner)
    return `<div class="katex-display-wrap"><span class="katex-display-html" data-latex="${encoded}">${escHtml(inner)}</span></div>`
  }
  // 裸 $$ 或 $$...$$ 长度为0/2/3/4 → 忽略
  if (trimmed === '$$' || trimmed === '$$ ') {
    return ''
  }
  // 处理 $...$ 行内数学
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
  const rawLines = cleaned.split('\n').map(l => l.trim()).filter(Boolean)
  if (rawLines.length === 0) return ''

  // 展开压缩的行（A.xxx B.xxx 同行 或 D.xxx (N)同行）
  const expandedLines: string[] = []
  for (const line of rawLines) {
    const parts = splitOptionsAndQuestions(line)
    expandedLines.push(...parts)
  }

  // 合并 $$...$$ 显示数学块（MinerU 格式：$$ 和内容分行）
  const mergedLines: string[] = []
  let i = 0
  while (i < expandedLines.length) {
    const line = expandedLines[i]
    // 遇到 $$ 开始块
    if (line === '$$' || line === '$$ ') {
      const blockLines: string[] = []
      i++
      while (i < expandedLines.length && expandedLines[i] !== '$$') {
        blockLines.push(expandedLines[i])
        i++
      }
      // 跳过闭合 $$
      if (i < expandedLines.length) i++
      // 合并成一个行：$$内容$$
      const blockContent = blockLines.join(' ')
      if (blockContent.trim()) {
        mergedLines.push('$$' + blockContent.trim() + '$$')
      }
    } else {
      mergedLines.push(line)
      i++
    }
  }

  let html = '<div class="question-block no-break">'

  for (let li = 0; li < mergedLines.length; li++) {
    const line = mergedLines[li]
    if (!line) continue
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

  // 来源（保留原题页码，从 q.page 获取）
  // 按试卷题号排序，章节切换时加分隔线
  body += '<div class="source-section no-break">'
  body += '<div class="source-title">题目来源</div>'
  questions.forEach((q, idx) => {
    // 检查是否需要加分隔线（章节变化时）
    if (idx > 0) {
      const prevQ = questions[idx - 1]
      if (prevQ.chapter !== q.chapter) {
        body += '<div class="source-divider"></div>'
      }
    }
    const pg = q.page > 0 ? `(P${q.page})` : ''
    const src = `[${q.sectionName} · 第${q.chapter}章 · ${TYPE_LABELS[q.type]} · 第${q.questionNumber}题${pg}]`
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
        document.querySelectorAll('span.katex-html[data-latex]').forEach(function(el) {
          try {
            var latex = decodeURIComponent(el.getAttribute('data-latex'));
            el.outerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: false });
          } catch(e) { el.style.color = '#c00'; }
        });
        // 显示数学 $$...$$
        document.querySelectorAll('div.katex-display-wrap span.katex-display-html[data-latex]').forEach(function(el) {
          try {
            var latex = decodeURIComponent(el.getAttribute('data-latex'));
            el.outerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: true });
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
  return html
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
  // 检测是否移动端（移动端不支持 window.print，直接下载 HTML）
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (isMobile) {
    await downloadHtml(opts)
    return
  }

  // 桌面端：弹窗打印
  const html = await buildHtml(opts)
  if (!html) return
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
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

/**
 * 下载为 .html 文件（移动端：系统分享 → 打印/PDF；桌面端：下载文件）
 */
export async function downloadHtml(opts: PdfOptions) {
  const { plan, paper } = opts
  const html = await buildHtml(opts)
  if (!html) return

  // 移动端优先用 navigator.share
  if (navigator.share) {
    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const file = new File([blob], `${plan.name}-${paper.name}.html`, { type: 'text/html;charset=utf-8' })
      await navigator.share({ files: [file], title: plan.name })
      return
    } catch {}
  }

  // 通用降级：data: URI 通过 <a download> 下载
  const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(html)
  const a = document.createElement('a')
  a.href = dataUri
  a.download = `${plan.name}-${paper.name}.html`
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
