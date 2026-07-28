/**
 * PDF 生成器 v2
 * - 中文字体：多 CDN 容错（思源黑体已验证可用）
 * - 公式渲染：LaTeX/PUA 字符→可读文本
 * - 自动分页，智能换行
 * - 题目来源标注，题型分区
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

// ─── 字体 ──────────────────────────────────────────────

/** 按优先级排列的字体 CDN URL */
const FONT_URLS = [
  // ① 思源黑体 (Adobe 官方 jsDelivr 镜像) — 已验证可用
  'https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@release/SubsetOTF/CN/SourceHanSansCN-Regular.otf',
  // ② SourceHanSansCN-Regular.otf (cnpmjs 镜像)
  'https://cdn.jsdelivr.net/gh/niutech/Source-Han-Sans@gh-pages/SubsetOTF/CN/SourceHanSansCN-Regular.otf',
  // ③ 备用：unpkg noto-sans-cjk-sc
  'https://unpkg.com/noto-sans-cjk-sc-regular@1.0.0/NotoSansCJKsc-Regular.ttf',
]

let fontCache: Uint8Array | null = null
let pending: Promise<Uint8Array | null> | null = null

async function tryFetchUrl(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return new Uint8Array(await res.arrayBuffer())
  } catch {
    return null
  }
}

async function getFontBytes(): Promise<Uint8Array | null> {
  if (fontCache) return fontCache
  if (pending) return pending
  pending = (async () => {
    for (const url of FONT_URLS) {
      const bytes = await tryFetchUrl(url)
      if (bytes && bytes.length > 1000) {
        fontCache = bytes
        return bytes
      }
    }
    return null
  })()
  return pending
}

// ─── 渲染清洗 ──────────────────────────────────────────

/** 浏览器端渲染用：去除残留 PUA */
function renderText(raw: string): string {
  if (!raw) return ''
  return raw
    // PUA 字符 → 标准符号
    .replace(/\u{F0EE}/g, '(')         //  → (
    .replace(/\u{F0ED}\u{F0EA}/g, '[') // 或 → [
    .replace(/\u{F0CB}/g, '[')         //  → [
    .replace(/\u{F0EC}/g, '(')         //  → (
    .replace(/\u{F0EB}/g, ')')         //  → )
    .replace(/\u{F0F4}|\u{F0F6}|\u{F0E2}/g, '|') //  → |
    .replace(/\u{F0B6}/g, '∫')         //  → ∫
    .replace(/\u{F0B1}/g, '∑')         //  → ∑
    .replace(/\u{F0E8}|\u{F0E0}|\u{F0E3}/g, '{') // 花括号开
    .replace(/\u{F0E9}|\u{F0E1}|\u{F0E4}/g, '}') // 花括号闭
    .replace(/\u{F0DC}/g, '[')         //  → [
    .replace(/\u{F0B7}/g, '·')         //  → ·
    .replace(/\u{F092}/g, '→')          //  → →
    // 删除垃圾字符
    .replace(/[\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}\u{200B}]/g, '')
    .trim()
}

