import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

function hasPermission(roles, permissionRoles) {
  if (
    roles.indexOf('admin') >= 0 ||
    roles.indexOf('super_admin') >= 0 ||
    roles.indexOf('administrators') >= 0
  )
    return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some((role) => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/reset-ldap-password'] // 不重定向白名单
/*
router.beforeEach((to, from, next) => {
  NProgress.start()
  // console.log('permission getToken:', getToken())
  if (getToken()) {
    if (to.path === '/login' || to.path === '/reset-ldap-password') {
      next({ path: to.path })
      // next()
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // console.log('permission bbb:', store.getters.roles.length)
      if (store.getters.roles.length === 0) {
          store.dispatch('UserLoginInfo').then(res => { // 拉取用户信息
          // const roles = res.data.data.roles
          const roles = store.getters.roles
          // const roles = localStorage.roles
            // console.log('permission:', roles)
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            router.addRoutes(store.getters.addRouters)
            // next({ ...to, replace: true })
            // console.log('router_to_from:', to, from)
            if(to.redirectedFrom){next({ path: to.redirectedFrom })}else if(to.path){next({ path:to.path, query: to.query})}else {next({ path:'/'})}
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            //Message.error(err || 'Verification failed, please login again')
            next({ path: '/', query: {'redirect': to.path} })
          })
        })
      } else {
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          if(
            to.matched.length === 0){next({ path: '/404' })
          }else {
            next()
          }
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
      }
    }
  } else {
    // console.log('whitelist1:', to, from)
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // console.log('whitelist2:', to, from)
      let redirect = ''
      if(to.fullPath){redirect=to.fullPath}
      // next(`/login?redirect=`+redirect) // 否则全部重定向到登录页
      router.push({
        path: '/login',
        query:{
          redirect: redirect  // 防止从外部进来登录
        }
      })
      NProgress.done()
    }
  }
  NProgress.done()
})
*/

/* */
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/login' || to.path === '/reset-ldap-password') {
    // next({ path: to.path })
    next()
    NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  } else {
    // next()
    if (store.getters.roles.length === 0) {
      store
        .dispatch('GetLoginInfo')
        .then((res) => {

          // 拉取用户信息
          const roles = store.getters.roles
          // console.log('permission:', roles)
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            // router.addRoutes(store.getters.addRouters)
            // console.log('router_to_from:', to, from)
            // if (to.redirectedFrom) {
            //   next({ path: to.redirectedFrom })
            // } else if (to.path) {
            //   next({ path: to.path, query: to.query })
            // } else {
            //   next({ path: '/' })
            // }
          })
          next()
        })
        .catch((err) => {
          next()
          // store.dispatch('FedLogOut').then(() => {
          //   // Message.error(err || 'Verification failed, please login again')
          //   // console.log('router_to_from:', to, from)
          //   next({ path: '/login', query: { redirect: to.fullPath } })
          // })
        })
    } else {
      if (hasPermission(store.getters.roles, to.meta.roles)) {
        if (to.matched.length === 0) {
          next({ path: '/404' })
        } else {
          next()
        }
      } else {
        next({ path: '/401', replace: true, query: { noGoBack: true } })
      }
    }
  }
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
