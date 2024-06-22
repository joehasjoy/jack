/*
 * @Author: your name
 * @Date: 2021-04-14 14:05:00
 * @LastEditTime: 2021-08-18 17:05:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\router\modules\flow.js
 */
import Layout from '@/views/layout/Layout'
const flowRouter = {
  path: '/flow',
  component: Layout,
  redirect: '/flow/myself',
  name: 'ops_flow',
  meta: {
    title: '审批流程',
    icon: 'peoples',
    roles: ['default'],
  },
  children: [
    // {
    //   path: 'myself',
    //   name: 'myself_flow',
    //   component: () => import('@/views/flow/index'),
    //   meta: {
    //     title: '应用审批',
    //     icon: 'tab',
    //     roles: ['default']
    //   }
    // },
/*	  {
		  path: 'https://rdfa-bp-taskcenter.ennew.com',
		  name: 'App',
		  hidden: false,
		  meta: { title: '我的审批', icon: 'apply' }
	  },*/
    {
      path: '/taskCenter',
      name: 'App',
      meta: {
        title: '我的审批',
        icon: 'apply',
        roles: ['default'],
      },
    },
	  {
      path: '/workOrderCenter',
      name: 'App',
      meta: {
        title: '工单审批',
	      icon: 'worderOrder',
        roles: ['default'],
      },
    },
    {
      path: 'new',
      name: 'new_flow',
      component: () => import('@/views/flow/new'),
      meta: {
        title: '申请流程',
        roles: ['default'],
      },
      hidden: true,
    },
    {
      path: 'detail',
      name: 'detail_flow',
      component: () => import('@/views/flow/detail'),
      meta: {
        title: '流程详情',
        roles: ['default'],
      },
      hidden: true,
    },
  ],
}

export default flowRouter
