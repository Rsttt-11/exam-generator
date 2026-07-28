<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { usePlanStore } from '@/stores/plan'
import { usePaperStore } from '@/stores/paper'
import { useSettingsStore } from '@/stores/settings'
import { useQuestionBank } from '@/composables/useQuestionBank'
import { generateExam } from '@/utils/examGenerator'
import type { ExamConfig, Question, Plan, Category } from '@/types'
import { TYPE_LABELS } from '@/types'
import { db } from '@/utils/db'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const planStore = usePlanStore()
const paperStore = usePaperStore()
const settingsStore = useSettingsStore()
const { meta, questions, loadBookMeta, loadAllQuestions, loading: qbLoading } = useQuestionBank()

const planId = Number(route.params.planId)
const plan = ref<Plan | null>(null)
const generatedPaper = ref<Question[]>([])
const warnings = ref<string[]>([])
const generating = ref(false)
const saved = ref(false)

const config = ref<ExamConfig>({
  sections: [],
  chapters: [],
  choice: settingsStore.settings.defaultChoice,
  blank: settingsStore.settings.defaultBlank,
  answer: settingsStore.settings.defaultAnswer,
})

const selectedCategories = ref<string[]>([])

function categoryChapters(catId: string): number[] {
  if (!meta.value?.categories) return []
  const cat = meta.value.categories.find(c => c.id === catId)
  return cat?.chapters || []
}

function toggleCategory(catId: string, checked: boolean) {
  const chs = categoryChapters(catId)
  if (checked) {
    const current = new Set(config.value.chapters)
    chs.forEach(id => current.add(id))
    config.value.chapters = [...current]
  } else {
    const remove = new Set(chs)
    config.value.chapters = config.value.chapters.filter(id => !remove.has(id))
  }
}

const allCategoriesSelected = computed(() => {
  if (!meta.value?.categories) return false
  return meta.value.categories.every(cat =>
    cat.chapters.every(chId => config.value.chapters.includes(chId))
  )
})

const someCategoriesSelected = computed(() => config.value.chapters.length > 0 && !allCategoriesSelected.value)

function toggleAllCategories() {
  if (allCategoriesSelected.value) {
    config.value.chapters = []
  } else {
    config.value.chapters = meta.value!.chapters.map(c => c.id)
  }
}

onMounted(async () => {
  const p = await db.plans.get(planId)
  if (!p) {
    ElMessage.error('方案不存在')
    router.replace('/plan')
    return
  }
  plan.value = p
  await planStore.loadPlans()
  await loadBookMeta(plan.value.subject, plan.value.book)
  if (meta.value) {
    config.value.sections = meta.value.sections.map((s) => s.id)
    config.value.chapters = meta.value.chapters.map((c) => c.id)
    if (meta.value.categories) {
      selectedCategories.value = meta.value.categories.map(c => c.id)
    }
    await loadAllQuestions(plan.value.subject, plan.value.book)
  }
})

function getRemainingCount(type: string): number {
  const usedSet = new Set(plan.value?.usedQuestions || [])
  const sectionSet = new Set(config.value.sections)
  const chapterSet = new Set(config.value.chapters)
  return questions.value.filter(
    (q) =>
      q.type === type &&
      sectionSet.has(q.sectionId) &&
      chapterSet.has(q.chapter) &&
      !usedSet.has(q.id),
  ).length
}

const totalRemaining = computed(() =>
  getRemainingCount('choice') + getRemainingCount('blank') + getRemainingCount('answer')
)

const hasEnoughQuestions = computed(() => {
  const c = config.value
  return getRemainingCount('choice') >= c.choice
    && getRemainingCount('blank') >= c.blank
    && getRemainingCount('answer') >= c.answer
})

function handleGenerate() {
  if (!plan.value) return
  generating.value = true
  saved.value = false
  warnings.value = []

  setTimeout(() => {
    const result = generateExam(questions.value, plan.value!.usedQuestions, config.value)
    generatedPaper.value = result.paper
    warnings.value = result.warnings

    if (result.paper.length > 0) {
      const qIds = result.paper.map((q) => q.id)
      const cleanConfig = JSON.parse(JSON.stringify(config.value))
      paperStore.savePaper(plan.value!.id!, qIds, cleanConfig).then(async () => {
        const fresh = await db.plans.get(planId)
        if (fresh) plan.value = fresh
        saved.value = true
        if (result.warnings.length === 0) {
          ElMessage.success('试卷生成成功，已自动保存')
        }
        generating.value = false
      }).catch(() => {
        ElMessage.error('保存试卷失败')
        generating.value = false
      })
    } else {
      generating.value = false
    }
  }, 100)
}

function handleGenerateAgain() {
  generatedPaper.value = []
  warnings.value = []
  saved.value = false
}

function getSubjectName(id: string) {
  return appStore.subjects.find((s) => s.id === id)?.name || id
}
function getBookName(id: string) {
  return appStore.books.find((b) => b.id === id)?.name || id
}
</script>

