import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login',     component: () => import('@/views/LoginView.vue'),     meta: { requiresGuest: true } },
    { path: '/home',      component: () => import('@/views/HomeView.vue'),      meta: { requiresAuth: true } },
    { path: '/chart',     component: () => import('@/views/ChartView.vue'),     meta: { requiresAuth: true } },
    { path: '/resources', component: () => import('@/views/ResourcesView.vue'), meta: { requiresAuth: true } },
    { path: '/profile',   component: () => import('@/views/ProfileView.vue'),   meta: { requiresAuth: true } },
    { path: '/', redirect: '/home' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.initAuth()
  if (to.meta.requiresAuth  && !authStore.isLoggedIn) return '/login'
  if (to.meta.requiresGuest &&  authStore.isLoggedIn) return '/home'
})

export default router
