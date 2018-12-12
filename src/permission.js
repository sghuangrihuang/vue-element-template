import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // 授权成功
    if (to.path === '/login') {
      // 授权成功且从登录页进去，则重定向到根路径
      next({ path: '/' })
      // 如果当前页面是dashboard将不会触发afterEach挂钩，因此必须手动处理
      NProgress.done()
    } else {
      // 判断是否权限
      if (store.getters.roles.length === 0) {
        // 无权限
        store.dispatch('GetInfo').then(res => {
          // 拉取用户信息
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 允许跳转
        next()
      }
    }
  } else {
    // 未授权
    if (whiteList.indexOf(to.path) !== -1) {
      // 直接跳转登录页
      next()
    } else {
      // 否则全部重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束Progress
  NProgress.done()
})