<template>
  <div class="generate-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">智能组卷</h1>
        <p class="page-desc">配置参数，一键生成模拟试卷</p>
      </div>
      <div v-if="plan" class="page-context">
        <el-tag round size="small">{{ plan.name }}</el-tag>
        <span class="arrow">→</span>
        <el-tag round size="small">{{ getSubjectName(plan.subject) }}</el-tag>
        <span class="arrow">→</span>
        <el-tag round size="small">{{ getBookName(plan.book) }}</el-tag>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="qbLoading" class="loading-state">
      <el-skeleton :rows="4" animated />
      <p style="text-align:center;margin-top:12px;color:var(--el-text-color-secondary)">正在加载题库...</p>
    </div>

    <template v-else-if="meta">
      <!-- ==== Configuration ==== -->
      <div class="config-panel">
        <!-- Category Section -->
        <div class="config-section">
          <div class="section-title">题目范围</div>
          <div class="category-chips">
            <button
              v-for="cat in meta.categories"
              :key="cat.id"
              class="category-chip"
              :class="{
                'chip-active': cat.chapters.every(id => config.chapters.includes(id)),
                'chip-partial': cat.chapters.some(id => config.chapters.includes(id)) && !cat.chapters.every(id => config.chapters.includes(id))
              }"
              @click="toggleCategory(cat.id, !cat.chapters.every(id => config.chapters.includes(id)))"
            >
              <span class="chip-check">
                <svg v-if="cat.chapters.every(id => config.chapters.includes(id))" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <svg v-else-if="cat.chapters.some(id => config.chapters.includes(id))" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </span>
              <span class="chip-label">{{ cat.name }}</span>
              <span class="chip-count">{{ cat.chapters.length }}章</span>
            </button>
          </div>
          <button class="toggle-all-btn" @click="toggleAllCategories">
            <template v-if="allCategoriesSelected">取消全选</template>
            <template v-else>全选全部章节</template>
          </button>
        </div>

        <!-- Section Filter -->
        <div class="config-section">
          <div class="section-title">难度分层</div>
          <div class="section-chips">
            <button
              v-for="s in meta.sections"
              :key="s.id"
              class="section-chip"
              :class="{ 'chip-active': config.sections.includes(s.id) }"
              @click="config.sections = config.sections.includes(s.id)
                ? config.sections.filter(id => id !== s.id)
                : [...config.sections, s.id]"
            >
              {{ s.name }}
            </button>
          </div>
        </div>

        <!-- Type Counts -->
        <div class="config-section">
          <div class="section-title">题型数量 <span class="section-hint">（共 {{ totalRemaining }} 道可抽）</span></div>
          <div class="type-grid">
            <div class="type-card" v-for="t in ([{key:'choice',label:'选择题'},{key:'blank',label:'填空题'},{key:'answer',label:'解答题'}] as const)" :key="t.key">
              <div class="type-label">{{ t.label }}</div>
              <el-input-number
                v-model="config[t.key]"
                :min="0"
                :max="50"
                size="small"
                :disabled="generating"
                controls-position="right"
              />
              <div class="type-remain">
                剩余 <strong>{{ getRemainingCount(t.key) }}</strong> 道
              </div>
            </div>
          </div>
        </div>

        <!-- Generate Button -->
        <div v-if="generatedPaper.length === 0" class="generate-row">
          <el-button
            type="primary"
            size="large"
            :loading="generating"
            :disabled="!hasEnoughQuestions"
            class="generate-btn"
            @click="handleGenerate"
            round
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="margin-right:6px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            {{ generating ? '生成中...' : '生成试卷' }}
          </el-button>
          <p v-if="!hasEnoughQuestions && totalRemaining > 0" class="generate-hint">
            题库题目不足，请减少题型数量或扩大选题范围
          </p>
          <p v-else-if="totalRemaining === 0" class="generate-hint generate-hint-warn">
            所选范围内已无可用题目，请扩大选题范围
          </p>
        </div>
      </div>

      <!-- ==== Paper Result ==== -->
      <transition name="slide-up">
        <div v-if="generatedPaper.length > 0" class="paper-result">
          <div class="paper-header">
            <div>
              <h2 class="paper-heading">📄 试卷内容</h2>
              <p v-if="saved" class="paper-saved">已自动保存为第 {{ plan?.paperIds.length }} 套试卷</p>
            </div>
            <div class="paper-actions">
              <el-button @click="handleGenerateAgain" round>🔄 重新生成</el-button>
              <el-button type="primary" @click="router.push('/history/'+planId)" round>📜 历史试卷</el-button>
            </div>
          </div>

          <el-alert
            v-for="(w, i) in warnings"
            :key="'w' + i"
            :title="w"
            type="warning"
            show-icon
            :closable="false"
            class="warn-alert"
          />

          <div class="paper-body">
            <template v-for="type in ['choice', 'blank', 'answer']" :key="type">
              <div v-if="generatedPaper.filter((q) => q.type === type).length" class="type-section">
                <div class="type-header">
                  <span class="type-badge" :class="'badge-' + type">{{ TYPE_LABELS[type] }}</span>
                  <span class="type-count">{{ generatedPaper.filter((q) => q.type === type).length }} 题</span>
                </div>
                <div
                  v-for="(q, idx) in generatedPaper.filter((q) => q.type === type)"
                  :key="q.id"
                  class="question-block"
                >
                  <div class="q-top">
                    <span class="q-number">{{ idx + 1 }}</span>
                    <span class="q-source">{{ q.sectionName }} → 第{{ q.chapter }}章 → 第{{ q.questionNumber }}题</span>
                  </div>
                  <div class="q-content">{{ q.content }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </template>

    <!-- Footer Actions -->
    <div class="action-row">
      <el-button @click="router.push('/plan')" round>← 返回方案管理</el-button>
      <el-button @click="router.push('/history/'+planId)" round>📜 历史试卷</el-button>
    </div>
  </div>
</template>

<style scoped>
.generate-page { padding-top: 8px; }

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 12px;
  flex-wrap: wrap;
}
.page-title { font-size: 26px; font-weight: 700; }
.page-desc { font-size: 14px; color: var(--el-text-color-secondary); margin-top: 4px; }
.page-context { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.arrow { color: var(--el-text-color-placeholder); font-size: 13px; }

/* Loading */
.loading-state { max-width: 400px; margin: 40px auto; }

/* Config Panel */
.config-panel {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.config-section {}
.section-hint { font-weight: 400; font-size: 13px; color: var(--el-text-color-secondary); }

/* Category Chips */
.category-chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.category-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 2px solid var(--el-border-color);
  border-radius: 12px;
  background: var(--el-fill-color-light);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 14px;
  color: var(--el-text-color-primary);
}
.category-chip:hover { border-color: var(--el-color-primary-light-5); background: var(--el-color-primary-light-9); }
.category-chip.chip-active {
  border-color: var(--color-primary-500);
  background: var(--el-color-primary-light-9);
  color: var(--color-primary-600);
}
.category-chip.chip-partial {
  border-color: var(--color-primary-400);
  background: var(--el-color-primary-light-9);
}
.chip-check {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chip-label { font-weight: 600; }
.chip-count { font-size: 12px; color: var(--el-text-color-secondary); }

.toggle-all-btn {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--el-color-primary);
  cursor: pointer;
  border-radius: 6px;
}
.toggle-all-btn:hover { background: var(--el-color-primary-light-9); }

/* Section Chips */
.section-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.section-chip {
  padding: 8px 18px;
  border: 1.5px solid var(--el-border-color);
  border-radius: 20px;
  background: var(--el-fill-color-light);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 13px;
  color: var(--el-text-color-regular);
}
.section-chip:hover { border-color: var(--el-color-primary-light-5); }
.section-chip.chip-active {
  border-color: var(--color-primary-500);
  background: var(--el-color-primary-light-9);
  color: var(--color-primary-600);
  font-weight: 500;
}

/* Type Grid */
.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 500px) { .type-grid { grid-template-columns: 1fr; } }

