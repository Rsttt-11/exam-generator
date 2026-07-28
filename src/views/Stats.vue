<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { usePlanStore } from '@/stores/plan'
import { useQuestionBank } from '@/composables/useQuestionBank'
import type { Plan } from '@/types'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const planStore = usePlanStore()
const { meta, questions, loadBookMeta, loadAllQuestions, loading: qbLoading } = useQuestionBank()

const planId = Number(route.params.planId)
const plan = ref<Plan | null>(null)

onMounted(async () => {
  await planStore.loadPlans()
  plan.value = planStore.plans.find((p) => p.id === planId) || null
  if (!plan.value) {
    ElMessage.error('方案不存在')
    router.replace('/plan')
    return
  }
  await loadBookMeta(plan.value.subject, plan.value.book)
  if (meta.value) {
    await loadAllQuestions(plan.value.subject, plan.value.book)
  }
})

function getSubjectName(id: string) {
  return appStore.subjects.find((s) => s.id === id)?.name || id
}

function getBookName(id: string) {
  return appStore.books.find((b) => b.id === id)?.name || id
}

const totalQuestions = computed(() => questions.value.length)
const usedCount = computed(() => plan.value?.usedQuestions.length || 0)
const totalRate = computed(() => totalQuestions.value > 0 ? Math.round((usedCount.value / totalQuestions.value) * 100) : 0)

function sectionUsedCount(sectionId: string): number {
  const usedSet = new Set(plan.value?.usedQuestions || [])
  return questions.value.filter((q) => q.sectionId === sectionId && usedSet.has(q.id)).length
}
function sectionTotal(sectionId: string): number {
  return questions.value.filter((q) => q.sectionId === sectionId).length
}
function sectionRemaining(sectionId: string): number {
  return sectionTotal(sectionId) - sectionUsedCount(sectionId)
}

/** Category stats */
function categoryUsedCount(catId: string): number {
  const cat = meta.value?.categories?.find(c => c.id === catId)
  if (!cat) return 0
  const usedSet = new Set(plan.value?.usedQuestions || [])
  return questions.value.filter((q) => cat.chapters.includes(q.chapter) && usedSet.has(q.id)).length
}
function categoryTotal(catId: string): number {
  const cat = meta.value?.categories?.find(c => c.id === catId)
  if (!cat) return 0
  return questions.value.filter((q) => cat.chapters.includes(q.chapter)).length
}
function categoryRemaining(catId: string): number {
  return categoryTotal(catId) - categoryUsedCount(catId)
}

function chapterUsedCount(chapterId: number): number {
  const usedSet = new Set(plan.value?.usedQuestions || [])
  return questions.value.filter((q) => q.chapter === chapterId && usedSet.has(q.id)).length
}
function chapterTotal(chapterId: number): number {
  return questions.value.filter((q) => q.chapter === chapterId).length
}
function chapterRemaining(chapterId: number): number {
  return chapterTotal(chapterId) - chapterUsedCount(chapterId)
}
function typeUsedCount(type: string): number {
  const usedSet = new Set(plan.value?.usedQuestions || [])
  return questions.value.filter((q) => q.type === type && usedSet.has(q.id)).length
}
function typeTotal(type: string): number {
  return questions.value.filter((q) => q.type === type).length
}
function typeRemaining(type: string): number {
  return typeTotal(type) - typeUsedCount(type)
}
</script>