/** PDF 内用：进一步做公式本地化渲染 */
function latexToText(raw: string): string {
  let s = renderText(raw)
  // 分式 \frac{a}{b}
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
  // 上标/下标
  s = s.replace(/\^\{([^}]*)\}/g, '^$1')
  s = s.replace(/\_\{([^}]*)\}/g, '_$1')
  s = s.replace(/\^([a-zA-Z0-9])/g, '^$1')
  s = s.replace(/_([a-zA-Z0-9])/g, '_$1')
  // 根号
  s = s.replace(/\\sqrt(?:\[([^\]]*)\])?\{([^}]*)\}/g, '√($2)')
  // 极限
  s = s.replace(/\\lim_?\{?([^}]*)\}?/g, 'lim($1)')
  // 积分/求和
  s = s.replace(/\\int/g, '∫')
  s = s.replace(/\\sum/g, '∑')
  // 三角函数
  s = s.replace(/\\(sin|cos|tan|cot|sec|csc)/g, '$1')
  s = s.replace(/\\(arcsin|arccos|arctan)/g, '$1')
  s = s.replace(/\\(ln|lg|log)/g, '$1')
  // 希腊字母
  s = s.replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ')
  s = s.replace(/\\delta/g, 'δ').replace(/\\epsilon/g, 'ε').replace(/\\zeta/g, 'ζ')
  s = s.replace(/\\eta/g, 'η').replace(/\\theta/g, 'θ').replace(/\\iota/g, 'ι')
  s = s.replace(/\\kappa/g, 'κ').replace(/\\lambda/g, 'λ').replace(/\\mu/g, 'μ')
  s = s.replace(/\\nu/g, 'ν').replace(/\\xi/g, 'ξ').replace(/\\pi/g, 'π')
  s = s.replace(/\\rho/g, 'ρ').replace(/\\sigma/g, 'σ').replace(/\\tau/g, 'τ')
  s = s.replace(/\\upsilon/g, 'υ').replace(/\\phi/g, 'φ').replace(/\\chi/g, 'χ')
  s = s.replace(/\\psi/g, 'ψ').replace(/\\omega/g, 'ω')
  // 数学符号
  s = s.replace(/\\infty/g, '∞').replace(/\\to/g, '→').replace(/\\rightarrow/g, '→')
  s = s.replace(/\\leftarrow/g, '←').replace(/\\partial/g, '∂')
  s = s.replace(/\\cdots/g, '…').replace(/\\vdots/g, '⋮').replace(/\\ddots/g, '⋱')
  s = s.replace(/\\neq/g, '≠').replace(/\\geq/g, '≥').replace(/\\leq/g, '≤')
  s = s.replace(/\\approx/g, '≈').replace(/\\times/g, '×').replace(/\\div/g, '÷')
  s = s.replace(/\\pm/g, '±').replace(/\\mp/g, '∓').replace(/\\circ/g, '°')
  // 花括号转义
  s = s.replace(/\\\{/g, '{').replace(/\\\}/g, '}')
  s = s.replace(/\\\(/g, '(').replace(/\\\)/g, ')')
  s = s.replace(/\\\[/g, '[').replace(/\\\]/g, ']')
  // 残留反斜杠
  s = s.replace(/\\([a-zA-Z]+)/g, '$1')
  // 合并空格
  s = s.replace(/\s+/g, ' ')
  return s.trim()
}

