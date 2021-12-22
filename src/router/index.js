import { createRouter, createWebHashHistory } from 'vue-router'
import { onAuthStateChanged, getAuth } from 'firebase/auth'

const routes = [
  {
    path: '/',
    redirect: '/courses',
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/courses',
    component: () => import('@/components/Courses.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz',
    component: () => import('@/components/Quiz.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/fragen',
    component: () => import('@/components/Fragen.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      if (user) {
        next()
      } else {
        next('/login')
      }
    })
    unsubscribe()
  } else {
    next()
  }
})

export default router
