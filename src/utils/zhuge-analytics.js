//测试环境
;(function() {
  if (window.zhuge) return
  window.zhuge = []
  window.zhuge.methods = '_init identify track trackRevenue getDid getSid getKey setSuperProperty setUserProperties setWxProperties setPlatform'.split(
    ' '
  )
  window.zhuge.factory = function(b) {
    return function() {
      let a = Array.prototype.slice.call(arguments)
      a.unshift(b)
      window.zhuge.push(a)
      return window.zhuge
    }
  }
  for (let i = 0; i < window.zhuge.methods.length; i++) {
    let key = window.zhuge.methods[i]
    window.zhuge[key] = window.zhuge.factory(key)
  }
  window.zhuge.load = function(b, x) {
    if (!document.getElementById('zhuge-js')) {
      let a = document.createElement('script')
      let verDate = new Date()
      let verStr =
        verDate.getFullYear().toString() +
        verDate.getMonth().toString() +
        verDate.getDate().toString()
      a.type = 'text/javascript'
      a.id = 'zhuge-js'
      a.async = !0
      a.src = 'https://sjsc.ennew.com/zhuge.js?v=' + verStr
      a.onerror = function() {
        window.zhuge.identify = window.zhuge.track = function(
          ename,
          props,
          callback
        ) {
          if (
            callback &&
            Object.prototype.toString.call(callback) === '[object Function]'
          ) {
            callback()
          } else if (
            Object.prototype.toString.call(props) === '[object Function]'
          ) {
            props()
          }
        }
      }
      let c = document.getElementsByTagName('script')[0]
      c.parentNode.insertBefore(a, c)
      window.zhuge._init(b, x)
    }
  }
  window.zhuge.load(window._env_.zhugeAppKey, {
    //配置应用的AppKey
    superProperty: {
      //全局的事件属性
      当前页面名称: document.title,
      来源页面名称: '',
      产品名称: window._env_.zhugeProductName,
    },
    duration: true, // 「页面停留时长」访问采集
    debug: window._env_.zhugeDebug, //测试，开发环境开启，正式环境需关闭
    autoTrack: true, //启用全埋点采集
    singlePage: true, //是否是单页面应用（SPA），启用autoTrack后生效
  })
})()
