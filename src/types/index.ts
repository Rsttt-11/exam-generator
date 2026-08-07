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
  paperIds: number[]
  createdAt: string
  updatedAt: string
}

/** 分类（高数/线代/概率等） */
export interface Category {
  id: string
  name: string
  chapters: number[]
}

/** 分类（基础篇/综合篇/拓展篇等） */
export interface Section {
  id: string
  name: string
}

/** 章节元数据 */
export interface ChapterMeta {
  id: number
  name: string
  category?: string
}

/** 题库元数据（book.json） */
export interface BookMeta {
  id: string
  name: string
  year: number
  subject: string
  categories?: Category[]
  sections: Section[]
  chapters: ChapterMeta[]
}

/** 题目 */
export interface Question {
  id: string
  subject: string
  book: string
  sectionId: string
  sectionName: string
  chapter: number
  chapterName: string
  type: 'choice' | 'blank' | 'answer'
  questionNumber: number
  page: number
  content: string
  answer: string
  analysis: string
  images: string[]
  tags: string[]
}

/** 组卷配置 */
export interface ExamConfig {
  sections: string[]
  chapters: number[]
  choice: number
  blank: number
  answer: number
  /** 按分类的题型数量：categoryId -> { choice, blank, answer } */
  categoryCounts?: Record<string, { choice: number; blank: number; answer: number }>
}

/** 历史试卷 */
export interface Paper {
  id?: number
  planId: number
  name: string
  questionIds: string[]
  config: ExamConfig
  createdAt: string
}

/** 题型中文映射 */
export const TYPE_LABELS: Record<string, string> = {
  choice: '选择题',
  blank: '填空题',
  answer: '解答题',
}

/** 用户设置 */
export interface UserSettings {
  id?: string
  defaultChoice: number
  defaultBlank: number
  defaultAnswer: number
  pdfSourceMode: 'chapter' | 'page'
  pdfSourceOrder: 'questionNumber' | 'page'
  pdfFontSize: number
  pdfMargin: number
  theme: 'light' | 'dark' | 'system'
}