.type-card {
  background: var(--el-fill-color-light);
  border-radius: var(--radius-sm);
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.type-label { font-weight: 600; font-size: 14px; color: var(--el-text-color-primary); }
.type-remain { font-size: 12px; color: var(--el-text-color-secondary); }
.type-remain strong { color: var(--color-primary-500); }

/* Generate Button */
.generate-row { text-align: center; }
.generate-btn {
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(79,70,229,0.3);
}
.generate-btn:hover { box-shadow: 0 6px 20px rgba(79,70,229,0.4); transform: translateY(-1px); }
.generate-hint { font-size: 13px; color: var(--el-text-color-secondary); margin-top: 10px; }
.generate-hint-warn { color: var(--el-color-warning); }

/* Paper Result */
.paper-result { margin-top: 28px; }
.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}
.paper-heading { font-size: 20px; font-weight: 700; }
.paper-saved { font-size: 13px; color: var(--el-color-success); margin-top: 4px; }
.paper-actions { display: flex; gap: 8px; }

.warn-alert { margin-bottom: 12px; }

.paper-body { display: flex; flex-direction: column; gap: 24px; }

.type-section {}
.type-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.type-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
.badge-choice { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.badge-blank { background: linear-gradient(135deg, #f59e0b, #f97316); }
.badge-answer { background: linear-gradient(135deg, #10b981, #059669); }
.type-count { font-size: 13px; color: var(--el-text-color-secondary); }

.question-block {
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 10px;
  transition: border-color var(--transition-fast);
}
.question-block:hover { border-color: var(--el-color-primary-light-5); }

.q-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.q-number {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--el-color-primary-light-8);
  color: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.q-source { font-size: 12px; color: var(--el-text-color-secondary); }
.q-content { font-size: 15px; line-height: 1.8; white-space: pre-wrap; }

/* Slide up transition */
.slide-up-enter-active { transition: all 0.4s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(24px); }
</style>
