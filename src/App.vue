<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()

// Apply theme on mount
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
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-inner">
        <span class="app-title" @click="router.push('/')">考研数学智能组卷</span>
        <nav class="nav-links">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: route.path === item.path || (item.path === '/plan' && route.path.startsWith('/plan')) }"
          >
            {{ item.icon }} {{ item.name }}
          </router-link>
          <el-switch
            :model-value="settingsStore.settings.theme === 'dark'"
            @change="settingsStore.setTheme($event ? 'dark' : 'light')"
            size="small"
            style="margin-left: 8px"
            active-icon="Moon"
            inactive-icon="Sunny"
          />
        </nav>
      </div>
    </header>
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="app-footer">
      <span>考研数学智能组卷系统 v1.0 · 题库：李林880（2027版）</span>
    </footer>
  </div>
</template>

<style>
/* ====== Global Reset ====== */
:root {
  --app-max-width: 780px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* ====== Route transition ====== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ====== Scrollbar ====== */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--el-text-color-secondary);
}

::selection {
  background: var(--el-color-primary-light-3);
  color: #fff;
}
</style>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  backdrop-filter: blur(8px);
}

.header-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-title {
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  transition: all 0.15s;
}

.nav-link:hover {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}

.nav-link.active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
}

/* Main */
.app-main {
  flex: 1;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 20px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  border-top: 1px solid var(--el-border-color-light);
  margin-top: 20px;
}
</style>
