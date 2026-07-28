<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { usePlanStore } from '@/stores/plan'
import { ElMessageBox } from 'element-plus'
import type { Plan } from '@/types'

const router = useRouter()
const appStore = useAppStore()
const planStore = usePlanStore()

if (!appStore.currentSubject || !appStore.currentBook) {
  router.replace('/')
}

onMounted(() => {
  planStore.loadPlans()
})

function getSubjectName(id: string) {
  return appStore.subjects.find((s) => s.id === id)?.name || id
}

function getBookName(id: string) {
  return appStore.books.find((b) => b.id === id)?.name || id
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function handleRename(plan: Plan) {
  ElMessageBox.prompt('请输入新名称', '重命名方案', {
    inputValue: plan.name,
    inputPlaceholder: '请输入方案名称',
    inputValidator: (v: string) => v.trim() ? true : '名称不能为空',
  }).then(({ value }) => {
    planStore.renamePlan(plan.id!, value!)
  }).catch(() => {})
}

function enterPlan(plan: Plan) {
  router.push(`/generate/${plan.id}`)
}
</script>

<template>
  <div class="plan-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">方案管理</h1>
        <p class="page-desc">管理你的刷题方案，跟踪学习进度</p>
      </div>
      <div class="page-header-right">
        <el-button type="primary" @click="planStore.createPlan()" :loading="planStore.loading" round>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="margin-right:4px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          创建新方案
        </el-button>
      </div>
    </div>

    <!-- Context -->
    <div class="context-bar">
      <el-tag round>{{ getSubjectName(appStore.currentSubject) }}</el-tag>
      <span class="arrow">→</span>
      <el-tag round>{{ getBookName(appStore.currentBook) }}</el-tag>
    </div>

    <!-- Empty State -->
    <div v-if="planStore.plans.length === 0 && !planStore.loading" class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-text">还没有方案，创建一个开始刷题吧</p>
      <el-button type="primary" @click="planStore.createPlan()" round>立即创建</el-button>
    </div>

    <!-- Plan List -->
    <div v-else class="plan-grid">
      <div
        v-for="plan in planStore.plans"
        :key="plan.id"
        class="plan-card glass-card"
        @click="enterPlan(plan)"
      >
        <!-- Card Top -->
        <div class="plan-top">
          <div class="plan-icon">
            {{ String(plan.id).padStart(2, '0') }}
          </div>
          <div class="plan-info">
            <h3>{{ plan.name }}</h3>
            <p class="plan-date">{{ formatDate(plan.createdAt) }}</p>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="plan-stats">
          <div class="plan-stat">
            <span class="plan-stat-value">{{ plan.usedQuestions.length }}</span>
            <span class="plan-stat-label">已抽题</span>
          </div>
          <div class="plan-stat-divider" />
          <div class="plan-stat">
            <span class="plan-stat-value">{{ plan.paperIds.length }}</span>
            <span class="plan-stat-label">试卷</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="plan-actions" @click.stop>
          <el-button size="small" text @click="handleRename(plan)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="margin-right:3px"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            重命名
          </el-button>
          <router-link :to="`/history/${plan.id}`" class="action-link" @click.stop>
            <el-button size="small" text>📜 历史</el-button>
          </router-link>
          <router-link :to="`/stats/${plan.id}`" class="action-link" @click.stop>
            <el-button size="small" text>📊 统计</el-button>
          </router-link>
          <el-popconfirm title="删除后无法恢复，确定删除？" @confirm="planStore.deletePlan(plan.id!)">
            <template #reference>
              <el-button size="small" text type="danger">🗑️ 删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="action-row">
      <el-button @click="router.push('/')" round>← 返回首页</el-button>
      <el-button @click="router.push('/settings')" round>⚙️ 设置</el-button>
    </div>
  </div>
</template>

<style scoped>
.plan-page {
  padding-top: 8px;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}
.page-title {
  font-size: 26px;
  font-weight: 700;
}
.page-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-icon {
  font-size: 56px;
  margin-bottom: 16px;
}
.empty-text {
  color: var(--el-text-color-secondary);
  margin-bottom: 20px;
  font-size: 15px;
}

/* Grid */
.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 16px;
}

/* Card */
.plan-card {
  cursor: pointer;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all var(--transition-normal);
}
.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--el-color-primary);
}

.plan-top {
  display: flex;
  align-items: center;
  gap: 14px;
}
.plan-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--el-color-primary-light-9);
  color: var(--color-primary-500);
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.plan-info {
  flex: 1;
  min-width: 0;
}
.plan-info h3 {
  font-size: 17px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.plan-date {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

.plan-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 12px 0;
  border-top: 1px solid var(--el-border-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
}
.plan-stat {
  text-align: center;
}
.plan-stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary-500);
}
.plan-stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.plan-stat-divider {
  width: 1px;
  height: 28px;
  background: var(--el-border-color-light);
}

.plan-actions {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.action-link {
  text-decoration: none;
}
</style>
