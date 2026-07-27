import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentSubject = ref<string>('')
  const currentBook = ref<string>('')

  function setSubject(subject: string) {
    currentSubject.value = subject
  }

  function setBook(book: string) {
    currentBook.value = book
  }

  return {
    currentSubject,
    currentBook,
    setSubject,
    setBook,
  }
})