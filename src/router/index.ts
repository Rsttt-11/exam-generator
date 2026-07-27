import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '考研数学智能组卷' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router