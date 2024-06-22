/*
 * @Author: your name
 * @Date: 2021-05-08 16:23:56
 * @LastEditTime: 2021-06-07 10:30:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\router\modules\property.js
 */
/*
 * @Author: your name
 * @Date: 2021-05-06 10:53:31
 * @LastEditTime: 2021-05-06 18:39:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\router\modules\exent.jss
 */
import Layout from '@/views/layout/Layout'

const basicConfigRouter = {
  path: '/basic',
  component: Layout,
  hidden: true,
  redirect: '/basic',
  name: 'App',
  meta: {
    title: '基础配置',
    icon: 'property',
    roles: ['default'],
  },
  children: [
    // {
    //   path: 'ams-base',
    //   name: 'TenantSetting',
    //   hidden: false,
    //   component: () => import('@/views/ams/ams-base-config'),
    //   meta: {
    //     title: '基础配置',
    //     icon: 'basesetting',
    //     roles: ['devops'],
    //   },
    // },
    {
      path: 'ams-base-cluster',
      name: 'TenantSetting',
      hidden: false,
      component: () => import('@/views/ams/ams-base-cluster'),
      meta: {
        title: '集群管理',
        icon: 'basesetting',
        roles: ['devops'],
      },
    },
    {
      path: 'ams-base-tenant',
      name: 'TenantSetting',
      hidden: false,
      component: () => import('@/views/ams/ams-base-tenant'),
      meta: {
        title: '租户管理',
        icon: 'zuhuguanli',
        roles: ['devops'],
      },
    },
    //  {
    //     name: 'App',
    //     hidden: true,
    //     path: 'vm',
    //     component: () => import('@/views/property/vm'),
    //     meta: {
    //       title: '虚拟机管理',
    //       icon: 'vm',
    //       roles: ['default'],
    //     },
    //   },
	  {
		  path: 'vm-server-manage',
		  name: 'Middleware',
		  hidden: false,
		  component: () => import('@/views/cicd/vm-server-manage'),
		  meta: {
			  title: '虚拟机管理',
			  icon: 'vm',
			  roles: ['devops']
		  }
	  },
    {
      path: 'warehouse-image',
      name: 'Middleware',
      hidden: false,
      component: () => import('@/views/ams/warehouse-image'),
      meta: {
        title: '制品库管理',
        icon: 'warehouse',
        roles: ['devops']
      }
    }, {
      path: 'quality-control',
      name: 'Middleware',
      hidden: false,
      component: () => import('@/views/quality-design/config/index'),
      meta: {
        title: '平台门禁',
        icon: 'zhi',
        roles: ['devops']
      }
    }
    , {
      path: 'quality-control-app-config',
      name: '应用配置',
      component: () => import('@/views/quality-design/config/app-config'),
      hidden: true,
      meta: {
        title: '平台门禁',
        icon: 'zhi',
        roles: ['devops']
      }
    },
     {
      path: 'quality-control-template-config',
      name: '模板配置',
      component: () => import('@/views/quality-design/desgin-template/index'),
      hidden: true,
      meta: {
        title: '平台门禁',
        icon: 'zhi',
        roles: ['devops']
      }
    },
    {
      path: 'quality-control-pipeline',
      name: '质量流水线',
      component: () => import('@/views/quality-design/pipeline/index'),
      hidden: true,
      meta: {
        title: '平台门禁',
        icon: 'zhi',
        roles: ['devops']
      }
    },
    {
      path: 'middleware',
      name: 'Middleware',
      hidden: false,
      component: () => import('@/views/ams/middleware'),
      meta: {
        title: '中间件',
        icon: 'middleware',
        roles: ['devops']
      }
    }, {
      path: 'addMiddleware',
      name: '添加中间件',
      hidden: true,
      component: () => import('@/views/ams/middleware-add'),
      meta: {
        title: '添加中间件',
        roles: ['devops']
      }
    }, {
      path: 'editMiddleware',
      name: '修改中间件',
      hidden: true,
      component: () => import('@/views/ams/middleware-edit'),
      meta: {
        title: '修改中间件',
        roles: ['devops']
      }
    }
  ],
}

export default basicConfigRouter
