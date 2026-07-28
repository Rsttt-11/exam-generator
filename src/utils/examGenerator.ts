import type { Question, ExamConfig } from '@/types'

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

  // Group by type
  const byType: Record<string, Question[]> = {}
  for (const q of pool) {
    if (!byType[q.type]) byType[q.type] = []
    byType[q.type].push(q)
  }

  function pick(type: string, count: number): Question[] {
    const available = byType[type] || []
    const shuffled = shuffle(available)
    if (shuffled.length < count) {
      if (shuffled.length > 0) {
        warnings.push(`"${type}" 型题目剩余不足（需要 ${count} 道，仅剩 ${shuffled.length} 道）`)
      } else {
        warnings.push(`"${type}" 型题目已全部抽取完毕`)
      }
      return shuffled
    }
    return shuffled.slice(0, count)
  }

  const paper: Question[] = [
    ...pick('choice', config.choice),
    ...pick('blank', config.blank),
    ...pick('answer', config.answer),
  ]

  return { paper, warnings }
}
