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
  ElMessageBox.confirm('恢复默认设置？', '确认', { type: 'warning' }).then(() => {
    settingsStore.resetSettings()
    settingsStore.applyTheme()
  }).catch(() => {})
}
</script>

<template>
  <div class="settings-page">
    <h1>设置</h1>

    <div class="config-card">
      <h2>默认组卷数量</h2>
      <div class="type-counts">
        <div class="type-row">
          <span class="type-label">选择题</span>
          <el-input-number v-model="settingsStore.settings.defaultChoice" :min="1" :max="50" size="small" />
        </div>
        <div class="type-row">
          <span class="type-label">填空题</span>
          <el-input-number v-model="settingsStore.settings.defaultBlank" :min="1" :max="50" size="small" />
        </div>
        <div class="type-row">
          <span class="type-label">解答题</span>
          <el-input-number v-model="settingsStore.settings.defaultAnswer" :min="1" :max="50" size="small" />
        </div>
      </div>
    </div>

    <div class="config-card">
      <h2>PDF 来源格式</h2>
      <el-radio-group v-model="settingsStore.settings.pdfSourceMode">
        <el-radio value="chapter">按章节方式</el-radio>
        <el-radio value="page">按页码方式</el-radio>
      </el-radio-group>
    </div>

    <div class="config-card">
      <h2>PDF 字号</h2>
      <div class="type-row">
        <el-input-number v-model="settingsStore.settings.pdfFontSize" :min="8" :max="16" size="small" />
        <span class="hint">默认 10</span>
      </div>
    </div>

    <div class="config-card">
      <h2>PDF 页边距</h2>
      <div class="type-row">
        <el-input-number v-model="settingsStore.settings.pdfMargin" :min="30" :max="80" :step="5" size="small" />
        <span class="hint">默认 50px</span>
      </div>
    </div>

    <div class="config-card">
      <h2>主题</h2>
      <el-radio-group v-model="settingsStore.settings.theme">
        <el-radio value="light">浅色主题</el-radio>
        <el-radio value="dark">深色主题</el-radio>
        <el-radio value="system">跟随系统</el-radio>
      </el-radio-group>
    </div>

    <div class="actions">
      <el-button type="primary" @click="handleSave">保存设置</el-button>
      <el-button @click="handleReset">恢复默认</el-button>
    </div>

    <div class="back">
      <el-button @click="router.push('/plan')">返回方案管理</el-button>
      <el-button @click="router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.settings-page { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
h1 { text-align: center; margin-bottom: 24px; font-size: 24px; font-weight: 500; }
.config-card { background: var(--el-bg-color); border: 1px solid var(--el-border-color-light); border-radius: 8px; padding: 20px; margin-bottom: 16px; }
.config-card h2 { font-size: 15px; font-weight: 500; margin-bottom: 12px; color: var(--el-text-color-primary); }
.type-counts { display: flex; flex-direction: column; gap: 12px; }
.type-row { display: flex; align-items: center; gap: 12px; }
.type-label { width: 60px; font-weight: 500; }
.hint { font-size: 13px; color: var(--el-text-color-secondary); }
.actions { text-align: center; margin: 24px 0; display: flex; gap: 12px; justify-content: center; }
.back { text-align: center; margin-top: 24px; display: flex; gap: 12px; justify-content: center; }
</style>