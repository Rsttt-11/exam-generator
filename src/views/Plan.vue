<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const router = useRouter()

if (!appStore.currentSubject || !appStore.currentBook) {
  router.replace('/')
}
</script>

<template>
  <div class="plan-page">
    <h1>方案管理</h1>
    <p>当前类别：{{ appStore.currentSubject }}</p>
    <p>当前题库：{{ appStore.currentBook }}</p>
    <p style="color: var(--el-color-info)">方案功能将在 Task 04 实现</p>
    <el-button @click="router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.plan-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}
</style>