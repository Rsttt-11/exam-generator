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
  return new Date(iso).toLocaleString('zh-CN')
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
    <h1>方案管理</h1>

    <div class="context-bar">
      <el-tag>{{ getSubjectName(appStore.currentSubject) }}</el-tag>
      <span class="arrow">&gt;</span>
      <el-tag>{{ getBookName(appStore.currentBook) }}</el-tag>
    </div>

    <div class="actions">
      <el-button type="primary" @click="planStore.createPlan()" :loading="planStore.loading">
        + 创建新方案
      </el-button>
    </div>

    <div v-if="planStore.plans.length === 0 && !planStore.loading" class="empty">
      <el-empty description="暂无方案，点击上方按钮创建">
        <el-button type="primary" @click="planStore.createPlan()">立即创建</el-button>
      </el-empty>
    </div>

    <div v-else class="plan-list">
      <div
        v-for="plan in planStore.plans"
        :key="plan.id"
        class="plan-card"
        @click="enterPlan(plan)"
      >
        <div class="plan-info">
          <h3>{{ plan.name }}</h3>
          <p class="plan-meta">
            创建于 {{ formatDate(plan.createdAt) }}
            <span class="divider">|</span>
            已抽题 {{ plan.usedQuestions.length }} 道
            <span class="divider">|</span>
            试卷 {{ plan.paperIds.length }} 套
          </p>
        </div>
        <div class="plan-actions" @click.stop>
          <el-button size="small" @click="handleRename(plan)">重命名</el-button>
          <el-button size="small" @click="router.push('/history/'+plan.id)">历史</el-button>
          <el-button size="small" @click="router.push('/stats/'+plan.id)">统计</el-button>
          <el-popconfirm
            title="删除后无法恢复，确定删除？"
            @confirm="planStore.deletePlan(plan.id!)"
          >
            <template #reference>
              <el-button size="small" type="danger" text>删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <div class="back">
      <el-button @click="router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.plan-page {
  max-width: 680px;
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

.actions {
  text-align: center;
  margin-bottom: 24px;
}

.empty {
  padding: 40px 0;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.plan-card:hover {
  border-color: var(--el-color-primary);
}

.plan-info h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 500;
}

.plan-meta {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.divider {
  margin: 0 8px;
}

.plan-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.back {
  text-align: center;
  margin-top: 32px;
}
</style>
