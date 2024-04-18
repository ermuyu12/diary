import { createRouter, createWebHistory } from 'vue-router'
import { getInfo } from '@/utils/storage'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/login/login.vue') },
    { path: '/login', component: () => import('@/views/login/login.vue') },
    { path: '/wxLogin', component: () => import('@/views/wx/login.vue') },
    {
      path: '/layout', component: () => import('@/views/layout/layout.vue'),
      redirect: '/write',
      children: [
        { path: '/write', component: () => import('@/views/layout/write.vue') },
        { path: '/manage', component: () => import('@/views/layout/manage.vue') },
        { path: '/share', component: () => import('@/views/layout/share.vue') },
        { path: '/receive', component: () => import('@/views/layout/receive.vue') },
        { path: '/recycle', component: () => import('@/views/layout/recycle.vue') },
        { path: '/user', component: () => import('@/views/layout/user.vue') },
      ]
    },

  ]
})

// 路由前置导航守卫
// 定义一个数组，专门用户存放所有不需要权限访问的页面
const authUrls = ['/login', '/wxLogin']
router.beforeEach((to, from, next) => {
  // 看to.path是否在authUrls中出现过
  if (authUrls.includes(to.path)) {
    // 非权限页面，直接放行
    next()
    return
  }

  // 是权限页面，需要判断token
  const res = getInfo()
  // console.log(token)
  if (!res.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
