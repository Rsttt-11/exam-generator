/**
 * PDF 生成器 v4 — 考卷排版
 * - 真实试卷布局：一、选择题 → 二、填空题 → 三、解答题
 * - 去除来源 ID 代码
 * - 紧凑美观排版
 */

import { PDFDocument, rgb } from 'pdf-lib'
import type { PDFFont } from 'pdf-lib'
import type { Question, Paper, Plan } from '@/types'
import { TYPE_LABELS } from '@/types'
import { reflowQuestion, splitToLines } from './reflow'

export interface PdfOptions {
  paper: Paper
  plan: Plan
  questions: Question[]
  bookName: string
  subjectName: string
  sourceMode: 'chapter' | 'page'
}

const PAGE_W = 595, PAGE_H = 842 // A4
const MARGIN = 58  // 左右
const MARGIN_T = 50  // 上
const MARGIN_B = 40  // 下

// ─── 字体 ──────────────────────────────────────────────

const FONT_URLS = [
  './fonts/SourceHanSansCN-Regular.otf',
  'https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@release/SubsetOTF/CN/SourceHanSansCN-Regular.otf',
]

let fontCache: Uint8Array | null = null

async function fetchFont(): Promise<Uint8Array | null> {
  if (fontCache) return fontCache
  for (const url of FONT_URLS) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
      if (!res.ok) continue
      const bytes = new Uint8Array(await res.arrayBuffer())
      if (bytes.length > 1000) { fontCache = bytes; return bytes }
    } catch { /* next */ }
  }
  return null
}

// ─── 内容渲染 ──────────────────────────────────────────

function renderText(raw: string): string {
  if (!raw) return ''
  return raw
    .replace(/\u{F0EE}/g, '(').replace(/\u{F0CB}/g, '[')
    .replace(/\u{F0ED}/g, '[').replace(/\u{F0EA}/g, ']')
    .replace(/\u{F0EC}/g, '(').replace(/\u{F0EB}/g, ')')
    .replace(/[\u{F0F4}\u{F0F6}\u{F0E2}]/g, '|')
    .replace(/\u{F0B6}/g, '∫').replace(/\u{F0B1}/g, '∑')
    .replace(/[\u{F0E8}\u{F0E0}\u{F0E3}]/g, '{')
    .replace(/[\u{F0E9}\u{F0E1}\u{F0E4}]/g, '}')
    .replace(/\u{F0DC}/g, '[').replace(/\u{F0B7}/g, '·').replace(/\u{F092}/g, '→')
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
  s = s.replace(/\\int/g, '∫').replace(/\\sum/g, '∑')
  s = s.replace(/\\(sin|cos|tan|cot|sec|csc|ln|lg|log)/g, '$1')
  s = s.replace(/\\alpha|α/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ')
  s = s.replace(/\\delta/g, 'δ').replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ')
  s = s.replace(/\\phi/g, 'φ').replace(/\\omega/g, 'ω')
  s = s.replace(/\\infty/g, '∞').replace(/\\to|\\rightarrow/g, '→')
  s = s.replace(/\\partial/g, '∂')
  s = s.replace(/\\neq/g, '≠').replace(/\\geq/g, '≥').replace(/\\leq/g, '≤')
  s = s.replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\pm/g, '±')
  s = s.replace(/\\cdots/g, '…')
  s = s.replace(/\\([a-zA-Z]+)/g, '$1')
  return s.trim()
}

// ─── 布局 ──────────────────────────────────────────────

class Layout {
  readonly doc: PDFDocument
  readonly font: PDFFont
  page!: PDFPage  // current page
  y!: number
  pageNum = 0

  constructor(doc: PDFDocument, font: PDFFont) {
    this.doc = doc
    this.font = font
    this.newPage()
  }

  newPage() {
    this.page = this.doc.addPage([PAGE_W, PAGE_H])
    this.y = PAGE_H - MARGIN_T
    this.pageNum++
  }

  /** 剩余可用高度 */
  get usableH() { return this.y - MARGIN_B }

  /** 确保可用高度足够 */
  ensure(h: number) {
    if (this.y - h < MARGIN_B) this.newPage()
  }

  /** 行间距 */
  line(h = 16) { this.y -= h }

  /** 单行文本 */
  text(s: string, size = 10.5, x = MARGIN) {
    this.page.drawText(s, { x, y: this.y, font: this.font, size, color: rgb(0, 0, 0) })
    this.line(size + 3)
  }

  /** 居中 */
  center(s: string, size = 10.5) {
    const tw = this.font.widthOfTextAtSize(s, size)
    this.page.drawText(s, { x: (PAGE_W - tw) / 2, y: this.y, font: this.font, size, color: rgb(0, 0, 0) })
    this.line(size + 3)
  }

