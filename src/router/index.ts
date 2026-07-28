import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Plan from '@/views/Plan.vue'
import Generate from '@/views/Generate.vue'
import History from '@/views/History.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '考研数学智能组卷' },
  },
  {
    path: '/plan',
    name: 'Plan',
    component: Plan,
    meta: { title: '方案管理' },
  },
  {
    path: '/generate/:planId',
    name: 'Generate',
    component: Generate,
    meta: { title: '智能组卷' },
  },
  {
    path: '/history/:planId',
    name: 'History',
    component: History,
    meta: { title: '历史试卷' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router