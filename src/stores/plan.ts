import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/utils/db'
import type { Plan } from '@/types'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'

export const usePlanStore = defineStore('plan', () => {
  const plans = ref<Plan[]>([])
  const loading = ref(false)

  const appStore = useAppStore()

  async function loadPlans() {
    loading.value = true
    try {
      const subject = appStore.currentSubject
      const book = appStore.currentBook
      if (!subject || !book) {
        plans.value = []
        return
      }
      plans.value = await db.plans
        .where({ subject, book })
        .reverse()
        .sortBy('createdAt')
    } catch (e) {
      console.error('Failed to load plans:', e)
      ElMessage.error('加载方案失败')
    } finally {
      loading.value = false
    }
  }

  async function createPlan() {
    const subject = appStore.currentSubject
    const book = appStore.currentBook
    if (!subject || !book) return

    const count = plans.value.length
    const name = `方案${numToChinese(count + 1)}`
    const now = new Date().toISOString()

    const plan: Plan = {
      name,
      subject,
      book,
      usedQuestions: [],
      paperIds: [],
      createdAt: now,
      updatedAt: now,
    }

    try {
      const id = await db.plans.add(plan)
      plan.id = id
      plans.value.push(plan)
      ElMessage.success('方案已创建')
    } catch (e) {
      console.error('Failed to create plan:', e)
      ElMessage.error('创建方案失败')
    }
  }

  async function deletePlan(id: number) {
    try {
      await db.plans.delete(id)
      plans.value = plans.value.filter((p) => p.id !== id)
      ElMessage.success('方案已删除')
    } catch (e) {
      console.error('Failed to delete plan:', e)
      ElMessage.error('删除方案失败')
    }
  }

  async function renamePlan(id: number, newName: string) {
    const trimmed = newName.trim()
    if (!trimmed) return

    const plan = plans.value.find((p) => p.id === id)
    if (!plan) return

    const now = new Date().toISOString()
    try {
      await db.plans.update(id, { name: trimmed, updatedAt: now })
      plan.name = trimmed
      plan.updatedAt = now
      ElMessage.success('已重命名')
    } catch (e) {
      console.error('Failed to rename plan:', e)
      ElMessage.error('重命名失败')
    }
  }

  function numToChinese(n: number): string {
    const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    if (n <= 10) return digits[n] || String(n)
    return `第${n}`
  }

  return {
    plans,
    loading,
    loadPlans,
    createPlan,
    deletePlan,
    renamePlan,
  }
})
