import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { Question, Paper, Plan } from '@/types'
import { TYPE_LABELS } from '@/types'

/** PDF generation options */
export interface PdfOptions {
  paper: Paper
  plan: Plan
  questions: Question[]
  bookName: string
  subjectName: string
  sourceMode: 'chapter' | 'page' // 来源显示方式
}

/**
 * Build and download a PDF for the given paper.
 */
export async function downloadPdf(opts: PdfOptions) {
  const { paper, plan, questions, bookName, subjectName, sourceMode } = opts

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

  let page = doc.addPage([595, 842]) // A4
  const margin = 50
  const pageWidth = 595
  const pageHeight = 842

  let y = pageHeight - margin
  const lineHeight = 16
  const smallLineHeight = 12

  function drawText(text: string, opts?: { bold?: boolean; size?: number; align?: 'left' | 'center' }) {
    const f = opts?.bold ? boldFont : font
    const s = opts?.size || 10
    const align = opts?.align || 'left'
    const x = align === 'center' ? pageWidth / 2 : margin
    page.drawText(text, { x, y, font: f, size: s, color: rgb(0, 0, 0) })
    y -= s + 4
  }

  function newPage() {
    page = doc.addPage([595, 842])
    y = pageHeight - margin
  }

  function ensureSpace(needed: number) {
    if (y < margin + needed) {
      newPage()
    }
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
  drawText(`选择题 ${paper.config.choice} 道  |  填空题 ${paper.config.blank} 道  |  解答题 ${paper.config.answer} 道`, {
    size: 11,
    align: 'center',
  })

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

      // Question header
      const srcText =
        sourceMode === 'chapter'
          ? `${q.sectionName} → 第${q.chapter}章 → ${TYPE_LABELS[type]} → 第${q.questionNumber}题`
          : `P${q.page} → 第${q.questionNumber}题`

      drawText(`第${globalIdx}题  [${srcText}]`, { size: 9 })

      // Question content - strip markdown, keep plain text
      let content = q.content
      // Remove LaTeX markers for plain PDF (no KaTeX in pdf-lib)
      content = content.replace(/\$\$([^$]+)\$\$/g, '$1')
      content = content.replace(/\$([^$]+)\$/g, '$1')
      // Replace \frac, \sin, \lim, etc with readable text
      content = content.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      content = content.replace(/\\sin/g, 'sin')
      content = content.replace(/\\cos/g, 'cos')
      content = content.replace(/\\lim/g, 'lim')
      content = content.replace(/\\to/g, '→')
      content = content.replace(/\\infty/g, '∞')
      content = content.replace(/\\cdot/g, '·')
      content = content.replace(/\\ln/g, 'ln')
      content = content.replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      content = content.replace(/\\mathbb\{R\}/g, 'ℝ')
      content = content.replace(/\\begin\{cases\}(.+?)\\end\{cases\}/gs, '{$1')

      // Split into lines for readability
      const lines = content.split('\n')
      for (const line of lines) {
        ensureSpace(lineHeight)
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
    ensureSpace(smallLineHeight)
    const srcText =
      sourceMode === 'chapter'
        ? `${q.sectionName} → 第${q.chapter}章 → ${TYPE_LABELS[q.type]} → 第${q.questionNumber}题 (P${q.page})`
        : `P${q.page} → 第${q.questionNumber}题 (${q.sectionName}, 第${q.chapter}章)`
    drawText(`${q.id}: ${srcText}`, { size: 8 })
  }

  const pdfBytes = await doc.save()
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${plan.name}_${paper.name}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}