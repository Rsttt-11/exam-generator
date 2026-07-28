<script setup lang="ts">
import { watch, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()

settingsStore.applyTheme()

watch(
  () => route.meta?.title,
  (title) => {
    document.title = title ? `${title} - 考研数学智能组卷` : '考研数学智能组卷系统'
  },
  { immediate: true },
)

const navItems = [
  { path: '/', name: '首页', icon: '🏠' },
  { path: '/plan', name: '方案', icon: '📋' },
  { path: '/settings', name: '设置', icon: '⚙️' },
]

const isDark = computed(() => settingsStore.settings.theme === 'dark')

function toggleTheme() {
  settingsStore.setTheme(isDark.value ? 'light' : 'dark')
}
</script>

<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="app-header">
      <div class="header-bg" />
      <div class="header-inner">
        <div class="brand" @click="router.push('/')">
          <div class="brand-icon">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.2"/>
              <text x="16" y="23" font-size="20" font-weight="700" text-anchor="middle" fill="currentColor" font-family="Arial, sans-serif">M</text>
            </svg>
          </div>
          <span class="brand-text">智能组卷</span>
        </div>

        <nav class="nav-links">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: route.path === item.path || (item.path === '/plan' && route.path.startsWith('/plan')) }"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.name }}</span>
            <span class="nav-indicator" />
          </router-link>

          <div class="nav-divider" />

          <button class="theme-btn" @click="toggleTheme" :title="isDark ? '切换浅色' : '切换深色'">
            <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <div class="page-container">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-inner">
        <span class="footer-text">考研数学智能组卷系统 v1.0</span>
        <span class="footer-divider">·</span>
        <span class="footer-text">题库：李林880（2027版）</span>
        <span class="footer-divider">·</span>
        <span class="footer-text">Built with ❤️</span>
      </div>
    </footer>
  </div>
</template>

<style>
/* ====== Design Tokens ====== */
:root {
  --app-max-width: 820px;
  --app-header-height: 60px;

  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-800: #3730a3;

  --color-accent: #f59e0b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  --bg-gradient-start: #4f46e5;
  --bg-gradient-end: #7c3aed;
  --bg-gradient: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
  --transition-slow: 0.35s ease;
}

/* Dark mode overrides */
.dark {
  --bg-gradient-start: #3730a3;
  --bg-gradient-end: #5b21b6;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.3);
}

/* ====== Base Reset ====== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* ====== Page Transition ====== */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ====== Scrollbar ====== */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--el-border-color); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--el-text-color-secondary); }

::selection {
  background: var(--el-color-primary-light-4);
  color: #fff;
}

/* ====== Shared Card Component ====== */
.glass-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--radius-md);
  padding: 24px;
  transition: box-shadow var(--transition-normal), border-color var(--transition-normal);
}
.glass-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--el-color-primary-light-5);
}

/* ====== Section Title ====== */
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-title::before {
  content: '';
  width: 3px;
  height: 16px;
  background: var(--bg-gradient);
  border-radius: 2px;
}

/* ====== Context Bar ====== */
.context-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.context-bar .arrow {
  color: var(--el-text-color-placeholder);
  font-size: 14px;
}

/* ====== Back / Action row ====== */
.action-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
  flex-wrap: wrap;
}
</style>

<style scoped>
/* ====== Layout ====== */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ====== Header ====== */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--app-header-height);
  background: var(--bg-gradient);
  box-shadow: 0 2px 12px rgba(79, 70, 229, 0.25);
}

.header-inner {
  max-width: var(--app-max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  color: #fff;
}
.brand-icon {
  display: flex;
  align-items: center;
  opacity: 0.9;
}
.brand-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(255,255,255,0.75);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
}
.nav-link:hover {
  color: #fff;
  background: rgba(255,255,255,0.12);
}
.nav-link.active {
  color: #fff;
  background: rgba(255,255,255,0.15);
}
.nav-link.active .nav-indicator {
  opacity: 1;
  transform: scaleX(1);
}

.nav-icon { font-size: 16px; }
.nav-label { font-size: 14px; }
.nav-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
  opacity: 0;
  transition: all var(--transition-fast);
}

.nav-divider {
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.25);
  margin: 0 6px;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: #fff;
  font-size: 16px;
}
.theme-btn:hover {
  background: rgba(255,255,255,0.2);
}
.theme-icon { line-height: 1; }

/* ====== Main ====== */
.app-main {
  flex: 1;
  padding: 32px 20px 40px;
}

.page-container {
  max-width: var(--app-max-width);
  margin: 0 auto;
}

/* ====== Footer ====== */
.app-footer {
  padding: 20px;
  border-top: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color);
}
.footer-inner {
  max-width: var(--app-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 13px;
  color: var(--el-text-color-placeholder);
}
.footer-divider {
  opacity: 0.4;
}
</style>
