/**
 * PDF 生成器 v3
 * - 本地字体优先（public/fonts/），CDN 保底
 * - 字体全部不可用时优雅提示降级
 * - 智能换行排版
 */

import { PDFDocument, rgb } from 'pdf-lib'
import type { PDFFont, PDFPage } from 'pdf-lib'
import type { Question, Paper, Plan } from '@/types'
import { TYPE_LABELS } from '@/types'

// Fontkit registered lazily inside buildPdfDoc (first embedFont call)

export interface PdfOptions {
  paper: Paper
  plan: Plan
  questions: Question[]
  bookName: string
  subjectName: string
  sourceMode: 'chapter' | 'page'
}

// ─── 字体加载策略 ──────────────────────────────────────

const FONT_URLS = [
  // ① 本地字体（优先级最高，零网络失败）
  './fonts/SourceHanSansCN-Regular.otf',
  // ② CDN 保底（Adobe 官方仓库）
  'https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@release/SubsetOTF/CN/SourceHanSansCN-Regular.otf',
  // ③ 备用 jsDelivr 镜像
  'https://cdn.jsdelivr.net/gh/niutech/Source-Han-Sans@gh-pages/SubsetOTF/CN/SourceHanSansCN-Regular.otf',
]

let fontCache: Uint8Array | null = null

async function fetchFontBytes(): Promise<Uint8Array | null> {
  if (fontCache) return fontCache

  for (const url of FONT_URLS) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (!res.ok) {
        console.warn(`[PDF] Font fetch failed: ${url} → HTTP ${res.status}`)
        continue
      }
      const bytes = new Uint8Array(await res.arrayBuffer())
      if (bytes.length < 1000) {
        console.warn(`[PDF] Font too small: ${url} → ${bytes.length} bytes`)
        continue
      }
      fontCache = bytes
      console.log(`[PDF] Font loaded from: ${url} (${(bytes.length / 1024).toFixed(0)}KB)`)
      return bytes
    } catch (e: any) {
      console.warn(`[PDF] Font fetch failed: ${url} → ${e?.message || e}`)
    }
  }
  return null
}

// ─── 内容渲染 ──────────────────────────────────────────

function renderText(raw: string): string {
  if (!raw) return ''
  return raw
    .replace(/\u{F0EE}/g, '(')          // 
    .replace(/\u{F0CB}/g, '[')          // 
    .replace(/\u{F0ED}/g, '[')          // 
    .replace(/\u{F0EA}/g, ']')          // 
    .replace(/\u{F0EC}/g, '(')          // 
    .replace(/\u{F0EB}/g, ')')          // 
    .replace(/\u{F0F4}|\u{F0F6}|\u{F0E2}/g, '|')  // 
    .replace(/\u{F0B6}/g, '∫')          // 
    .replace(/\u{F0B1}/g, '∑')          // 
    .replace(/[\u{F0E8}\u{F0E0}\u{F0E3}]/g, '{')
    .replace(/[\u{F0E9}\u{F0E1}\u{F0E4}]/g, '}')
    .replace(/\u{F0DC}/g, '[')
    .replace(/\u{F0B7}/g, '·')
    .replace(/\u{F092}/g, '→')
    .replace(/[\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}\u{200B}]/g, '')
    .trim()
}

