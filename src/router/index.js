import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import Layout_sub from '../views/layout/layout_sub'
import cmdbRouter from './modules/cmdb'
import ticketRouter from './modules/ticket'
import flowRouter from './modules/flow'
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants'
import foundationRouter from './modules/foundation'
import extendRouter from './modules/extend'
import propertyRouter from './modules/property'
import sqlRouter from './modules/sqlmodify'
import mcdRouter from './modules/mcd'

import basicConfigRouter from './modules/basicConfig'
import continuousIntegrationRouter from './modules/continuousIntegration'
import dmsRouter from './modules/dms'
import assetApplicationRouter from './modules/assetApplication'
import measureRouter from './modules/measure'
// import gatewayRouter from './modules/gateway'
// import openplatformRouter from './modules/openplatform'
import effciencyManageRouter from './modules/effciencyManage'
import workorderRouter from './modules/workOrderSystem'
import auditLogRouter from './modules/auditLog'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
	{
    path: '/authLogin',
    component: () => import('@/views/authLogin/index'),
    hidden: true,
  },
  {
    path: '/iComeApproval/:tenantId/:userId/:appName/:procInstId/:taskInstId',
    component: () => import('@/views/cicd/iComeApproval'),
    hidden: true,
  },
  {
    path: '/reset-ldap-password',
    component: () => import('@/views/SystemSetting/reset-ldap-password'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'userinfo',
    hidden: true,
    meta: {
      title: '首页',
    },
    children: [
      {
        path: 'userinfo',
        name: 'user info',
        meta: {
          icon: 'info',
        },
        component: () => import('@/views/dashboard/index'),
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/dashboard'),
      },
    ],
  },
  // { path: '*', redirect: '/404', hidden: true }
]

export const asyncRouterMap = [
   //基础配置
   basicConfigRouter,
   //持续集成
   continuousIntegrationRouter,
   //dms
  sqlRouter,
   //资产申请
    //资源申请菜单根目录
   //assetApplicationRouter,
  // sqlRouter,
  // propertyRouter,
  //审批流程
  flowRouter,
  foundationRouter,
  // gatewayRouter,
  // openplatformRouter,
  //mcdRouter,
    effciencyManageRouter,
    workorderRouter,
		auditLogRouter,
  {
    path: '/static/plop-templates/guide/guide.html',
    name: 'Middleware',
    hidden: true,
  },

  extendRouter,
  //接入文档
  {
    path: '/static/plop-templates/guide/guide.html',
    name: 'Middleware',
    hidden: true,
  },
  {
    path: '*', // 页面不存在的情况下会跳到404页面
    redirect: '/404',
    name: 'notFound',
    hidden: true,
  },
]

export default new Router({
  base: 'devops',
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRouterMap, ...asyncRouterMap],
})
