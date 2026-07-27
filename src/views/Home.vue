<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { Book } from '@/types'

const router = useRouter()
const appStore = useAppStore()

const availableBooks = computed<Book[]>(() => {
  if (!appStore.currentSubject) return []
  return appStore.getBooksBySubject(appStore.currentSubject)
})

function goToPlan() {
  if (!appStore.currentSubject || !appStore.currentBook) return
  router.push('/plan')
}
</script>

<template>
  <div class="home">
    <h1>考研数学智能组卷系统</h1>

    <div class="step-card">
      <h2>第一步：选择考试类别</h2>
      <el-radio-group
        v-model="appStore.currentSubject"
        size="large"
      >
        <el-radio-button
          v-for="s in appStore.subjects"
          :key="s.id"
          :value="s.id"
        >
          {{ s.name }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="appStore.currentSubject" class="step-card">
      <h2>第二步：选择题库</h2>
      <el-radio-group
        v-model="appStore.currentBook"
        size="large"
      >
        <el-radio-button
          v-for="b in availableBooks"
          :key="b.id"
          :value="b.id"
        >
          {{ b.name }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="appStore.currentBook" class="step-card">
      <el-button
        type="primary"
        size="large"
        @click="goToPlan"
      >
        进入方案管理
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: 500;
}

.step-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}
</style>
