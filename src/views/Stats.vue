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

function getSubjectName(id: string) { return appStore.subjects.find((s) => s.id === id)?.name || id }
function getBookName(id: string) { return appStore.books.find((b) => b.id === id)?.name || id }

const totalQuestions = computed(() => questions.value.length)
const usedCount = computed(() => plan.value?.usedQuestions.length || 0)
const totalRate = computed(() => totalQuestions.value > 0 ? Math.round((usedCount.value / totalQuestions.value) * 100) : 0)

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
function categoryRemaining(catId: string): number { return categoryTotal(catId) - categoryUsedCount(catId) }

function chapterUsedCount(chapterId: number): number {
  const usedSet = new Set(plan.value?.usedQuestions || [])
  return questions.value.filter((q) => q.chapter === chapterId && usedSet.has(q.id)).length
}
function chapterTotal(chapterId: number): number {
  return questions.value.filter((q) => q.chapter === chapterId).length
}
function chapterRemaining(chapterId: number): number { return chapterTotal(chapterId) - chapterUsedCount(chapterId) }

function typeUsedCount(type: string): number {
  const usedSet = new Set(plan.value?.usedQuestions || [])
  return questions.value.filter((q) => q.type === type && usedSet.has(q.id)).length
}
function typeTotal(type: string): number { return questions.value.filter((q) => q.type === type).length }
function typeRemaining(type: string): number { return typeTotal(type) - typeUsedCount(type) }

const typeConfig = [
  { key: 'choice' as const, label: '选择题', emoji: '📝' },
  { key: 'blank' as const, label: '填空题', emoji: '✏️' },
  { key: 'answer' as const, label: '解答题', emoji: '📖' },
]
</script>

