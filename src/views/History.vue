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
      paper, plan: plan.value!, questions: qs,
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
      paper, plan: plan.value!, questions: qs,
      bookName: getBookName(plan.value!.book),
      subjectName: getSubjectName(plan.value!.subject),
      sourceMode: 'chapter',
    })
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

function getSubjectName(id: string) { return appStore.subjects.find((s) => s.id === id)?.name || id }
function getBookName(id: string) { return appStore.books.find((b) => b.id === id)?.name || id }
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div class="history-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">📜 历史试卷</h1>
        <p v-if="plan" class="page-desc">{{ plan.name }} · {{ getSubjectName(plan.subject) }} · {{ getBookName(plan.book) }}</p>
      </div>
      <div class="page-header-right">
        <el-button type="primary" @click="router.push('/generate/'+planId)" round>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          去组卷
        </el-button>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="paperStore.papers.length === 0" class="empty-state">
      <div class="empty-icon">📄</div>
      <p class="empty-text">暂无历史试卷</p>
      <el-button type="primary" @click="router.push('/generate/'+planId)" round>去生成第一套试卷</el-button>
    </div>

    <!-- Paper List -->
    <div v-else class="paper-list">
      <div v-for="paper in paperStore.papers" :key="paper.id" class="paper-card glass-card">
        <div class="paper-top">
          <div class="paper-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="paper-info">
            <h3>{{ paper.name }}</h3>
            <p class="paper-meta">{{ formatDate(paper.createdAt) }}</p>
          </div>
        </div>

        <div class="paper-stats">
          <div class="paper-stat" v-for="t in ([{key:'choice',label:'选择'},{key:'blank',label:'填空'},{key:'answer',label:'解答'}] as const)" :key="t.key">
            <span class="paper-stat-value">{{ paper.config[t.key] }}</span>
            <span class="paper-stat-label">{{ t.label }}</span>
          </div>
          <div class="paper-stat-divider" />
          <div class="paper-stat">
            <span class="paper-stat-value paper-stat-total">{{ paper.questionIds.length }}</span>
            <span class="paper-stat-label">共</span>
          </div>
        </div>

        <div class="paper-actions">
          <el-button size="small" text @click="handleView(paper)">👁️ 查看</el-button>
          <el-button size="small" text :loading="previewLoading" @click="handlePreview(paper)">📄 预览PDF</el-button>
          <el-button size="small" text @click="handleExportPdf(paper)">⬇️ 导出PDF</el-button>
          <el-popconfirm title="删除后题目将恢复可抽取状态，确定删除？" @confirm="handleDelete(paper.id!)">
            <template #reference>
              <el-button size="small" text type="danger">🗑️ 删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="action-row">
      <el-button @click="router.push('/plan')" round>← 返回方案管理</el-button>
    </div>

    <!-- View Dialog -->
    <el-dialog v-model="dialogVisible" title="试卷内容" width="800px" top="5vh" destroy-on-close>
      <template v-if="viewingPaper">
        <template v-for="type in ['choice', 'blank', 'answer']" :key="type">
          <div v-if="viewQuestions.filter((q) => q.type === type).length" class="dialog-type-section">
            <h3>{{ TYPE_LABELS[type] }}</h3>
            <div v-for="(q, idx) in viewQuestions.filter((q) => q.type === type)" :key="q.id" class="dialog-question">
              <p class="dq-label">
                第{{ idx + 1 }}题
                <span class="dq-source">{{ q.sectionName }} → 第{{ q.chapter }}章 → 第{{ q.questionNumber }}题</span>
              </p>
              <div class="dq-content">{{ q.content }}</div>
            </div>
          </div>
        </template>
      </template>
    </el-dialog>

    <!-- PDF Preview -->
    <el-dialog v-model="previewDialogVisible" :title="`PDF预览 - ${previewPaperName}`" width="90%" top="3vh" fullscreen destroy-on-close>
      <iframe v-if="previewUrl" :src="previewUrl" style="width:100%;height:calc(100vh - 120px);border:none;border-radius:8px" />
    </el-dialog>
  </div>
</template>

<style scoped>
.history-page { padding-top: 8px; }

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

/* Empty */
.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon { font-size: 56px; margin-bottom: 16px; }
.empty-text { color: var(--el-text-color-secondary); margin-bottom: 20px; font-size: 15px; }

/* Paper List */
.paper-list { display: flex; flex-direction: column; gap: 16px; }

.paper-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; transition: all var(--transition-normal); }
.paper-card:hover { box-shadow: var(--shadow-lg); }

.paper-top { display: flex; align-items: center; gap: 14px; }
.paper-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-primary-500);
  background: var(--el-color-primary-light-9);
  flex-shrink: 0;
}
.paper-info { flex: 1; min-width: 0; }
.paper-info h3 { font-size: 17px; font-weight: 600; }
.paper-meta { font-size: 13px; color: var(--el-text-color-secondary); margin-top: 2px; }

.paper-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 12px 0;
  border-top: 1px solid var(--el-border-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
}
.paper-stat { text-align: center; }
.paper-stat-value { display: block; font-size: 18px; font-weight: 700; color: var(--color-primary-500); }
.paper-stat-total { color: var(--color-accent); }
.paper-stat-label { font-size: 12px; color: var(--el-text-color-secondary); margin-top: 1px; }
.paper-stat-divider {
  width: 1px; height: 28px; background: var(--el-border-color-light);
}

.paper-actions { display: flex; gap: 4px; flex-wrap: wrap; }

/* Dialog */
.dialog-type-section { margin-bottom: 20px; }
.dialog-type-section h3 {
  font-size: 15px; font-weight: 600; margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--el-color-primary);
}
.dialog-question {
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 12px; margin-bottom: 10px;
}
.dq-label { font-size: 13px; font-weight: 500; color: var(--el-color-primary); margin-bottom: 6px; }
.dq-source { font-weight: 400; color: var(--el-text-color-secondary); margin-left: 12px; }
.dq-content { font-size: 14px; line-height: 1.7; white-space: pre-wrap; }
</style>
