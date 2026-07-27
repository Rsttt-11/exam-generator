import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Subject, Book } from '@/types'

export const useAppStore = defineStore('app', () => {
  const currentSubject = ref<string>('')
  const currentBook = ref<string>('')

  const subjects: Subject[] = [
    { id: 'math1', name: '数学一' },
    { id: 'math2', name: '数学二' },
    { id: 'math3', name: '数学三' },
  ]

  const books: Book[] = [
    { id: 'lilin880', name: '李林880', subject: 'math1' },
  ]

  function setSubject(subject: string) {
    currentSubject.value = subject
    currentBook.value = ''
  }

  function setBook(book: string) {
    currentBook.value = book
  }

  function getBooksBySubject(subjectId: string): Book[] {
    return books.filter((b) => b.subject === subjectId)
  }

  return {
    currentSubject,
    currentBook,
    subjects,
    books,
    setSubject,
    setBook,
    getBooksBySubject,
  }
})