function latexToText(raw: string): string {
  let s = renderText(raw)
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
  s = s.replace(/\^\{([^}]*)\}/g, '^$1')
  s = s.replace(/\_\{([^}]*)\}/g, '_{$1}')
  s = s.replace(/\\sqrt(?:\[([^\]]*)\])?\{([^}]*)\}/g, '√($2)')
  s = s.replace(/\\lim_?\{?([^}]*)\}?/g, 'lim')
  s = s.replace(/\\int/g, '∫')
  s = s.replace(/\\sum/g, '∑')
  s = s.replace(/\\(sin|cos|tan|cot|sec|csc|ln|lg|log)/g, '$1')
  s = s.replace(/\\(alpha|beta|gamma|delta|epsilon|zeta|eta|theta)/g, (_, m) => ({ alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ' })[m] || m)
  s = s.replace(/\\(pi|rho|sigma|tau|phi|chi|psi|omega)/g, (_, m) => ({ pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω' })[m] || m)
  s = s.replace(/\\infty/g, '∞')
  s = s.replace(/\\to|\\rightarrow/g, '→')
  s = s.replace(/\\partial/g, '∂')
  s = s.replace(/\\neq/g, '≠').replace(/\\geq/g, '≥').replace(/\\leq/g, '≤')
  s = s.replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\pm/g, '±')
  s = s.replace(/\\cdots/g, '…')
  s = s.replace(/\\([a-zA-Z]+)/g, '$1')
  return s.trim()
}

// ─── 布局引擎 ──────────────────────────────────────────

class PdfLayout {
  readonly doc: PDFDocument
  page!: PDFPage
  y!: number
  pageNum = 1
  readonly margin: number
  readonly usableW: number
  readonly font: PDFFont

  constructor(doc: PDFDocument, font: PDFFont, margin = 55) {
    this.doc = doc
    this.font = font
    this.margin = margin
    this.usableW = doc.getPage(0)?.getWidth() || 595 - 2 * margin
    this.addPage()
  }

  addPage() {
    this.page = this.doc.addPage([595, 842])
    this.y = 842 - this.margin
    this.pageNum++
    // 页脚页码
    this.drawCenter(`— ${this.pageNum} —`, 8)
    this.y -= 4
  }

  draw(text: string, size = 10, bold = false, indent = 0): void {
    const x = this.margin + indent
    this.page.drawText(text, { x, y: this.y, font: this.font, size, color: rgb(0, 0, 0) })
    this.y -= size + 2
  }

  drawCenter(text: string, size = 10): void {
    const tw = this.font.widthOfTextAtSize(text, size)
    this.page.drawText(text, { x: (595 - tw) / 2, y: this.y, font: this.font, size, color: rgb(0, 0, 0) })
    this.y -= size + 2
  }

  drawWrap(text: string, size = 10, indent = 0): void {
    const maxW = this.usableW - indent
    const lineH = size + 4
    const chars = [...text]
    let buf = ''
    for (const ch of chars) {
      if (this.font.widthOfTextAtSize(buf + ch, size) > maxW && buf) {
        this.ensureLine(lineH)
        this.page.drawText(buf, { x: this.margin + indent, y: this.y, font: this.font, size, color: rgb(0, 0, 0) })
        this.y -= lineH
        buf = ch
      } else {
        buf += ch
      }
    }
    if (buf) {
      this.ensureLine(lineH)
      this.page.drawText(buf, { x: this.margin + indent, y: this.y, font: this.font, size, color: rgb(0, 0, 0) })
      this.y -= lineH
    }
  }

  /** 标题装饰条 */
  drawTitleBar(text: string) {
    this.draw('─'.repeat(56), 8)
    this.draw(`  ${text}`, 13, true, 0)
    this.draw('─'.repeat(56), 8)
  }

  ensure(h: number) { if (this.y < this.margin + h) this.addPage() }
  ensureLine(h: number) { if (this.y < this.margin + h) this.addPage() }
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

  // 加载字体（本地优先）
  const fontBytes = await fetchFontBytes()
  let font: PDFFont
  let hasCJK = false

  if (fontBytes) {
    // Dynamic import fontkit to keep main bundle small
    const fontkit = await import('@pdf-lib/fontkit').then(m => m.default)
    doc.registerFontkit(fontkit)
    font = await doc.embedFont(fontBytes)
    hasCJK = true
  } else {
    // 所有字体都失败 → 先创建一个带错误信息的 page，返回部分内容
    const fallbackPage = doc.addPage([595, 842])
    fallbackPage.drawText('PDF generation failed: Chinese font could not be loaded.', { x: 50, y: 400, size: 14, color: rgb(0.8, 0.2, 0.2) })
    fallbackPage.drawText('Please check network connection and try again.', { x: 50, y: 380, size: 12, color: rgb(0.5, 0.5, 0.5) })
    return doc
  }

  const MARGIN = 50
  const ctx = new PdfLayout(doc, font, MARGIN)

  // ========== 封面 ==========
  {
    ctx.y = 842 * 0.35
    ctx.drawCenter('考研数学智能组卷', 26)
    ctx.space(4)
    ctx.drawCenter('—— 模拟试卷 ——', 14)
    ctx.space(24)
    ctx.drawCenter('─'.repeat(40), 8)
    ctx.space(16)
    ctx.drawCenter(`数学类别：${subjectName}`, 13)
    ctx.drawCenter(`题库名称：${bookName}`, 13)
    ctx.drawCenter(`方案名称：${plan.name}`, 13)
    ctx.drawCenter(`试卷编号：${paper.name}`, 13)
    ctx.drawCenter(`生成时间：${new Date(paper.createdAt).toLocaleString('zh-CN')}`, 11)
    ctx.space(14)
    const { choice, blank, answer } = paper.config
    ctx.drawCenter(`选择题 ${choice} 道 | 填空题 ${blank} 道 | 解答题 ${answer} 道`, 11)
    ctx.drawCenter(`共 ${questions.length} 题`, 11)
  }

  // ========== 试题部分 ==========
  const typeOrder = ['choice', 'blank', 'answer'] as const
  let globalIdx = 0

  for (const type of typeOrder) {
    const qs = questions.filter(q => q.type === type)
    if (!qs.length) continue

    ctx.ensure(70)
    ctx.space(8)
    ctx.drawTitleBar(`${TYPE_LABELS[type]}（共${qs.length}题）`)
    ctx.space(12)

    for (const q of qs) {
      globalIdx++
      ctx.ensure(60)

      ctx.draw(
        `第${globalIdx}题  [${sourceMode === 'chapter' ? q.sectionName + ' · 第' + q.chapter + '章' : 'P' + q.page}]`,
        9, true, 4
      )
      ctx.space(2)

      const content = latexToText(q.content)
      const lines = content.split('\n').map(l => l.trim()).filter(Boolean)

      for (const line of lines) {
        ctx.drawWrap(line, 10, 6)
      }
      ctx.space(10)
    }
  }

  // ========== 来源清单 ==========
  ctx.ensure(70)
  ctx.space(4)
  ctx.drawTitleBar(`题目来源（共${questions.length}题）`)
  ctx.space(8)

  for (const q of questions) {
    ctx.ensure(14)
    const src = sourceMode === 'chapter'
      ? `[${q.sectionName} · 第${q.chapter}章 · ${TYPE_LABELS[q.type]} · 第${q.questionNumber}题(P${q.page})]`
      : `[P${q.page} · 第${q.questionNumber}题]`
    ctx.drawWrap(`${q.id.slice(-12)}: ${src}`, 8, 4)
  }

  return doc
}

// ─── 导出 ──────────────────────────────────────────────

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
