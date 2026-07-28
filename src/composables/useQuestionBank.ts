import { ref } from 'vue'
import type { BookMeta, Question } from '@/types'

export function useQuestionBank() {
  const meta = ref<BookMeta | null>(null)
  const questions = ref<Question[]>([])
  const loading = ref(false)
  const error = ref('')

  async function loadBookMeta(subject: string, bookId: string) {
    loading.value = true
    error.value = ''
    try {
      const url = `./question-bank/${subject}/${bookId}/book.json`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      meta.value = await res.json()
    } catch (e) {
      console.error('Failed to load book meta:', e)
      error.value = '加载题库信息失败'
    } finally {
      loading.value = false
    }
  }

  async function loadChapterQuestions(subject: string, bookId: string, chapterId: number) {
    try {
      const ch = String(chapterId).padStart(2, '0')
      const url = `./question-bank/${subject}/${bookId}/chapter${ch}.json`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Question[] = await res.json()
      return data
    } catch (e) {
      console.error('Failed to load chapter questions:', e)
      error.value = '加载题目失败'
      return []
    } finally {
      // loading is managed by loadAllQuestions
    }
  }

  async function loadAllQuestions(subject: string, bookId: string) {
    if (!meta.value) return
    loading.value = true
    error.value = ''
    try {
      const all: Question[] = []
      for (const ch of meta.value.chapters) {
        const qs = await loadChapterQuestions(subject, bookId, ch.id)
        all.push(...qs)
      }
      questions.value = all
    } catch (e) {
      console.error('Failed to load all questions:', e)
      error.value = '加载题目失败'
    } finally {
      loading.value = false
    }
  }

  return {
    meta,
    questions,
    loading,
    error,
    loadBookMeta,
    loadChapterQuestions,
    loadAllQuestions,
  }
}
