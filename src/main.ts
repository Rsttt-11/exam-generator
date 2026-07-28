import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'

// 升级时清除旧的 v1 数据库（只删旧版，不删当前）
;(async () => {
  const OLD_DB = 'ExamGeneratorDB'
  try {
    const dbs = await indexedDB.databases()
    const old = dbs.find((d) => d.name === OLD_DB)
    if (old && old.version === 1) {
      indexedDB.deleteDatabase(OLD_DB)
      console.log('[DB] Removed old v1 database, fresh v1 with papers table will be created')
    }
  } catch (_) {}
})()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')