// ─── 布局引擎 ──────────────────────────────────────────

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
  readonly margin: number

  constructor(doc: PDFDocument, opts: LayoutOpts) {
    this.doc = doc
    this.opts = opts
    this.usableW = opts.pageWidth - 2 * opts.margin
    this.margin = opts.margin
    this._addPage()
  }

  private _addPage() {
    this.page = this.doc.addPage([this.opts.pageWidth, this.opts.pageHeight])
    this.y = this.opts.pageHeight - this.opts.margin
    this.pageNum++
    // 页眉页脚
    this._drawFooter()
  }

  private _drawFooter() {
    const text = `— ${this.pageNum} —`
    const f = this.opts.font
    const tw = f.widthOfTextAtSize(text, 8)
    this.page.drawText(text, {
      x: (this.opts.pageWidth - tw) / 2,
      y: 20,
      font: f,
      size: 8,
      color: rgb(0.65, 0.65, 0.65),
    })
  }

  get font() { return this.opts.font }
  get bold() { return this.opts.boldFont }

  /** 单行文本 */
  draw(text: string, size = 10, bold = false, indent = 0): void {
    const f = bold ? this.bold : this.font
    const x = this.margin + indent
    this.page.drawText(text, { x, y: this.y, font: f, size, color: rgb(0, 0, 0) })
    this.y -= size + 2
  }

  /** 居中 */
  drawCenter(text: string, size = 10, bold = false): void {
    const f = bold ? this.bold : this.font
    const tw = f.widthOfTextAtSize(text, size)
    const x = (this.opts.pageWidth - tw) / 2
    this.page.drawText(text, { x, y: this.y, font: f, size, color: rgb(0, 0, 0) })
    this.y -= size + 2
  }

  /** 自动换行文本 */
  drawWrap(text: string, size = 10, bold = false, indent = 0): void {
    const f = bold ? this.bold : this.font
    const maxW = this.usableW - indent
    const lineH = size + 3
    const chars = [...text]
    let buf = ''
    for (const ch of chars) {
      const testW = f.widthOfTextAtSize(buf + ch, size)
      if (testW > maxW && buf) {
        this._ensureLine(lineH)
        this.page.drawText(buf, { x: this.margin + indent, y: this.y, font: f, size, color: rgb(0, 0, 0) })
        this.y -= lineH
        buf = ch
      } else {
        buf += ch
      }
    }
    if (buf) {
      this._ensureLine(lineH)
      this.page.drawText(buf, { x: this.margin + indent, y: this.y, font: f, size, color: rgb(0, 0, 0) })
      this.y -= lineH
    }
  }

  private _ensureLine(h: number) {
    if (this.y < this.margin + h) this._addPage()
  }

  /** 确保至少 h 空白 */
  ensure(h: number) {
    if (this.y < this.margin + h) this._addPage()
  }

  /** 分隔线 */
  drawHr() {
    this.page.drawLine({
      start: { x: this.margin, y: this.y },
      end: { x: this.opts.pageWidth - this.margin, y: this.y },
      thickness: 0.8,
      color: rgb(0.75, 0.75, 0.75),
    })
    this.y -= 10
  }

  space(h = 6) { this.y -= h }
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
  let hasCJK = false

  if (fontBytes) {
    // 中文字体嵌入
    font = await doc.embedFont(fontBytes)
    boldFont = font
    hasCJK = true
  } else {
    // 回退：仅英文（会忽略中文内容）
    font = await doc.embedFont(StandardFonts.Helvetica)
    boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  }

  const PAGE_W = 595, PAGE_H = 842 // A4
  const MARGIN = 55

  const ctx = new PdfLayout(doc, { font, boldFont, hasCJK, pageWidth: PAGE_W, pageHeight: PAGE_H, margin: MARGIN })

  // ========== 封面 ==========
  {
    ctx.y = PAGE_H * 0.38
    ctx.drawCenter('考研数学智能组卷', 26, true)
    ctx.space(4)
    ctx.drawCenter('—— 模拟试卷 ——', 14)
    ctx.space(20)
    ctx.drawHr()
    ctx.space(14)
    ctx.drawCenter(`数学类别：${subjectName}`, 13)
    ctx.drawCenter(`题库名称：${bookName}`, 13)
    ctx.drawCenter(`方案名称：${plan.name}`, 13)
    ctx.drawCenter(`试卷编号：${paper.name}`, 13)
    ctx.drawCenter(`生成时间：${new Date(paper.createdAt).toLocaleString('zh-CN')}`, 11)
    ctx.space(12)
    const types = paper.config
    ctx.drawCenter(`选择题 ${types.choice} 道 | 填空题 ${types.blank} 道 | 解答题 ${types.answer} 道`, 11)
    ctx.drawCenter(`共 ${questions.length} 题`, 11)
  }

  // ========== 试卷内容 ==========
  const typeOrder = ['choice', 'blank', 'answer'] as const
  let globalIdx = 0

  for (const type of typeOrder) {
    const qs = questions.filter(q => q.type === type)
    if (!qs.length) continue
    ctx.ensure(60)

    // 题型标题
    ctx.draw('━'.repeat(48), 8)
    ctx.space(2)
    ctx.draw(`▎${TYPE_LABELS[type]}（共${qs.length}题）`, 14, true)
    ctx.draw('━'.repeat(48), 8)
    ctx.space(10)

    for (const q of qs) {
      globalIdx++
      ctx.ensure(60)

      // 题号 + 来源
      const src = sourceMode === 'chapter'
        ? `[${q.sectionName} · 第${q.chapter}章]`
        : `[P${q.page}]`
      const content = hasCJK ? latexToText(q.content) : q.content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')

      ctx.draw(`第${globalIdx}题  ${src}`, 9, true, 4)
      ctx.space(2)

      // 渲染内容
      const lines = content.split('\n').map(l => l.trim()).filter(Boolean)
      for (const line of lines) {
        ctx.drawWrap(line, 10, false, 6)
      }
      ctx.space(10)
    }
  }

  // ========== 来源清单 ==========
  ctx.ensure(60)
  ctx.space(4)
  ctx.draw('━'.repeat(48), 8)
  ctx.draw('▎题目来源（共' + questions.length + '题）', 12, true)
  ctx.draw('━'.repeat(48), 8)
  ctx.space(6)

  for (const q of questions) {
    ctx.ensure(14)
    const src = sourceMode === 'chapter'
      ? `[${q.sectionName} · 第${q.chapter}章 · ${TYPE_LABELS[q.type]} · 第${q.questionNumber}题(P${q.page})]`
      : `[P${q.page} · 第${q.questionNumber}题]`
    ctx.drawWrap(`${q.id.slice(-12)}: ${src}`, 8, false, 4)
  }

  return doc
}

// ─── 导出接口 ──────────────────────────────────────────

export async function previewPdf(opts: PdfOptions): Promise<string> {
  const doc = await buildPdfDoc(opts.paper, opts.plan, opts.questions, opts.bookName, opts.subjectName, opts.sourceMode)
  const bytes = await doc.save()
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
}

export async function downloadPdf(opts: PdfOptions) {
  const url = await previewPdf(opts)
  const a = document.createElement('a')
  a.href = url
  a.download = `${opts.plan.name}_${opts.paper.name}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