  /** 自动换行（按字符） */
  wrap(s: string, size = 10.5, indent = 0) {
    if (!s) return
    const maxW = PAGE_W - 2 * MARGIN - indent
    const lh = size + 4
    const cs = [...s]
    let buf = ''
    for (const c of cs) {
      if (this.font.widthOfTextAtSize(buf + c, size) > maxW && buf) {
        this.ensure(lh)
        this.page.drawText(buf, { x: MARGIN + indent, y: this.y, font: this.font, size, color: rgb(0, 0, 0) })
        this.y -= lh
        buf = c
      } else { buf += c }
    }
    if (buf) {
      this.ensure(lh)
      this.page.drawText(buf, { x: MARGIN + indent, y: this.y, font: this.font, size, color: rgb(0, 0, 0) })
      this.y -= lh
    }
  }

  /** 横线 */
  lineHr() {
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_W - MARGIN, y: this.y },
      thickness: 0.6,
      color: rgb(0.6, 0.6, 0.6),
    })
    this.y -= 6
  }
}

// ─── 构建 ──────────────────────────────────────────────

async function buildDoc(opts: PdfOptions) {
  const doc = await PDFDocument.create()
  const fontBytes = await fetchFont()
  if (!fontBytes) {
    const p = doc.addPage([PAGE_W, PAGE_H])
    p.drawText('字体加载失败，请检查网络后重试', { x: 100, y: 420, size: 16, color: rgb(0.8, 0.2, 0.2) })
    return doc
  }

  const fontkit = await import('@pdf-lib/fontkit').then(m => m.default)
  doc.registerFontkit(fontkit)
  const font = await doc.embedFont(fontBytes)
  const ctx = new Layout(doc, font)

  // ===== 封面 =====
  {
    ctx.y = PAGE_H * 0.36
    ctx.center('2027 考研数学', 28)
    ctx.line(6)
    ctx.center('模拟试卷', 22)
    ctx.line(30)
    ctx.lineHr()
    ctx.line(16)
    ctx.center(`数学类别：${opts.subjectName}`, 13)
    ctx.center(`方案名称：${opts.plan.name}`, 13)
    ctx.center(`试卷编号：${opts.paper.name}`, 13)
    ctx.center(`生成时间：${new Date(opts.paper.createdAt).toLocaleString('zh-CN')}`, 11)
    ctx.line(14)
    const { choice, blank, answer } = opts.paper.config
    ctx.center(`一、选择题 ${choice} 道  二、填空题 ${blank} 道  三、解答题 ${answer} 道`, 11)
    ctx.center(`共计 ${opts.questions.length} 题`, 11)
  }

  // ===== 试题 =====
  const SECTION = [
    { type: 'choice' as const, num: '一', label: '选择题' },
    { type: 'blank' as const, num: '二', label: '填空题' },
    { type: 'answer' as const, num: '三', label: '解答题' },
  ] as const

  let globalNo = 0  // 题目序号（全局）

  for (const sec of SECTION) {
    const qs = opts.questions.filter(q => q.type === sec.type)
    if (!qs.length) continue

    ctx.ensure(30)
    ctx.line(8)

    // 题型标题（如：一、选择题（共10题））
    ctx.text(`${sec.num}、${sec.label}（共${qs.length}题）`, 14, MARGIN)
    ctx.line(4)

    for (const q of qs) {
      globalNo++
      ctx.ensure(24)

      const raw = latexToText(q.content)
      // 用 reflow 合并断裂行
      const content = reflowQuestion(raw)
      const lines = splitToLines(content)

      // 题目内容（第一行带题号）
      for (let li = 0; li < lines.length; li++) {
        const line = lines[li]
        const isOpt = /^[A-D]\s*[.、）)]/.test(line)

        if (isOpt) {
          // 选项缩进
          ctx.wrap(line, 10.5, 28)
        } else if (li === 0) {
          // 第一行（含题号）
          ctx.wrap(line, 10.5, 0)
        } else {
          // 普通续行
          ctx.wrap(line, 10.5, 22)
        }
      }
      ctx.line(2)

      // 解答题留空
      if (q.type === 'answer') {
        ctx.ensure(40)
        ctx.line(30)
      }

      ctx.line(4)
    }
  }

  // ===== 题目来源（来源清单） =====
  ctx.ensure(50)
  ctx.line(10)
  ctx.center('─'.repeat(40), 8)
  ctx.text('题目来源', 11)
  ctx.center('─'.repeat(40), 8)
  ctx.line(6)
  for (const q of opts.questions) {
    ctx.ensure(14)
    const src = opts.sourceMode === 'chapter'
      ? `[${q.sectionName} · 第${q.chapter}章 · ${TYPE_LABELS[q.type]} · 第${q.questionNumber}题(P${q.page})]`
      : `[P${q.page} · 第${q.questionNumber}题]`
    ctx.wrap(src, 8, 10)
  }

  return doc
}

// ─── 导出 ──────────────────────────────────────────────

export async function previewPdf(opts: PdfOptions): Promise<string> {
  const doc = await buildDoc(opts)
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
