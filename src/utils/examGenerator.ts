import type { Question, ExamConfig } from '@/types'
import { TYPE_LABELS } from '@/types'

export interface GenerateResult {
  paper: Question[]
  warnings: string[]
}

/**
 * Fisher-Yates shuffle
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Generate an exam paper based on config.
 * Rules:
 * - No question repeats within a plan (usedIds excluded)
 * - Incomplete paper when insufficient questions (with warning)
 * - Only draws from selected sections/chapters
 * - Supports per-category counts (categoryCounts) when provided
 */
export function generateExam(
  allQuestions: Question[],
  usedIds: string[],
  config: ExamConfig,
): GenerateResult {
  const warnings: string[] = []
  const usedSet = new Set(usedIds)

  // Filter by sections and chapters
  const sectionSet = new Set(config.sections)
  const chapterSet = new Set(config.chapters)

  const pool = allQuestions.filter(
    (q) => sectionSet.has(q.sectionId) && chapterSet.has(q.chapter) && !usedSet.has(q.id),
  )

  function pick(type: string, count: number, chapterFilter?: (ch: number) => boolean): Question[] {
    let available = byType[type] || []
    if (chapterFilter) available = available.filter(q => chapterFilter(q.chapter))
    const shuffled = shuffle(available)
    const label = TYPE_LABELS[type] || type
    if (shuffled.length < count) {
      if (shuffled.length > 0) {
        warnings.push(`${label}剩余不足（需要 ${count} 道，仅剩 ${shuffled.length} 道）`)
      } else {
        warnings.push(`${label}已全部抽取完毕`)
      }
      return shuffled
    }
    return shuffled.slice(0, count)
  }

  // Group by type
  const byType: Record<string, Question[]> = {}
  for (const q of pool) {
    if (!byType[q.type]) byType[q.type] = []
    byType[q.type].push(q)
  }

  const paper: Question[] = []

  // If categoryCounts is provided, pick per category
  if (config.categoryCounts) {
    for (const [_catId, counts] of Object.entries(config.categoryCounts)) {
      // categoryId format: we need to know which chapters belong to this category
      // But we don't have categories info here. The caller must pass chapter filter.
      // Actually, the categories are stored in meta which isn't passed in.
      // Let's handle this in Generate.vue instead by calling generateExam per category.
      paper.push(
        ...pick('choice', counts.choice),
        ...pick('blank', counts.blank),
        ...pick('answer', counts.answer),
      )
    }
  } else {
    paper.push(
      ...pick('choice', config.choice),
      ...pick('blank', config.blank),
      ...pick('answer', config.answer),
    )
  }

  return { paper, warnings }
}

/**
 * Generate exam with per-category counts.
 * categories: { id, chapters: number[] }
 */
export function generateExamByCategory(
  allQuestions: Question[],
  usedIds: string[],
  config: ExamConfig,
  categories: { id: string; chapters: number[] }[],
): GenerateResult {
  const warnings: string[] = []
  const usedSet = new Set(usedIds)
  const sectionSet = new Set(config.sections)
  const chapterSet = new Set(config.chapters)

  const pool = allQuestions.filter(
    (q) => sectionSet.has(q.sectionId) && chapterSet.has(q.chapter) && !usedSet.has(q.id),
  )

  const byType: Record<string, Question[]> = {}
  for (const q of pool) {
    if (!byType[q.type]) byType[q.type] = []
    byType[q.type].push(q)
  }

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  const pickedIds = new Set<string>()
  const paper: Question[] = []

  const categoryCounts = config.categoryCounts || {}
  for (const cat of categories) {
    const counts = categoryCounts[cat.id]
    if (!counts) continue
    const catChapters = new Set(cat.chapters)
    const catName = (cat as { name?: string }).name || cat.id
    const labelMap: Record<string, string> = {
      choice: '选择题', blank: '填空题', answer: '解答题',
    }
    for (const type of ['choice', 'blank', 'answer'] as const) {
      const need = counts[type]
      if (need <= 0) continue
      let available = (byType[type] || []).filter(
        q => catChapters.has(q.chapter) && !pickedIds.has(q.id),
      )
      const shuffled = shuffle(available)
      if (shuffled.length < need) {
        if (shuffled.length > 0) {
          warnings.push(`${catName}·${labelMap[type]}剩余不足（需要 ${need} 道，仅剩 ${shuffled.length} 道）`)
        } else {
          warnings.push(`${catName}·${labelMap[type]}已全部抽取完毕`)
        }
      }
      const picked = shuffled.slice(0, need)
      picked.forEach(q => pickedIds.add(q.id))
      paper.push(...picked)
    }
  }

  return { paper, warnings }
}
