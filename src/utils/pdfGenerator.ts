import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { PDFFont } from 'pdf-lib'
import type { Question, Paper, Plan } from '@/types'
import { TYPE_LABELS } from '@/types'

/** PDF generation options */
export interface PdfOptions {
  paper: Paper
  plan: Plan
  questions: Question[]
  bookName: string
  subjectName: string
  sourceMode: 'chapter' | 'page'
}

/**
 * Download a CJK font from CDN and cache it in memory for the session.
 * Tries multiple CDN sources for reliability across different regions.
 * Returns null if all downloads fail (Helvetica fallback will be used).
 */
const FONT_URLS = [
  // Primary: jsDelivr (fast globally)
  'https://cdn.jsdelivr.net/gh/nicktoump/Noto-Sans-CJK-SC@master/NotoSansCJKsc-Regular.ttf',
  // Fallback: GitHub raw
  'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/zh-Hans-CN/NotoSansCJKsc-Regular.otf',
  // Fallback: unpkg
  'https://unpkg.com/noto-sans-cjk-sc-regular@1.0.0/NotoSansCJKsc-Regular.ttf',
]

let fontCache: Uint8Array | null = null
let pending: Promise<Uint8Array | null> | null = null

async function tryFetchUrl(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = await res.arrayBuffer()
    return new Uint8Array(buf)
  } catch (e) {
    console.warn(`PDF font download failed (${url}):`, e)
    return null
  }
}

async function getFontBytes(): Promise<Uint8Array | null> {
  if (fontCache) return fontCache
  if (pending) return pending

  pending = (async () => {
    // Try each URL in order until one succeeds
    for (const url of FONT_URLS) {
      const bytes = await tryFetchUrl(url)
      if (bytes) {
        fontCache = bytes
        return fontCache
      }
    }
    console.error('All font download attempts failed, PDF will use Helvetica (no Chinese)')
    return null
  })()

  return pending
}

async function buildPdfDoc(
  paper: Paper,
  plan: Plan,
  questions: Question[],
  bookName: string,
  subjectName: string,
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

  let page = doc.addPage([595, 842]) // A4 portrait
  const margin = 50
  const pageWidth = 595
  const pageHeight = 842

  let y = pageHeight - margin
  const lineH = 16

  function drawText(text: string, opts?: { bold?: boolean; size?: number; align?: 'left' | 'center' }) {
    const f = opts?.bold ? boldFont : font
    const s = opts?.size || 10
    const align = opts?.align || 'left'
    const x = align === 'center' ? pageWidth / 2 : margin
    // Strip non-ASCII when no CJK font is available
    const safe = !fontBytes ? text.replace(/[^\x20-\x7E\t\n]/g, '') : text
    if (!safe) return
    page.drawText(safe, { x, y, font: f, size: s, color: rgb(0, 0, 0) })
    y -= s + 4
  }

  function newPage() {
    page = doc.addPage([595, 842])
    y = pageHeight - margin
  }

  function ensureSpace(needed: number) {
    if (y < margin + needed) newPage()
  }

  // === COVER PAGE ===
  y = pageHeight / 2 + 60
  drawText('考研数学智能组卷', { bold: true, size: 28, align: 'center' })
  y -= 8
  drawText('—— 模拟试卷 ——', { size: 14, align: 'center' })
  y -= 24
  drawText(`数学类别：${subjectName}`, { size: 12, align: 'center' })
  drawText(`题库名称：${bookName}`, { size: 12, align: 'center' })
  drawText(`方案名称：${plan.name}`, { size: 12, align: 'center' })
  drawText(`试卷编号：${paper.name}`, { size: 12, align: 'center' })
  drawText(`生成时间：${new Date(paper.createdAt).toLocaleString('zh-CN')}`, { size: 12, align: 'center' })
  y -= 16
  drawText(
    `选择题 ${paper.config.choice} 道  |  填空题 ${paper.config.blank} 道  |  解答题 ${paper.config.answer} 道`,
    { size: 11, align: 'center' },
  )

  // === CONTENT PAGES ===
  const types = ['choice', 'blank', 'answer'] as const
  let globalIdx = 0

  for (const type of types) {
    const qs = questions.filter((q) => q.type === type)
    if (qs.length === 0) continue

    ensureSpace(40)
    y -= 8
    drawText(TYPE_LABELS[type], { bold: true, size: 16 })

    for (const q of qs) {
      globalIdx++
      ensureSpace(80)

      const src =
        sourceMode === 'chapter'
          ? `${q.sectionName} → 第${q.chapter}章 → ${TYPE_LABELS[type]} → 第${q.questionNumber}题`
          : `P${q.page} → 第${q.questionNumber}题`

      drawText(`第${globalIdx}题  [${src}]`, { size: 9 })

      const content = q.content
        .replace(/\$\$([^$]+)\$\$/g, '$1')
        .replace(/\$([^$]+)\$/g, '$1')

      const lines = content.split('\n')
      for (const line of lines) {
        ensureSpace(lineH)
        if (line.trim()) {
          drawText(line.trim(), { size: 10 })
        } else {
          y -= 4
        }
      }
      y -= 6
    }
  }

  // === SOURCE LIST ===
  ensureSpace(60)
  y -= 10
  drawText('题目来源', { bold: true, size: 14 })
  y -= 4
  for (const q of questions) {
    ensureSpace(12)
    const src =
      sourceMode === 'chapter'
        ? `${q.sectionName} → 第${q.chapter}章 → ${TYPE_LABELS[q.type]} → 第${q.questionNumber}题 (P${q.page})`
        : `P${q.page} → 第${q.questionNumber}题`
    drawText(`${q.id}: ${src}`, { size: 8 })
  }

  return doc
}

/**
 * Build a PDF blob URL for preview (does NOT trigger download).
 * Caller is responsible for revoking the URL when done.
 */
export async function previewPdf(opts: PdfOptions): Promise<string> {
  const doc = await buildPdfDoc(
    opts.paper,
    opts.plan,
    opts.questions,
    opts.bookName,
    opts.subjectName,
    opts.sourceMode,
  )
  const pdfBytes = await doc.save()
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}

/**
 * Build and download a PDF for the given paper.
 */
export async function downloadPdf(opts: PdfOptions) {
  const url = await previewPdf(opts)
  const a = document.createElement('a')
  a.href = url
  a.download = `${opts.plan.name}_${opts.paper.name}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