<template>
  <div class="stats-page">
    <h1>数据统计</h1>
    <div v-if="plan" class="context-bar">
      <el-tag>{{ plan.name }}</el-tag>
      <span class="arrow">&gt;</span>
      <el-tag>{{ getSubjectName(plan.subject) }}</el-tag>
      <span class="arrow">&gt;</span>
      <el-tag>{{ getBookName(plan.book) }}</el-tag>
    </div>
    <div v-if="qbLoading" class="loading">正在加载题库...</div>
    <template v-else-if="meta">
      <div class="stat-card overall">
        <h2>总体完成度</h2>
        <div class="stat-row">
          <span class="stat-num">{{ totalRate }}%</span>
          <el-progress :percentage="totalRate" :stroke-width="20" />
        </div>
        <p class="stat-detail">已抽 {{ usedCount }} 题 / 共 {{ totalQuestions }} 题</p>
      </div>
      <div class="stat-card">
        <h2>分类完成度</h2>
        <div v-if="meta.categories && meta.categories.length">
          <div v-for="cat in meta.categories" :key="cat.id" class="stat-item">
            <div class="stat-label-row">
              <span><strong>{{ cat.name }}</strong></span>
              <span class="stat-count">{{ categoryUsedCount(cat.id) }} / {{ categoryTotal(cat.id) }} <span class="remaining">剩 {{ categoryRemaining(cat.id) }}</span></span>
            </div>
            <el-progress :percentage="categoryTotal(cat.id)>0 ? Math.round(categoryUsedCount(cat.id)/categoryTotal(cat.id)*100) : 0" :stroke-width="14" />
          </div>
        </div>
        <div v-else>
          <div v-for="s in meta.sections" :key="s.id" class="stat-item">
            <div class="stat-label-row">
              <span>{{ s.name }}</span>
              <span class="stat-count">{{ sectionUsedCount(s.id) }} / {{ sectionTotal(s.id) }} <span class="remaining">剩 {{ sectionRemaining(s.id) }}</span></span>
            </div>
            <el-progress :percentage="sectionTotal(s.id)>0 ? Math.round(sectionUsedCount(s.id)/sectionTotal(s.id)*100) : 0" :stroke-width="14" />
          </div>
        </div>
      </div>
      <div class="stat-card">
        <h2>章节完成度</h2>
        <div v-for="ch in meta.chapters" :key="ch.id" class="stat-item">
          <div class="stat-label-row">
            <span>第{{ ch.id }}章 {{ ch.name }}</span>
            <span class="stat-count">{{ chapterUsedCount(ch.id) }} / {{ chapterTotal(ch.id) }} <span class="remaining">剩 {{ chapterRemaining(ch.id) }}</span></span>
          </div>
          <el-progress :percentage="chapterTotal(ch.id)>0 ? Math.round(chapterUsedCount(ch.id)/chapterTotal(ch.id)*100) : 0" :stroke-width="14" />
        </div>
      </div>
      <div class="stat-card">
        <h2>题型完成度</h2>
        <div v-for="type in (['choice','blank','answer'] as const)" :key="type" class="stat-item">
          <div class="stat-label-row">
            <span>{{ {choice:'选择题',blank:'填空题',answer:'解答题'}[type] }}</span>
            <span class="stat-count">{{ typeUsedCount(type) }} / {{ typeTotal(type) }} <span class="remaining">剩 {{ typeRemaining(type) }}</span></span>
          </div>
          <el-progress :percentage="typeTotal(type)>0 ? Math.round(typeUsedCount(type)/typeTotal(type)*100) : 0" :stroke-width="14" />
        </div>
      </div>
    </template>
    <div class="back">
      <el-button @click="router.push('/plan')">返回方案管理</el-button>
      <el-button type="primary" @click="router.push('/generate/'+planId)">去组卷</el-button>
    </div>
  </div>
</template>

<style scoped>
.stats-page { max-width: 680px; margin: 0 auto; padding: 40px 20px; }
h1 { text-align: center; margin-bottom: 24px; font-size: 24px; font-weight: 500; }
.context-bar { text-align: center; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.arrow { color: var(--el-text-color-secondary); }
.loading { text-align: center; padding: 60px; color: var(--el-text-color-secondary); }
.stat-card { background: var(--el-bg-color); border: 1px solid var(--el-border-color-light); border-radius: 8px; padding: 20px; margin-bottom: 16px; }
.stat-card h2 { font-size: 16px; font-weight: 500; margin-bottom: 16px; color: var(--el-text-color-primary); }
.stat-card.overall .stat-num { font-size: 36px; font-weight: 600; color: var(--el-color-primary); margin-right: 16px; }
.stat-card.overall .stat-row { display: flex; align-items: center; gap: 16px; }
.stat-card.overall .el-progress { flex: 1; }
.stat-detail { margin-top: 12px; font-size: 13px; color: var(--el-text-color-secondary); text-align: center; }
.stat-item { margin-bottom: 14px; }
.stat-item:last-child { margin-bottom: 0; }
.stat-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 14px; }
.stat-count { font-size: 13px; color: var(--el-text-color-regular); }
.remaining { margin-left: 8px; font-size: 12px; color: var(--el-text-color-secondary); }
.back { text-align: center; margin-top: 32px; display: flex; gap: 12px; justify-content: center; }
</style>", "file_path": "D:Codex-ProjectsClaude 1智能组卷系统exam-generatorsrcviewsStats.vue"}