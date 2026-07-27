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