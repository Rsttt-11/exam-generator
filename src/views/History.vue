<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { usePlanStore } from '@/stores/plan'
import { usePaperStore } from '@/stores/paper'
import { useQuestionBank } from '@/composables/useQuestionBank'
import { downloadPdf, previewPdf } from '@/utils/pdfGenerator'
import type { Paper, Plan, Question } from '@/types'
import { TYPE_LABELS } from '@/types'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const planStore = usePlanStore()
const paperStore = usePaperStore()
const { meta, loadBookMeta, loadAllQuestions, questions } = useQuestionBank()

const planId = Number(route.params.planId)
const plan = ref<Plan | null>(null)
const viewingPaper = ref<Paper | null>(null)
const viewQuestions = ref<Question[]>([])
const dialogVisible = ref(false)

// PDF preview
const previewDialogVisible = ref(false)
const previewLoading = ref(false)
const previewUrl = ref('')
const previewPaperName = ref('')

onMounted(async () => {
  await planStore.loadPlans()
  plan.value = planStore.plans.find((p) => p.id === planId) || null
  if (!plan.value) {
    ElMessage.error('方案不存在')
    router.replace('/plan')
    return
  }

  await paperStore.loadPapers(planId)
  await loadBookMeta(plan.value.subject, plan.value.book)
  if (meta.value) {
    await loadAllQuestions(plan.value.subject, plan.value.book)
  }
})

function handleView(paper: Paper) {
  viewingPaper.value = paper
  const qMap = new Map(questions.value.map((q) => [q.id, q]))
  viewQuestions.value = paper.questionIds.map((id) => qMap.get(id)).filter(Boolean) as Question[]
  dialogVisible.value = true
}

async function handleDelete(paperId: number) {
  await paperStore.deletePaper(paperId)
}

async function handleExportPdf(paper: Paper) {
  if (!plan.value) return
  const qMap = new Map(questions.value.map((q) => [q.id, q]))
  const qs = paper.questionIds.map((id) => qMap.get(id)).filter(Boolean) as Question[]
  try {
    await downloadPdf({
      paper,
      plan: plan.value!,
      questions: qs,
      bookName: getBookName(plan.value!.book),
      subjectName: getSubjectName(plan.value!.subject),
      sourceMode: 'chapter',
    })
  } catch (e) {
    console.error('PDF export failed:', e)
    ElMessage.error('PDF导出失败')
  }
}

async function handlePreview(paper: Paper) {
  if (!plan.value) return
  previewLoading.value = true
  previewPaperName.value = paper.name
  const qMap = new Map(questions.value.map((q) => [q.id, q]))
  const qs = paper.questionIds.map((id) => qMap.get(id)).filter(Boolean) as Question[]
  try {
    const url = await previewPdf({
      paper,
      plan: plan.value!,
      questions: qs,
      bookName: getBookName(plan.value!.book),
      subjectName: getSubjectName(plan.value!.subject),
      sourceMode: 'chapter',
    })
    // Revoke old URL if exists
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = url
    previewDialogVisible.value = true
  } catch (e) {
    console.error('PDF preview failed:', e)
    ElMessage.error('PDF预览生成失败')
  } finally {
    previewLoading.value = false
  }
}

function getSubjectName(id: string) {
  return appStore.subjects.find((s) => s.id === id)?.name || id
}

function getBookName(id: string) {
  return appStore.books.find((b) => b.id === id)?.name || id
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('zh-CN')
}
</script>

<template>
  <div class="history-page">
    <h1>历史试卷</h1>

    <div v-if="plan" class="context-bar">
      <el-tag>{{ plan.name }}</el-tag>
      <span class="arrow">&gt;</span>
      <el-tag>{{ getSubjectName(plan.subject) }}</el-tag>
      <span class="arrow">&gt;</span>
      <el-tag>{{ getBookName(plan.book) }}</el-tag>
    </div>

    <div v-if="paperStore.papers.length === 0" class="empty">
      <el-empty description="暂无历史试卷" />
    </div>

    <div v-else class="paper-list">
      <div
        v-for="paper in paperStore.papers"
        :key="paper.id"
        class="paper-card"
      >
        <div class="paper-info">
          <h3>{{ paper.name }}</h3>
          <p class="paper-meta">
            生成于 {{ formatDate(paper.createdAt) }}
            <span class="divider">|</span>
            选择题 {{ paper.config.choice }} 道
            <span class="divider">|</span>
            填空题 {{ paper.config.blank }} 道
            <span class="divider">|</span>
            解答题 {{ paper.config.answer }} 道
            <span class="divider">|</span>
            共 {{ paper.questionIds.length }} 题
          </p>
        </div>
        <div class="paper-actions">
          <el-button size="small" @click="handleView(paper)">查看</el-button>
          <el-button size="small" :loading="previewLoading" @click="handlePreview(paper)">预览PDF</el-button>
          <el-button size="small" @click="handleExportPdf(paper)">导出PDF</el-button>
          <el-popconfirm
            title="删除后题目将恢复可抽取状态，确定删除？"
            @confirm="handleDelete(paper.id!)"
          >
            <template #reference>
              <el-button size="small" type="danger" text>删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <div class="back">
      <el-button @click="router.push('/plan')">返回方案管理</el-button>
      <el-button type="primary" @click="router.push('/generate/'+planId)">去组卷</el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="试卷内容" width="800px" top="5vh">
      <template v-if="viewingPaper">
        <template v-for="type in ['choice', 'blank', 'answer']" :key="type">
          <div
            v-if="viewQuestions.filter((q) => q.type === type).length"
            class="dialog-type-section"
          >
            <h3>{{ TYPE_LABELS[type] }}</h3>
            <div
              v-for="(q, idx) in viewQuestions.filter((q) => q.type === type)"
              :key="q.id"
              class="dialog-question"
            >
              <p class="dq-label">
                第{{ idx + 1 }}题
                <span class="dq-source">
                  {{ q.sectionName }} → 第{{ q.chapter }}章 → 第{{ q.questionNumber }}题
                </span>
              </p>
              <div class="dq-content" v-html="q.content.replace(/\\n/g, '<br>')"></div>
            </div>
          </div>
        </template>
      </template>
    </el-dialog>

    <!-- PDF Preview Dialog -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="`PDF预览 - ${previewPaperName}`"
      width="90%"
      top="3vh"
      fullscreen
    >
      <iframe
        v-if="previewUrl"
        :src="previewUrl"
        style="width: 100%; height: calc(100vh - 120px); border: none;"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.history-page {
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

.empty {
  padding: 40px 0;
}

.paper-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.paper-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.paper-info h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 500;
}

.paper-meta {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.divider {
  margin: 0 8px;
}

.paper-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.back {
  text-align: center;
  margin-top: 32px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.dialog-type-section {
  margin-bottom: 20px;
}

.dialog-type-section h3 {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--el-color-primary);
}

.dialog-question {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
}

.dq-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-color-primary);
  margin-bottom: 6px;
}

.dq-source {
  font-weight: 400;
  color: var(--el-text-color-secondary);
  margin-left: 12px;
}

.dq-content {
  font-size: 14px;
  line-height: 1.7;
}
</style>