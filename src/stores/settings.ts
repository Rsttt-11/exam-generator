import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/utils/db'
import type { UserSettings } from '@/types'
import { ElMessage } from 'element-plus'

const defaultSettings: UserSettings = {
  defaultChoice: 8,
  defaultBlank: 6,
  defaultAnswer: 8,
  pdfSourceMode: 'chapter',
  pdfFontSize: 10,
  pdfMargin: 50,
  theme: 'system',
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<UserSettings>({ ...defaultSettings })
  const loaded = ref(false)

  async function loadSettings() {
    try {
      const saved = await db.settings.get('main')
      if (saved) {
        settings.value = { ...defaultSettings, ...saved }
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    } finally {
      loaded.value = true
    }
  }

  async function saveSettings() {
    try {
      await db.settings.put({ ...settings.value, id: 'main' })
      ElMessage.success('设置已保存')
    } catch (e) {
      console.error('Failed to save settings:', e)
      ElMessage.error('保存设置失败')
    }
  }

  async function resetSettings() {
    settings.value = { ...defaultSettings }
    await saveSettings()
  }

  function applyTheme() {
    const t = settings.value.theme
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (t === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }

  loadSettings()

  return {
    settings,
    loaded,
    defaultSettings,
    loadSettings,
    saveSettings,
    resetSettings,
    applyTheme,
  }
})
