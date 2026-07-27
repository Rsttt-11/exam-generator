import Dexie, { type EntityTable } from 'dexie'
import type { Plan } from '@/types'

class ExamDatabase extends Dexie {
  plans!: EntityTable<Plan, 'id'>

  constructor() {
    super('ExamGeneratorDB')
    this.version(1).stores({
      plans: '++id, subject, book, createdAt, updatedAt',
    })
  }
}

export const db = new ExamDatabase()