<template>
  <div class="stats-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">📊 数据统计</h1>
        <p v-if="plan" class="page-desc">{{ plan.name }} · {{ getSubjectName(plan.subject) }} · {{ getBookName(plan.book) }}</p>
      </div>
    </div>

    <div v-if="qbLoading" class="loading-state">
      <el-skeleton :rows="3" animated />
      <p style="text-align:center;margin-top:12px;color:var(--el-text-color-secondary)">正在加载题库...</p>
    </div>

    <template v-else-if="meta">
      <!-- Overall -->
      <div class="stat-hero">
        <div class="stat-hero-circle">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--el-border-color)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary-500)" stroke-width="8"
              :stroke-dasharray="326.7" :stroke-dashoffset="326.7 - (totalRate / 100) * 326.7"
              stroke-linecap="round" transform="rotate(-90 60 60)"
              style="transition: stroke-dashoffset 0.8s ease"
            />
            <text x="60" y="54" text-anchor="middle" font-size="28" font-weight="700" fill="var(--color-primary-500)">{{ totalRate }}%</text>
            <text x="60" y="78" text-anchor="middle" font-size="12" fill="var(--el-text-color-secondary)">完成度</text>
          </svg>
        </div>
        <div class="stat-hero-info">
          <div class="stat-hero-item">
            <span class="stat-hero-value">{{ usedCount }}</span>
            <span class="stat-hero-label">已抽题目</span>
          </div>
          <div class="stat-hero-divider" />
          <div class="stat-hero-item">
            <span class="stat-hero-value">{{ totalQuestions }}</span>
            <span class="stat-hero-label">总题目</span>
          </div>
          <div class="stat-hero-divider" />
          <div class="stat-hero-item">
            <span class="stat-hero-value">{{ totalQuestions - usedCount }}</span>
            <span class="stat-hero-label">剩余</span>
          </div>
        </div>
      </div>

      <!-- Category Stats -->
      <div class="stat-card glass-card" v-if="meta.categories && meta.categories.length">
        <div class="section-title">分类完成度</div>
        <div v-for="cat in meta.categories" :key="cat.id" class="stat-item">
          <div class="stat-label-row">
            <span class="stat-name">{{ cat.name }}</span>
            <span class="stat-count">{{ categoryUsedCount(cat.id) }} / {{ categoryTotal(cat.id) }}</span>
          </div>
          <el-progress
            :percentage="categoryTotal(cat.id)>0 ? Math.round(categoryUsedCount(cat.id)/categoryTotal(cat.id)*100) : 0"
            :stroke-width="12"
            color="var(--bg-gradient-start)"
          />
          <div class="stat-remain">剩余 {{ categoryRemaining(cat.id) }} 题</div>
        </div>
      </div>

      <!-- Chapter Stats -->
      <div class="stat-card glass-card">
        <div class="section-title">章节完成度</div>
        <div v-for="ch in meta.chapters" :key="ch.id" class="stat-item">
          <div class="stat-label-row">
            <span class="stat-name">第{{ ch.id }}章 {{ ch.name }}</span>
            <span class="stat-count">{{ chapterUsedCount(ch.id) }} / {{ chapterTotal(ch.id) }}</span>
          </div>
          <el-progress
            :percentage="chapterTotal(ch.id)>0 ? Math.round(chapterUsedCount(ch.id)/chapterTotal(ch.id)*100) : 0"
            :stroke-width="10"
            :color="chapterUsedCount(ch.id) === chapterTotal(ch.id) ? 'var(--color-success)' : 'var(--el-color-primary)'"
          />
          <div class="stat-remain">剩余 {{ chapterRemaining(ch.id) }} 题</div>
        </div>
      </div>

      <!-- Type Stats -->
      <div class="stat-card glass-card">
        <div class="section-title">题型完成度</div>
        <div v-for="t in typeConfig" :key="t.key" class="stat-item">
          <div class="stat-label-row">
            <span class="stat-name">{{ t.emoji }} {{ t.label }}</span>
            <span class="stat-count">{{ typeUsedCount(t.key) }} / {{ typeTotal(t.key) }}</span>
          </div>
          <el-progress
            :percentage="typeTotal(t.key)>0 ? Math.round(typeUsedCount(t.key)/typeTotal(t.key)*100) : 0"
            :stroke-width="12"
            :color="{choice:'var(--bg-gradient-start)',blank:'var(--color-accent)',answer:'var(--color-success)'}[t.key]"
          />
          <div class="stat-remain">剩余 {{ typeRemaining(t.key) }} 题</div>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <div class="action-row">
      <el-button @click="router.push('/plan')" round>← 返回方案管理</el-button>
      <el-button type="primary" @click="router.push('/generate/'+planId)" round>🎲 去组卷</el-button>
    </div>
  </div>
</template>

<style scoped>
.stats-page { padding-top: 8px; }

.page-header { margin-bottom: 24px; }
.page-title { font-size: 26px; font-weight: 700; }
.page-desc { font-size: 14px; color: var(--el-text-color-secondary); margin-top: 4px; }

.loading-state { max-width: 400px; margin: 40px auto; }

/* Hero */
.stat-hero {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 36px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.stat-hero-circle { flex-shrink: 0; }
.stat-hero-info { display: flex; align-items: center; gap: 24px; }
.stat-hero-item { text-align: center; }
.stat-hero-value { display: block; font-size: 28px; font-weight: 700; color: var(--color-primary-500); }
.stat-hero-value:last-child { color: var(--el-text-color-primary); }
.stat-hero-label { font-size: 13px; color: var(--el-text-color-secondary); margin-top: 2px; }
.stat-hero-divider {
  width: 1px; height: 36px; background: var(--el-border-color-light);
}

/* Cards */
.stat-card { padding: 20px; margin-bottom: 16px; }
.stat-item { margin-bottom: 18px; }
.stat-item:last-child { margin-bottom: 0; }
.stat-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.stat-name { font-size: 14px; font-weight: 500; color: var(--el-text-color-primary); }
.stat-count { font-size: 13px; color: var(--el-text-color-regular); font-weight: 500; }
.stat-remain { font-size: 12px; color: var(--el-text-color-secondary); margin-top: 3px; text-align: right; }
</style>
