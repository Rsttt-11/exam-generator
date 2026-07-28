<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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

const allChaptersSelected = ref(true)

onMounted(async () => {
  // Load plan directly from DB (not from potentially-filtered store)
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
    await loadAllQuestions(plan.value.subject, plan.value.book)
  }
})

function toggleAllChapters() {
  if (!meta.value) return
  if (allChaptersSelected.value) {
    config.value.chapters = []
    allChaptersSelected.value = false
  } else {
    config.value.chapters = meta.value.chapters.map((c) => c.id)
    allChaptersSelected.value = true
  }
}

watch(
  () => config.value.chapters,
  (val) => {
    if (!meta.value) return
    allChaptersSelected.value = val.length === meta.value.chapters.length
  },
)

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

function handleGenerate() {
  if (!plan.value) return
  generating.value = true
  saved.value = false

  setTimeout(() => {
    const result = generateExam(
      questions.value,
      plan.value!.usedQuestions,
      config.value,
    )
    generatedPaper.value = result.paper
    warnings.value = result.warnings

    if (result.paper.length > 0) {
      const qIds = result.paper.map((q) => q.id)
      // Deep clone config to strip Vue reactive proxies (IndexedDB can't store them)
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
    <h1>智能组卷</h1>

    <div v-if="plan" class="context-bar">
      <el-tag>{{ plan.name }}</el-tag>
      <span class="arrow">&gt;</span>
      <el-tag>{{ getSubjectName(plan.subject) }}</el-tag>
      <span class="arrow">&gt;</span>
      <el-tag>{{ getBookName(plan.book) }}</el-tag>
    </div>

    <div v-if="qbLoading" class="loading">
      正在加载题库...
    </div>

    <template v-else-if="meta">
      <div class="config-card">
        <h2>题型分类</h2>
        <el-checkbox-group v-model="config.sections">
          <el-checkbox v-for="s in meta.sections" :key="s.id" :value="s.id" :label="s.id">
            {{ s.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="config-card">
        <h2>章节</h2>
        <el-checkbox
          :model-value="allChaptersSelected"
          @change="toggleAllChapters"
          style="margin-bottom: 8px"
        >
          全选
        </el-checkbox>
        <template v-if="meta.categories && meta.categories.length">
          <div v-for="cat in meta.categories" :key="cat.id" class="category-group">
            <h3 class="category-title">{{ cat.name }}</h3>
            <el-checkbox-group v-model="config.chapters">
              <el-checkbox
                v-for="ch in cat.chapters.map(id => meta!.chapters.find(c => c.id === id)).filter(Boolean)"
                :key="ch!.id"
                :label="ch!.id"
              >
                第{{ ch!.id }}章 {{ ch!.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
        <template v-else>
          <el-checkbox-group v-model="config.chapters">
            <el-checkbox
              v-for="ch in meta.chapters"
              :key="ch.id"
              :label="ch.id"
            >
              第{{ ch.id }}章 {{ ch.name }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </div>

      <div class="config-card">
        <h2>题型数量</h2>
        <div class="type-counts">
          <div class="type-row">
            <span class="type-label">选择题</span>
            <el-input-number v-model="config.choice" :min="0" :max="50" size="small" />
            <span class="remaining">剩余 {{ getRemainingCount('choice') }} 道</span>
          </div>
          <div class="type-row">
            <span class="type-label">填空题</span>
            <el-input-number v-model="config.blank" :min="0" :max="50" size="small" />
            <span class="remaining">剩余 {{ getRemainingCount('blank') }} 道</span>
          </div>
          <div class="type-row">
            <span class="type-label">解答题</span>
            <el-input-number v-model="config.answer" :min="0" :max="50" size="small" />
            <span class="remaining">剩余 {{ getRemainingCount('answer') }} 道</span>
          </div>
        </div>
      </div>

      <div v-if="generatedPaper.length === 0" class="actions">
        <el-button
          type="primary"
          size="large"
          @click="handleGenerate"
          :loading="generating"
        >
          生成试卷
        </el-button>
      </div>

      <div v-if="generatedPaper.length > 0" class="paper-result">
        <div class="paper-header">
          <h2>试卷内容</h2>
          <div class="paper-actions">
            <el-button @click="handleGenerateAgain">重新生成</el-button>
            <el-button type="primary" @click="router.push('/history/'+planId)">
              查看历史试卷
            </el-button>
          </div>
        </div>

        <el-alert
          v-for="(w, i) in warnings"
          :key="'w' + i"
          :title="w"
          type="warning"
          show-icon
          :closable="false"
          style="margin-bottom: 8px"
        />

        <div v-if="saved" class="saved-tip">
          <el-tag type="success">已自动保存为第{{ plan?.paperIds.length }}套试卷</el-tag>
        </div>

        <template v-for="type in ['choice', 'blank', 'answer']" :key="type">
          <div
            v-if="generatedPaper.filter((q) => q.type === type).length"
            class="type-section"
          >
            <h3>{{ TYPE_LABELS[type] }}</h3>
            <div
              v-for="(q, idx) in generatedPaper.filter((q) => q.type === type)"
              :key="q.id"
              class="question-block"
            >
              <p class="q-label">
                第{{ idx + 1 }}题
                <span class="q-source">
                  {{ q.sectionName }} → 第{{ q.chapter }}章 → 第{{ q.questionNumber }}题
                </span>
              </p>
              <div class="q-content" v-html="q.content.replace(/\\n/g, '<br>')"></div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <div class="back">
      <el-button @click="router.push('/plan')">返回方案管理</el-button>
      <el-button @click="router.push('/history/'+planId)">历史试卷</el-button>
    </div>
  </div>
</template>

<style scoped>
.generate-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 500;
}

.context-bar {
  text-align: center;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.arrow {
  color: var(--el-text-color-secondary);
}

.loading {
  text-align: center;
  padding: 60px;
  color: var(--el-text-color-secondary);
}

.config-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.config-card h2 {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.category-group {
  margin-bottom: 12px;
  padding: 10px 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
}

.category-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.type-counts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-label {
  width: 60px;
  font-weight: 500;
}

.remaining {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-left: 8px;
}

.actions {
  text-align: center;
  margin: 24px 0;
}

.paper-result {
  margin-top: 24px;
}

.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.paper-header h2 {
  font-size: 18px;
  font-weight: 500;
}

.paper-actions {
  display: flex;
  gap: 8px;
}

.saved-tip {
  margin-bottom: 16px;
}

.type-section {
  margin-bottom: 20px;
}

.type-section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--el-color-primary);
}

.question-block {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
}

.q-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.q-source {
  font-weight: 400;
  color: var(--el-text-color-secondary);
  margin-left: 12px;
}

.q-content {
  font-size: 15px;
  line-height: 1.8;
}

.back {
  text-align: center;
  margin-top: 32px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
