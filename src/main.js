import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import { Loading, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // permission control
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import NProgress from 'nprogress' // Progress 进度条
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import { ennLogin, getInfo, getUserInfo, filterAsyncRouterData } from './api/login.js'
import common from './utils/common.js'
import registerApp from './microApp'
import { start } from 'qiankun'
import './assets/icon/icon-enn.css'
import './assets/icon/iconfont/iconfont.css'
import { MonitorJS } from '@enncloud/frontend-monitor-sdk'
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import echarts from 'echarts'
import scroll from 'vue-seamless-scroll'
import RightToolbar from "@/components/RightToolbar"
import vcrontab from "vcrontab";

function render(props) {
  Vue.use(iView)
  Vue.use(VueAxios, axios)
  // Vue.use(ElementUI, { locale })
  Vue.component('RightToolbar', RightToolbar)

  Vue.use(scroll)
  Vue.use(ElementUI)
  Vue.use(Loading)
  Vue.use(vcrontab);
  Vue.prototype.qs = qs
  Vue.prototype.Loading = Loading
  Vue.prototype.NProgress = NProgress
  Vue.prototype.GLOBAL = window._env_
  Vue.prototype.common = common
  Vue.prototype.$echarts = echarts
  Vue.prototype.$EventBus = new Vue();
  Vue.prototype.$driver = new Driver({
    allowClose: false,
    doneBtnText: '完成', // 结束按钮的文字
    stageBackground: '#ffffff', // 突出显示元素的背景颜色
    nextBtnText: '下一步', // 下一步按钮的文字
    prevBtnText: '上一步', // 上一步按钮的文字
    closeBtnText: '关闭', // 关闭按钮的文字
    onHighlightStarted: (Element) => { }, // 元素即将突出显示时调用
    onHighlighted: (Element) => {
      console.log(Element)
    }, // 元素完全突出显示时调用
    onDeselected: (Element) => { }, // 取消选择元素时调用
    onReset: (Element) => { }, // 当要清除叠加时调用
    onNext: (Element) => { }, // 在任何步骤中移动到下一步时调用
    onPrevious: (Element) => { }, // 在任何步骤中移动到上一步时调用
  })
	
	let isAuthLogin = false;
	Vue.config.productionTip = false
    ; (async function () {
      try {
	      // alert(localStorage.getItem('isAuthLogin'))
	      // alert('main try')
	      // 与参与者中心解耦降级登录：如果不是 authLogin  动态加载 enn-auth-sdk.min.js
	      if (localStorage.getItem('isAuthLogin') == 'no') {
		      let script = document.createElement("script");
		      script.src = "https://plantformcdn.fanneng.com/js/ennAuthSdk/1.0.3/enn-auth-sdk.min.js";
					let flag = document.getElementById('flag')
		      flag.appendChild(script) // 让其加载在 env_config.js 之前，不改变原来加载顺序逻辑
		      // document.getElementsByTagName("head")[0].appendChild(script); // 会在登录之后加载在后面，不采用
		      script.async = false
		      //动态添加 enn-auth-sdk.min.js 执行完毕之后
		      script.onload = await function () {
			      let authSdk = EnnAuthSdk({
				      appid: window._env_.appid, //项目APPID
				      baseUrl: window._env_.baseUrl, //项目接口地址
				      env: window._env_.env, //当前运行环境 develop or production
				      accessKey: window._env_.accessKey, // 网关key
				      warningCb: (message) => {
					      Message({
						      type: 'error',
						      message: message,
						      showClose: true,
					      })
				      }, //错误提示回调函数
			      })
			      Vue.prototype.authSdk = authSdk //将实例挂载至vue原型链中，以便其它组件调用登出功能 （this.authSdk.logout()）
			      initVue()
		      }
	      }else {
		      initVue()
	      }
	      
      } catch (e) {
				// 走到这里是因为 index.html 没有加载 enn-auth-sdk.min.js
	      console.log('没有加载到 enn-auth-sdk.min.js ')
      }
    })()

  async function initVue() {
    new MonitorJS().init({
      pageId:
        window._env_.app_env === 'online'
          ? 'pass-frontend-online'
          : 'pass-frontend', //应用唯一标示
      env: window._env_.app_env === 'dev' ? MonitorJS.DEV : MonitorJS.PROD, //上报地址
      consoleError: true,
      vueError: true, //是否上报Vue错误
      vue: Vue,
    })
    new MonitorJS().monitorPerformance({
      pageId:
        window._env_.app_env === 'online'
          ? 'pass-frontend-online'
          : 'pass-frontend', //应用唯一标示
      env: window._env_.app_env === 'dev' ? MonitorJS.DEV : MonitorJS.PROD, //上报地址
    })
    //监控sdk文档 https://confluence.enncloud.cn/pages/viewpage.action?pageId=496370438
	  
	  // 与参与者中心解耦降级登录： 如果是authLogin登录 显示所有菜单
	  if(localStorage.getItem('isAuthLogin') === 'is'){
		if (localStorage.getItem('iComeApproval') != 'is'){
				
		  // 降级登录  设置：http request 拦截器 增加 ennUnifiedAuthorization
			axios.interceptors.request.use(config => {
				// 在所有请求中定义全局默认配置 Token
				// 判断是否存在token，如果存在的话，则每个http header都加上token
				config.headers.ennUnifiedAuthorization = store.getters.authLoginToken;
				return config;
			});
		}
		  registerApp()
		  // 处理与参与者中心解耦 - 降级登录，显示所有菜单
		  let routeShows = ["App", "Cluster", "Team", "Hosts", "Middleware", "TenantSetting"]
		  router.options.base = 'devops2'
		  for (let i = 0; i < router.options.routes.length; i++) {
			  const roterItem = router.options.routes[i]
			  //有多级子菜单
			  if (undefined !== roterItem.children) {
				  //如果所有的子菜单都没有权限才去隐藏
				  let sum = 0
				  for (let j = 0; j < roterItem.children.length; j++) {
					  const child = roterItem.children[j]
					  if (child.title === '网关中心'){
						  switch (localStorage.getItem("originTenantId")) {
							  case '1369923265280311297':  // "新奥新智"
								  child.path = 'https://gwops.ennew.com'
								  break
							  case '1387330602944675842': // "数能科技"
								  child.path = 'http://gwops.fnwintranet.com'
								  break
							  case '1384342759875670018': // "新奥股份"
								  child.path = 'http://share-rdfa-gateway-ops.ennec-prod.enncloud.cn'
								  break
							  default:
								  child.path = ''  // 跳转 404
								  break
						  }
					  }
					  let flag = 0
					  if (routeShows.indexOf(child.name) > -1) {
						  child.hidden = false
						  flag = 0
					  } else {
						  child.hidden = true
						  flag = 1
					  }
					  sum = sum + flag
					  roterItem.hidden = sum === roterItem.children.length;
				  }
			  } else {
				  //只有一级菜单
				  roterItem.hidden = routeShows.indexOf(roterItem.name) <= -1;
			  }
		  }
		  new Vue({
		    el: '#pass_app',
		    router,
		    store,
		    render: (h) => h(App),
		  })
		  start()
	  } else {
			// 通过参与者中心登录
	    await initAuthInfo()
	    registerApp()
	    filterAsyncRouterData()
	      .then((res) => {
	        if (res.status == 200) {
	          if (res.data.code == 500) {
	            alert(res.data.message)
	          } else {
	            let routeShows = res.data.data
	            //新奥用户不显示制品管理   非新奥用户显示制品管理
	            // var originTenantId = localStorage.getItem("originTenantId");
	            // if ("1369923265280311297" != originTenantId) {
	            routeShows.push('Package')
	            // }
	            console.log(routeShows)
	            for (let i = 0; i < router.options.routes.length; i++) {
	              const roterItem = router.options.routes[i]
	              //有多级子菜单
	              if (undefined != roterItem.children) {
	                //如果所有的子菜单都没有权限才去隐藏
	                let sum = 0
	                for (let j = 0; j < roterItem.children.length; j++) {
	                  const child = roterItem.children[j]
		                if (child.title === '网关中心'){
			                switch (localStorage.getItem("originTenantId")) {
				                case '1369923265280311297':  // "新奥新智"
					                child.path = 'https://gwops.ennew.com'
					                break
				                case '1387330602944675842': // "数能科技"
					                child.path = 'http://gwops.fnwintranet.com'
					                break
				                case '1384342759875670018': // "新奥股份"
					                child.path = 'http://share-rdfa-gateway-ops.ennec-prod.enncloud.cn'
					                break
				                default:
					                child.path = ''  // 跳转 404
					                break
			                }
		                }
	                  let flag = 0
	                  if (routeShows.indexOf(child.name) > -1) {
	                    child.hidden = false
	                    flag = 0
	                  } else {
	                    child.hidden = true
	                    flag = 1
	                  }
	                  sum = sum + flag
	                  if (sum == roterItem.children.length) {
	                    roterItem.hidden = true
	                  } else {
	                    roterItem.hidden = false
	                  }
	                }
	              } else {
	                //只有一级菜单
	                if (routeShows.indexOf(roterItem.name) > -1) {
	                  roterItem.hidden = false
	                } else {
	                  roterItem.hidden = true
	                }
	              }
	            }
	            new Vue({
	              el: '#pass_app',
	              router,
	              store,
	              render: (h) => h(App),
	            })
	            start()
	          }
	        }
	      })
	      .catch((res) => {
	        console.log(res)
	        //alert("登录失败");
	      })
	  }
  }
}

async function initAuthPage() {
  return new Promise((resolve) => {
    let authPages = []
    ennLogin()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.code === 500) {
            console.log('lgoin fail', res)
            Message({
              type: 'warning',
              message: res.data.message,
            })
          } else {
            authPages = res.data.data
            resolve(authPages)
          }
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  })
}
async function initAuthInfo() {
  new Promise(() => {
    getInfo()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.code === 500) {
            Message({
              type: 'warning',
              message: res.data.message,
            })
          } else {
            if (res.data.data.nikeName == null) {
              res.data.data.nikeName = '外部租户'
            }
	          console.log(res.data,'0000000000000000')
	          localStorage.removeItem('username')
            localStorage.removeItem('name')
            localStorage.removeItem('userName')
            localStorage.removeItem('roles')
            localStorage.setItem('username', res.data.data.nikeName)
            localStorage.setItem('name', res.data.data.nikeName)
            localStorage.setItem('userName', res.data.data.userName)
            localStorage.setItem('roles', JSON.stringify(res.data.data.roles))
          }
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  })
}

if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
} else {
  render({})
}
export async function bootstrap(props) {
  console.log('taskcenter--bootstrap:', props)
}

export async function mount(props) {
  render(props)
}
export async function unmount(props) {
  console.log(props)
}
