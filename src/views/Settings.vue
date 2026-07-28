<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.applyTheme()
})

function handleSave() {
  settingsStore.saveSettings()
  settingsStore.applyTheme()
}

function handleReset() {
  ElMessageBox.confirm('恢复默认设置？所有自定义配置将丢失。', '确认', { type: 'warning' }).then(() => {
    settingsStore.resetSettings()
    settingsStore.applyTheme()
  }).catch(() => {})
}
</script>

<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">⚙️ 设置</h1>
      <p class="page-desc">自定义组卷参数和偏好</p>
    </div>

    <div class="settings-group">
      <!-- Default Counts -->
      <div class="settings-card glass-card">
        <div class="section-title">默认组卷数量</div>
        <div class="setting-rows">
          <div class="setting-row">
            <div class="setting-label">
              <span class="setting-emoji">📝</span>
              <span>选择题</span>
            </div>
            <el-input-number v-model="settingsStore.settings.defaultChoice" :min="1" :max="50" size="small" controls-position="right" />
          </div>
          <div class="setting-divider" />
          <div class="setting-row">
            <div class="setting-label">
              <span class="setting-emoji">✏️</span>
              <span>填空题</span>
            </div>
            <el-input-number v-model="settingsStore.settings.defaultBlank" :min="1" :max="50" size="small" controls-position="right" />
          </div>
          <div class="setting-divider" />
          <div class="setting-row">
            <div class="setting-label">
              <span class="setting-emoji">📖</span>
              <span>解答题</span>
            </div>
            <el-input-number v-model="settingsStore.settings.defaultAnswer" :min="1" :max="50" size="small" controls-position="right" />
          </div>
        </div>
      </div>

      <!-- PDF Settings -->
      <div class="settings-card glass-card">
        <div class="section-title">PDF 导出设置</div>
        <div class="setting-rows">
          <div class="setting-row">
            <div class="setting-label">
              <span class="setting-emoji">📄</span>
              <span>来源格式</span>
            </div>
            <el-radio-group v-model="settingsStore.settings.pdfSourceMode" size="small">
              <el-radio-button value="chapter">按章节</el-radio-button>
              <el-radio-button value="page">按页码</el-radio-button>
            </el-radio-group>
          </div>
          <div class="setting-divider" />
          <div class="setting-row">
            <div class="setting-label">
              <span class="setting-emoji">🔠</span>
              <span>字号</span>
            </div>
            <div class="setting-control">
              <el-input-number v-model="settingsStore.settings.pdfFontSize" :min="8" :max="16" size="small" controls-position="right" />
              <span class="setting-hint">{{ settingsStore.settings.pdfFontSize }}pt</span>
            </div>
          </div>
          <div class="setting-divider" />
          <div class="setting-row">
            <div class="setting-label">
              <span class="setting-emoji">📐</span>
              <span>页边距</span>
            </div>
            <div class="setting-control">
              <el-input-number v-model="settingsStore.settings.pdfMargin" :min="30" :max="80" :step="5" size="small" controls-position="right" />
              <span class="setting-hint">{{ settingsStore.settings.pdfMargin }}px</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme -->
      <div class="settings-card glass-card">
        <div class="section-title">外观主题</div>
        <div class="theme-options">
          <button
            class="theme-option"
            :class="{ active: settingsStore.settings.theme === 'light' }"
            @click="settingsStore.settings.theme = 'light'"
          >
            <div class="theme-preview theme-preview-light">
              <div class="tp-header" />
              <div class="tp-body">
                <div class="tp-line" />
                <div class="tp-line tp-line-sm" />
              </div>
            </div>
            <span>☀️ 浅色</span>
          </button>
          <button
            class="theme-option"
            :class="{ active: settingsStore.settings.theme === 'dark' }"
            @click="settingsStore.settings.theme = 'dark'"
          >
            <div class="theme-preview theme-preview-dark">
              <div class="tp-header" />
              <div class="tp-body">
                <div class="tp-line" />
                <div class="tp-line tp-line-sm" />
              </div>
            </div>
            <span>🌙 深色</span>
          </button>
          <button
            class="theme-option"
            :class="{ active: settingsStore.settings.theme === 'system' }"
            @click="settingsStore.settings.theme = 'system'"
          >
            <div class="theme-preview theme-preview-system">
              <div class="tp-header" />
              <div class="tp-body">
                <div class="tp-line" />
                <div class="tp-line tp-line-sm" />
              </div>
            </div>
            <span>💻 跟随系统</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="action-row-main">
      <el-button type="primary" size="large" @click="handleSave" round>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="margin-right:4px"><polyline points="20 6 9 17 4 12"/></svg>
        保存设置
      </el-button>
      <el-button size="large" @click="handleReset" round>↩️ 恢复默认</el-button>
    </div>

    <div class="action-row">
      <el-button @click="router.push('/plan')" round>← 返回方案管理</el-button>
      <el-button @click="router.push('/')" round>← 返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.settings-page { padding-top: 8px; }

.page-header { margin-bottom: 24px; }
.page-title { font-size: 26px; font-weight: 700; }
.page-desc { font-size: 14px; color: var(--el-text-color-secondary); margin-top: 4px; }

.settings-group { display: flex; flex-direction: column; gap: 16px; }

.settings-card { padding: 20px; }
.setting-rows { display: flex; flex-direction: column; }
.setting-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; gap: 12px;
}
.setting-divider { height: 1px; background: var(--el-border-color-light); }
.setting-label { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; }
.setting-emoji { font-size: 18px; }
.setting-control { display: flex; align-items: center; gap: 8px; }
.setting-hint { font-size: 12px; color: var(--el-text-color-secondary); min-width: 30px; }

/* Theme Options */
.theme-options { display: flex; gap: 12px; flex-wrap: wrap; }
.theme-option {
  flex: 1; min-width: 120px;
  padding: 16px 12px;
  border: 2px solid var(--el-border-color);
  border-radius: var(--radius-md);
  background: var(--el-fill-color-light);
  cursor: pointer;
  text-align: center;
  transition: all var(--transition-fast);
  font-size: 14px;
  color: var(--el-text-color-primary);
}
.theme-option:hover { border-color: var(--el-color-primary-light-5); }
.theme-option.active {
  border-color: var(--color-primary-500);
  background: var(--el-color-primary-light-9);
}

.theme-preview {
  width: 100%; height: 48px;
  border-radius: 6px;
  margin-bottom: 10px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
}
.theme-preview-light { background: #f8fafc; }
.theme-preview-dark { background: #1e293b; }
.theme-preview-system { background: #f8fafc; }
.dark .theme-preview-system { background: #1e293b; }

.tp-header {
  height: 10px;
  background: var(--bg-gradient);
  opacity: 0.8;
}
.tp-body { padding: 6px 8px; }
.tp-line {
  height: 4px; border-radius: 2px; background: rgba(0,0,0,0.1);
  margin-bottom: 4px;
}
.theme-preview-dark .tp-line { background: rgba(255,255,255,0.15); }
.tp-line-sm { width: 60%; }

.action-row-main { text-align: center; margin: 28px 0 20px; display: flex; gap: 12px; justify-content: center; }
</style>
