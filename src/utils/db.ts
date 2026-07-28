import Dexie, { type EntityTable } from 'dexie'
import type { Plan, Paper, UserSettings } from '@/types'

class ExamDatabase extends Dexie {
  plans!: EntityTable<Plan, 'id'>
  papers!: EntityTable<Paper, 'id'>
  settings!: EntityTable<UserSettings, 'id'>

  constructor() {
    super('ExamGeneratorDB')
    this.version(1).stores({
      plans: '++id, subject, book, createdAt, updatedAt',
      papers: '++id, planId, createdAt',
      settings: '&id',
    })
  }
}

export const db = new ExamDatabase()
