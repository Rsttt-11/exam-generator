/** 考试类别 */
export interface Subject {
  id: string
  name: string
}

/** 题库 */
export interface Book {
  id: string
  name: string
  subject: string
}

/** 方案 */
export interface Plan {
  id?: number
  name: string
  subject: string
  book: string
  usedQuestions: string[]
  paperIds: string[]
  createdAt: string
  updatedAt: string
}
