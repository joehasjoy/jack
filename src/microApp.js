/*
 * @Author: your name
 * @Date: 2021-04-15 14:01:45
 * @LastEditTime: 2021-08-18 19:41:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\microApp.js
 */
import { registerMicroApps, start } from 'qiankun'

const config = {
  beforeLoad: [
    (app) => {
      console.log(
        '%c before load',
        'background:#0f0 ; padding: 1px; border-radius: 3px;  color: #fff',
        app
      )
    },
  ], // 挂载前回调
  beforeMount: [
    (app) => {
		console.log(window.location.pathname,'--------------')
	    console.log(
        '%c before mount',
        'background:#f1f ; padding: 1px; border-radius: 3px;  color: #fff',
        app
      )
    },
  ], // 挂载后回调
  afterUnmount: [
    (app) => {
      console.log(
        '%c after unload',
        'background:#a7a ; padding: 1px; border-radius: 3px;  color: #fff',
        app
      )
    },
  ], // 卸载后回调
}
const getActiveRule = (hash) => (location) => location.hash.startsWith(hash)
const apps = [
  {
    name: 'rdfa-bp-taskcenter',
    entry: window._env_.taskCenter,
    container: '#app-add',
    activeRule: '/devops/taskCenter',
    props: {
      registerFrom: 'pass-frontend',
	    appName: "multiTenant",
    },
  },
	{
    name: 'authentication-center-new',
		entry: window._env_.taskCenter,
		container: '#app-add',
    activeRule: '/devops/workOrderCenter',
    props: {
	    tabKey: "1",
	    appName: "opsOrder",
    },
  },
	{
		name: 'efficiency-manage-frontend',
		entry: window._env_.efficiencyDevops,
		container: '#app-add',
		activeRule: ['/devops/home-panel/config-sheet','/devops/home-panel/test-sheet'] ,
		props: {
			registerFrom: 'pass-frontend',
		}
	},
  {
    name: 'openapi',
    entry: window._env_.openapi,
    container: '#app-add',
    activeRule: '/devops/openapi',
    props: {
      registerFrom: 'pass-frontend',
    },
  },
  {
    name: 'monitor-platform',
    entry: window._env_.monitor,
    container: '#microApp',
    activeRule: '/devops/cicd/monitor',
    props: {
      registerFrom: 'pass-frontend',
    },
  },
]
const registerApp = () => {
  registerMicroApps(apps, config) // 注册微应用
}
export default registerApp
