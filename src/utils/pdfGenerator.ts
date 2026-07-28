/**
 * PDF 生成器 - 全面优化版
 * - 公式渲染：LaTeX → 可读文本
 * - 排版优化：层次分明、间距合理
 * - 字体：多 CDN 自动容错
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { PDFFont, PDFPage } from 'pdf-lib'
import type { Question, Paper, Plan } from '@/types'
import { TYPE_LABELS } from '@/types'

export interface PdfOptions {
  paper: Paper
  plan: Plan
  questions: Question[]
  bookName: string
  subjectName: string
  sourceMode: 'chapter' | 'page'
}

// ─── 字体 ───────────────────────────────────────────────

const FONT_URLS = [
  'https://cdn.jsdelivr.net/gh/nicktoump/Noto-Sans-CJK-SC@master/NotoSansCJKsc-Regular.ttf',
  'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/zh-Hans-CN/NotoSansCJKsc-Regular.otf',
  'https://unpkg.com/noto-sans-cjk-sc-regular@1.0.0/NotoSansCJKsc-Regular.ttf',
]

let fontCache: Uint8Array | null = null
let pending: Promise<Uint8Array | null> | null = null

async function tryFetchUrl(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return new Uint8Array(await res.arrayBuffer())
  } catch { return null }
}

async function getFontBytes(): Promise<Uint8Array | null> {
  if (fontCache) return fontCache
  if (pending) return pending
  pending = (async () => {
    for (const url of FONT_URLS) {
      const bytes = await tryFetchUrl(url)
      if (bytes) { fontCache = bytes; return bytes }
    }
    return null
  })()
  return pending
}

// ─── LaTeX → 纯文本 ─────────────────────────────────────

function latexToText(raw: string): string {
  return raw
    // 去除 $$...$$
    .replace(/\$\$([^$]+)\$\$/g, (_, m) => mathToText(m))
    // 去除 $...$
    .replace(/\$([^$]+)\$/g, (_, m) => mathToText(m))
    // 去除乱码字符
    .replace(/[░■▀﹡￥◆◇□○●★＃＆∗]/g, '')
    .replace(/[░■▁￥]/g, '')
    .trim()
}

function mathToText(expr: string): string {
  let s = expr.trim()
  // 分式 \frac{a}{b}
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
  // 上标 ^{...}
  s = s.replace(/\^\{([^}]*)\}/g, '^$1')
  // 下标 _{...}
  s = s.replace(/\_\{([^}]*)\}/g, '_$1')
  // 上标单个字符 ^x
  s = s.replace(/\^([a-zA-Z0-9])/g, '^$1')
  // 下标单个字符 _x
  s = s.replace(/_([a-zA-Z0-9])/g, '_$1')
  // 根号 \sqrt{...}
  s = s.replace(/\\sqrt(?:\[([^\]]*)\])?\{([^}]*)\}/g, '√($2)')
  // 极限 \lim_{...}
  s = s.replace(/\\lim_?\{?([^}]*)\}?/g, 'lim($1)')
  // 积分 \int
  s = s.replace(/\\int/g, '∫')
  // 求和 \sum
  s = s.replace(/\\sum/g, '∑')
  // 三角函数
  s = s.replace(/\\sin/g, 'sin')
  s = s.replace(/\\cos/g, 'cos')
  s = s.replace(/\\tan/g, 'tan')
  s = s.replace(/\\cot/g, 'cot')
  s = s.replace(/\\sec/g, 'sec')
  s = s.replace(/\\csc/g, 'csc')
  s = s.replace(/\\arcsin/g, 'arcsin')
  s = s.replace(/\\arccos/g, 'arccos')
  s = s.replace(/\\arctan/g, 'arctan')
  // ln, lg, log
  s = s.replace(/\\ln/g, 'ln')
  s = s.replace(/\\lg/g, 'lg')
  s = s.replace(/\\log/g, 'log')
  // 希腊字母
  s = s.replace(/\\alpha/g, 'α')
  s = s.replace(/\\beta/g, 'β')
  s = s.replace(/\\gamma/g, 'γ')
  s = s.replace(/\\delta/g, 'δ')
  s = s.replace(/\\epsilon/g, 'ε')
  s = s.replace(/\\zeta/g, 'ζ')
  s = s.replace(/\\eta/g, 'η')
  s = s.replace(/\\theta/g, 'θ')
  s = s.replace(/\\iota/g, 'ι')
  s = s.replace(/\\kappa/g, 'κ')
  s = s.replace(/\\lambda/g, 'λ')
  s = s.replace(/\\mu/g, 'μ')
  s = s.replace(/\\nu/g, 'ν')
  s = s.replace(/\\xi/g, 'ξ')
  s = s.replace(/\\pi/g, 'π')
  s = s.replace(/\\rho/g, 'ρ')
  s = s.replace(/\\sigma/g, 'σ')
  s = s.replace(/\\tau/g, 'τ')
  s = s.replace(/\\upsilon/g, 'υ')
  s = s.replace(/\\phi/g, 'φ')
  s = s.replace(/\\chi/g, 'χ')
  s = s.replace(/\\psi/g, 'ψ')
  s = s.replace(/\\omega/g, 'ω')
  s = s.replace(/\\infty/g, '∞')
  s = s.replace(/\\to/g, '→')
  s = s.replace(/\\rightarrow/g, '→')
  s = s.replace(/\\leftarrow/g, '←')
  s = s.replace(/\\partial/g, '∂')
  s = s.replace(/\\cdot/g, '·')
  s = s.replace(/\\cdots/g, '…')
  s = s.replace(/\\vdots/g, '⋮')
  s = s.replace(/\\ddots/g, '⋱')
  s = s.replace(/\\neq/g, '≠')
  s = s.replace(/\\geq/g, '≥')
  s = s.replace(/\\leq/g, '≤')
  s = s.replace(/\\approx/g, '≈')
  s = s.replace(/\\times/g, '×')
  s = s.replace(/\\div/g, '÷')
  s = s.replace(/\\pm/g, '±')
  s = s.replace(/\\mp/g, '∓')
  s = s.replace(/\\cdot/g, '·')
  s = s.replace(/\\circ/g, '°')
  // 括号
  s = s.replace(/\\\{/g, '{')
  s = s.replace(/\\\}/g, '}')
  s = s.replace(/\\\(/g, '(')
  s = s.replace(/\\\)/g, ')')
  s = s.replace(/\\\[/g, '[')
  s = s.replace(/\\\]/g, ']')
  // 去除残留反斜杠
  s = s.replace(/\\([a-zA-Z]+)/g, '$1')
  // 合并多余空格
  s = s.replace(/\s+/g, ' ')
  return s
}

// ─── 排版核心 ──────────────────────────────────────────

interface LayoutOpts {
  font: PDFFont
  boldFont: PDFFont
  hasCJK: boolean
  pageWidth: number
  pageHeight: number
  margin: number
}

class PdfLayout {
  readonly doc: PDFDocument
  readonly opts: LayoutOpts
  page!: PDFPage
  y!: number
  pageNum = 1
  readonly usableW: number

  constructor(doc: PDFDocument, opts: LayoutOpts) {
    this.doc = doc
    this.opts = opts
    this.usableW = opts.pageWidth - 2 * opts.margin
    this.newPage()
  }

  newPage() {
    this.page = this.doc.addPage([this.opts.pageWidth, this.opts.pageHeight])
    this.y = this.opts.pageHeight - this.opts.margin
    this.pageNum++
  }

  get font() { return this.opts.font }
  get bold() { return this.opts.boldFont }

  /** Draw a line of text, returning the y after drawing */
  draw(text: string, size = 10, bold = false, indent = 0): void {
    const f = bold ? this.bold : this.font
    const x = this.opts.margin + indent
    this.page.drawText(text, { x, y: this.y, font: f, size, color: rgb(0, 0, 0) })
    this.y -= size + 2
  }

  /** Draw centered text */
  drawCenter(text: string, size = 10, bold = false): void {
    const f = bold ? this.bold : this.font
    const tw = f.widthOfTextAtSize(text, size)
    const x = (this.opts.pageWidth - tw) / 2
    this.page.drawText(text, { x, y: this.y, font: f, size, color: rgb(0, 0, 0) })
    this.y -= size + 2
  }

  /** Draw wrapped text, auto new-page */
  drawWrap(text: string, size = 10, bold = false, indent = 0): void {
    const f = bold ? this.bold : this.font
    const maxW = this.usableW - indent
    const lineH = size + 3
    const words = text.split(/(?<=[一-鿿])|(?=[一-鿿])|(?<=\s)|(?=\s)/)

    let line = ''
    for (const w of words) {
      const testL = line + w
      const tw = f.widthOfTextAtSize(testL, size)
      if (tw > maxW && line) {
        if (this.y < this.opts.margin + lineH) this.newPage()
        this.page.drawText(line, { x: this.opts.margin + indent, y: this.y, font: f, size, color: rgb(0, 0, 0) })
        this.y -= lineH
        line = w
      } else {
        line = testL
      }
    }
    if (line) {
      if (this.y < this.opts.margin + lineH) this.newPage()
      this.page.drawText(line, { x: this.opts.margin + indent, y: this.y, font: f, size, color: rgb(0, 0, 0) })
      this.y -= lineH
    }
  }

  /** Draw a horizontal line separator */
  drawHr() {
    const y = this.y
    this.page.drawLine({
      start: { x: this.opts.margin, y },
      end: { x: this.opts.pageWidth - this.opts.margin, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    })
    this.y -= 8
  }

  space(h = 6) { this.y -= h }

  ensure(h: number) {
    if (this.y < this.opts.margin + h) this.newPage()
  }
}

