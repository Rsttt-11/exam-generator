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
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-icon">
        <svg viewBox="0 0 64 64" width="64" height="64">
          <rect x="8" y="4" width="48" height="56" rx="6" fill="none" stroke="currentColor" stroke-width="3"/>
          <line x1="20" y1="18" x2="44" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="20" y1="27" x2="44" y2="27" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="20" y1="36" x2="38" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="46" cy="46" r="11" fill="var(--color-accent)" stroke="white" stroke-width="2"/>
          <text x="46" y="51" font-size="16" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">P</text>
        </svg>
      </div>
      <h1 class="hero-title">考研数学智能组卷</h1>
      <p class="hero-subtitle">按需选题 · 智能组卷 · 高效备考</p>
    </div>

    <!-- Step Cards -->
    <div class="steps">
      <div class="step-card glass-card" :class="{ active: appStore.currentSubject }">
        <div class="step-number">01</div>
        <div class="step-body">
          <h2>选择考试类别</h2>
          <el-radio-group v-model="appStore.currentSubject" size="large" class="radio-group">
            <el-radio-button v-for="s in appStore.subjects" :key="s.id" :value="s.id">
              {{ s.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div v-if="appStore.currentSubject" class="step-card glass-card" :class="{ active: appStore.currentBook }">
        <div class="step-number">02</div>
        <div class="step-body">
          <h2>选择题库</h2>
          <el-radio-group v-model="appStore.currentBook" size="large" class="radio-group">
            <el-radio-button v-for="b in availableBooks" :key="b.id" :value="b.id">
              {{ b.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <transition name="slide-up">
        <div v-if="appStore.currentBook" class="step-action">
          <el-button type="primary" size="large" class="start-btn" @click="goToPlan" round>
            <span>进入方案管理</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </el-button>
        </div>
      </transition>
    </div>

    <!-- Features -->
    <div class="features">
      <div class="feature-item">
        <div class="feature-icon feature-icon-random">🎲</div>
        <div class="feature-text">
          <strong>智能随机</strong>
          <span>不重复抽题，记录已抽题目</span>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon feature-icon-pdf">📄</div>
        <div class="feature-text">
          <strong>PDF 导出</strong>
          <span>自动排版，公式可读</span>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon feature-icon-stat">📊</div>
        <div class="feature-text">
          <strong>完成追踪</strong>
          <span>各章节练习进度一目了然</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding-top: 8px;
}

/* Hero */
.hero {
  text-align: center;
  padding: 48px 20px 40px;
}
.hero-icon {
  color: var(--color-primary-500);
  margin-bottom: 16px;
  opacity: 0.9;
}
.hero-title {
  font-size: 32px;
  font-weight: 700;
  background: var(--bg-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}
.hero-subtitle {
  margin-top: 10px;
  font-size: 16px;
  color: var(--el-text-color-secondary);
  letter-spacing: 2px;
}

/* Steps */
.steps {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.step-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  cursor: default;
}
.step-card.active {
  border-color: var(--el-color-primary-light-5);
}
.step-number {
  font-size: 28px;
  font-weight: 800;
  color: var(--el-color-primary-light-5);
  line-height: 1;
  min-width: 44px;
  opacity: 0.5;
}
.step-card.active .step-number {
  opacity: 1;
  color: var(--color-primary-500);
}
.step-body {
  flex: 1;
}
.step-body h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 14px;
  color: var(--el-text-color-primary);
}
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.step-action {
  text-align: center;
  margin-top: 8px;
}
.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(79,70,229,0.3);
  transition: all var(--transition-normal);
}
.start-btn:hover {
  box-shadow: 0 6px 20px rgba(79,70,229,0.4);
  transform: translateY(-1px);
}

/* Features */
.features {
  max-width: 520px;
  margin: 40px auto 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 4px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  background: var(--el-fill-color-light);
  transition: background var(--transition-fast);
}
.feature-item:hover {
  background: var(--el-fill-color);
}
.feature-icon {
  font-size: 24px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}
.feature-icon-random { background: #eef2ff; }
.feature-icon-pdf { background: #fef3c7; }
.feature-icon-stat { background: #d1fae5; }
.dark .feature-icon-random { background: rgba(99,102,241,0.15); }
.dark .feature-icon-pdf { background: rgba(245,158,11,0.15); }
.dark .feature-icon-stat { background: rgba(16,185,129,0.15); }

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
}
.feature-text strong {
  color: var(--el-text-color-primary);
}
.feature-text span {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

/* Transition */
.slide-up-enter-active {
  transition: all 0.35s ease;
}
.slide-up-leave-active {
  transition: all 0.2s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
