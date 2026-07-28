import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/utils/db'
import type { Paper, ExamConfig } from '@/types'
import { ElMessage } from 'element-plus'

export const usePaperStore = defineStore('paper', () => {
  const papers = ref<Paper[]>([])
  const loading = ref(false)

  async function loadPapers(planId: number) {
    loading.value = true
    try {
      papers.value = await db.papers
        .where({ planId })
        .reverse()
        .sortBy('createdAt')
    } catch (e) {
      console.error('Failed to load papers:', e)
      ElMessage.error('加载历史试卷失败')
    } finally {
      loading.value = false
    }
  }

  async function savePaper(
    planId: number,
    questionIds: string[],
    config: ExamConfig,
  ): Promise<number | undefined> {
    const count = papers.value.length
    const now = new Date().toISOString()
    const paper: Paper = {
      planId,
      name: `第${count + 1}套`,
      questionIds,
      config,
      createdAt: now,
    }

    try {
      const id = await db.papers.add(paper)
      paper.id = id
      papers.value.push(paper)

      // Update plan: add question IDs and paper ID
      const plan = await db.plans.get(planId)
      if (plan) {
        const updatedQuestions = [...new Set([...plan.usedQuestions, ...questionIds])]
        const updatedPapers = id ? [...plan.paperIds, id] : [...plan.paperIds]
        await db.plans.update(planId, {
          usedQuestions: updatedQuestions,
          paperIds: updatedPapers as number[],
          updatedAt: now,
        })
      }

      return id
    } catch (e) {
      console.error('Failed to save paper:', e)
      ElMessage.error('保存试卷失败')
      return undefined
    }
  }

  async function deletePaper(paperId: number) {
    const paper = papers.value.find((p) => p.id === paperId)
    if (!paper) return

    try {
      await db.papers.delete(paperId)
      papers.value = papers.value.filter((p) => p.id !== paperId)

      // Restore questions to the plan (remove from usedQuestions)
      const plan = await db.plans.get(paper.planId)
      if (plan) {
        const removeSet = new Set(paper.questionIds)
        const restoredQuestions = plan.usedQuestions.filter((q) => !removeSet.has(q))
        const restoredPapers = plan.paperIds.filter((pid) => pid !== paperId)
        await db.plans.update(paper.planId, {
          usedQuestions: restoredQuestions,
          paperIds: restoredPapers,
          updatedAt: new Date().toISOString(),
        })
      }

      ElMessage.success('试卷已删除，题目已恢复')
    } catch (e) {
      console.error('Failed to delete paper:', e)
      ElMessage.error('删除试卷失败')
    }
  }

  return {
    papers,
    loading,
    loadPapers,
    savePaper,
    deletePaper,
  }
})