// ─── 构建 PDF ──────────────────────────────────────────

async function buildPdfDoc(
  paper: Paper, plan: Plan,
  questions: Question[],
  bookName: string, subjectName: string,
  sourceMode: 'chapter' | 'page',
) {
  const doc = await PDFDocument.create()
  const fontBytes = await getFontBytes()

  let font: PDFFont
  let boldFont: PDFFont
  if (fontBytes) {
    font = await doc.embedFont(fontBytes)
    boldFont = font
  } else {
    font = await doc.embedFont(StandardFonts.Helvetica)
    boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  }

  const PAGE_W = 595, PAGE_H = 842  // A4
  const MARGIN = 55
  const hasCJK = !!fontBytes

  const ctx = new PdfLayout(doc, { font, boldFont, hasCJK, pageWidth: PAGE_W, pageHeight: PAGE_H, margin: MARGIN })

  // ========== 封面 ==========
  {
    ctx.y = PAGE_H * 0.38
    ctx.drawCenter('考研数学智能组卷', 28, true)
    ctx.space(4)
    ctx.drawCenter('—— 模拟试卷 ——', 14)
    ctx.space(20)

    // 封面分隔线
    ctx.y -= 2
    ctx.drawHr()
    ctx.space(12)

    ctx.drawCenter(`数学类别：${subjectName}`, 13)
    ctx.drawCenter(`题库名称：${bookName}`, 13)
    ctx.drawCenter(`方案名称：${plan.name}`, 13)
    ctx.drawCenter(`试卷编号：${paper.name}`, 13)
    ctx.drawCenter(`生成时间：${new Date(paper.createdAt).toLocaleString('zh-CN')}`, 11)
    ctx.space(10)

    const types = paper.config
    const summary = `选择题 ${types.choice} 道 | 填空题 ${types.blank} 道 | 解答题 ${types.answer} 道`
    ctx.drawCenter(summary, 11)
    ctx.space(6)
    ctx.drawCenter(`共 ${questions.length} 题`, 11)
  }

  // ========== 试卷内容 ==========
  const typeOrder = ['choice', 'blank', 'answer'] as const
  let globalIdx = 0

  for (const type of typeOrder) {
    const qs = questions.filter(q => q.type === type)
    if (!qs.length) continue

    ctx.ensure(50)

    // 题型标题（带装饰）
    ctx.space(8)
    ctx.draw('━'.repeat(40), 8, false, 0)
    ctx.space(2)
    ctx.draw(`▎${TYPE_LABELS[type]}（共${qs.length}题）`, 15, true)
    ctx.draw('━'.repeat(40), 8, false, 0)
    ctx.space(8)

    for (const q of qs) {
      globalIdx++
      ctx.ensure(60)

      // 题号行
      const src = sourceMode === 'chapter'
        ? `[${q.sectionName} · 第${q.chapter}章 · 第${q.questionNumber}题]`
        : `[P${q.page} · 第${q.questionNumber}题]`
      ctx.draw(`第${globalIdx}题  ${src}`, 9, true, 4)
      ctx.space(2)

      // 题目内容（公式转为可读文本）
      const content = hasCJK ? latexToText(q.content) : q.content.replace(/[^\x20-\x7E\t\n]/g, '')
      const lines = content.split('\n').map(l => l.trim()).filter(Boolean)

      for (const line of lines) {
        ctx.ensure(16)
        ctx.drawWrap(line, 10, false, 4)
      }
      ctx.space(8)
    }
  }

  // ========== 来源清单 ==========
  ctx.ensure(60)
  ctx.space(4)
  ctx.draw('━'.repeat(40), 8, false, 0)
  ctx.draw('▎题目来源', 14, true)
  ctx.draw('━'.repeat(40), 8, false, 0)
  ctx.space(4)

  for (const q of questions) {
    ctx.ensure(14)
    const src = sourceMode === 'chapter'
      ? `[${q.sectionName} · 第${q.chapter}章 · ${TYPE_LABELS[q.type]} · 第${q.questionNumber}题 (P${q.page})]`
      : `[P${q.page} · 第${q.questionNumber}题]`
    ctx.drawWrap(`${q.id}: ${src}`, 8, false, 4)
  }

  return doc
}

// ─── 导出接口 ──────────────────────────────────────────

export async function previewPdf(opts: PdfOptions): Promise<string> {
  const doc = await buildPdfDoc(opts.paper, opts.plan, opts.questions, opts.bookName, opts.subjectName, opts.sourceMode)
  const bytes = await doc.save()
  return URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }))
}

export async function downloadPdf(opts: PdfOptions) {
  const url = await previewPdf(opts)
  const a = document.createElement('a')
  a.href = url
  a.download = `${opts.plan.name}_${opts.paper.name}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
