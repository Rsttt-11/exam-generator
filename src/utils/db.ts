import Dexie, { type EntityTable } from 'dexie'
import type { Plan, Paper } from '@/types'

class ExamDatabase extends Dexie {
  plans!: EntityTable<Plan, 'id'>
  papers!: EntityTable<Paper, 'id'>

  constructor() {
    super('ExamGeneratorDB')
    this.version(1).stores({
      plans: '++id, subject, book, createdAt, updatedAt',
    })
    this.version(2).stores({
      plans: '++id, subject, book, createdAt, updatedAt',
      papers: '++id, planId, createdAt',
    })
  }
}

export const db = new ExamDatabase()