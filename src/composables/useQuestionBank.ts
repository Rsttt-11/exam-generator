import { ref } from 'vue'
import type { BookMeta, Question } from '@/types'
import { loadFromMarkdown } from '@/utils/markdownParser'

export function useQuestionBank() {
  const meta = ref<BookMeta | null>(null)
  const questions = ref<Question[]>([])
  const loading = ref(false)
  const error = ref('')

  /** 题库格式类型 */
  const bankMode = ref<'json' | 'markdown'>('json')

  async function loadBookMeta(subject: string, bookId: string) {
    loading.value = true
    error.value = ''
    try {
      // 优先尝试 Markdown 题库
      let url = `./markdown-bank/${subject}/${bookId}/book.json`
      let res = await fetch(url)
      if (res.ok) {
        meta.value = await res.json()
        bankMode.value = 'markdown'
        return
      }

      // 降级到 JSON 题库
      url = `./question-bank/${subject}/${bookId}/book.json`
      res = await fetch(url)
      if (res.ok) {
        meta.value = await res.json()
        bankMode.value = 'json'
        return
      }

      throw new Error('未找到 book.json')
    } catch (e) {
      console.error('Failed to load book meta:', e)
      error.value = '加载题库信息失败'
    } finally {
      loading.value = false
    }
  }

  async function loadChapterQuestions(subject: string, bookId: string, chapterId: number) {
    try {
      // JSON 模式
      if (bankMode.value === 'json') {
        const ch = String(chapterId).padStart(2, '0')
        const url = `./question-bank/${subject}/${bookId}/chapter${ch}.json`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Question[] = await res.json()
        return data
      }

      // Markdown 模式：从大文件中按章节拆取
      // 先确定文件所属（高数篇 / 线概篇）
      const categories = meta.value?.categories || []
      let mdFile = ''
      for (const cat of categories) {
        if (cat.chapters.includes(chapterId)) {
          mdFile = cat.id // gaoshu / xianshu / gailv
          break
        }
      }
      if (!mdFile) return []

      const url = `./markdown-bank/${subject}/${bookId}/${mdFile}.md`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()

      const allQs = loadFromMarkdown(text, {
        subject,
        book: bookId,
        chapters: meta.value?.chapters || [],
      })

      return allQs.filter(q => q.chapter === chapterId)
    } catch (e) {
      console.error('Failed to load chapter questions:', e)
      error.value = '加载题目失败'
      return []
    }
  }

  async function loadAllQuestions(subject: string, bookId: string) {
    if (!meta.value) return
    loading.value = true
    error.value = ''
    try {
      // Markdown 模式：直接加载整个文件解析所有题
      if (bankMode.value === 'markdown') {
        const categories = meta.value.categories || []
        const all: Question[] = []
        for (const cat of categories) {
          const url = `./markdown-bank/${subject}/${bookId}/${cat.id}.md`
          const res = await fetch(url)
          if (!res.ok) continue
          const text = await res.text()
          const qs = loadFromMarkdown(text, {
            subject,
            book: bookId,
            chapters: meta.value.chapters,
          })
          all.push(...qs)
        }
        questions.value = all
        return
      }

      // JSON 模式：逐章加载（原有逻辑）
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
    bankMode,
    loadBookMeta,
    loadChapterQuestions,
    loadAllQuestions,
  }
}
