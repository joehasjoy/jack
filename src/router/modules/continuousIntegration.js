/*
 * @Author: your name
 * @Date: 2021-05-08 16:23:56
 * @LastEditTime: 2021-08-23 15:09:51
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

const continuousIntegrationRouter = {
  path: '/cicd',
  component: Layout,
  redirect: '/cicd/app',
  name: 'App',
  hidden: false,
  meta: {
    title: '持续集成',
    icon: 'example',
    roles: ['cicd', 'devops'],
  },
  children: [
    {
      path: 'team',
      name: 'Team',
      hidden: false,
      component: () => import('@/views/ams/team'),
      meta: {
        title: '业务域管理',
        icon: 'flow',
      },
    },
    {
      path: 'app',
      name: 'App',
      hidden: false,
      component: () => import('@/views/ams/app'),
      meta: {
        title: '应用管理',
        icon: 'app',
        roles: ['cicd', 'devops', 'cicd_admin'],
      },
    },
    // {
    //   path: 'app',
    //   name: 'App',
    //   hidden: false,
    //   path: 'http://mcd.dev.ennewi.cn',
    //   meta: {
    //     title: '移动发布',
    //     icon: 'mobile',
    //     roles: ['cicd', 'devops', 'cicd_admin'],
    //   },
    // },
    // {
    //   name: 'Package',
    //   hidden: true,
    //   path: 'package',
    //   component: () => import('@/views/cicd/packages'),
    //   meta: {
    //     title: '制品库',
    //     icon: 'register',
    //     roles: ['default'],
    //   },
    // },
    {
      path: 'https://rdfa-log-web.ennew.com',
      name: 'App',
      hidden: false,
      meta: { title: '日志中心', icon: 'rizhizhongxin' },
    },
    {
      // path: 'monitor',
      path: window._env_.monitor,
      name: 'App',
      hidden: false,
      meta: { title: '监控中心', icon: 'monitor' },
      // component: () => import('@/views/layout/MicroApp.vue'),
    },
    {
      name: 'PackageDetails',
      hidden: true,
      path: 'packageDetails',
      component: () => import('@/views/cicd/packagesDetails'),
      meta: {
        title: '制品库详情',
        icon: 'register',
        roles: ['default'],
      },
    },
    {
      path: 'app-detail',
      name: '应用详情',
      hidden: false,
      component: () => import('@/views/ams/app-detail'),
      hidden: true,
      meta: {
        title: '应用详情',
        // icon: 'list',
        roles: ['cicd', 'cicd_admin', 'devops', 'ams_admin'],
      },
    },
    {
      path: 'app-edit',
      name: '应用编辑',
      component: () => import('@/views/ams/app-edit'),
      hidden: true,
      meta: {
        title: '应用配置',
        // icon: 'list',
        roles: ['cicd_admin', 'ams_admin', 'devops'],
      },
    },
    {
      path: 'app-add-workflow',
      name: '应用创建',
      component: () => import('@/views/ams/app-add-workflow'),
      hidden: true,
      meta: {
        title: '应用创建',
        // icon: 'list',
        roles: ['cicd_admin', 'ams_admin', 'devops'],
      },
    },
    {
      path: 'env-add-workflow',
      name: '自定义集群环境',
      component: () => import('@/views/ams/env-add-workflow'),
      hidden: true,
      meta: {
        title: '自定义集群环境',
        // icon: 'list',
        roles: ['cicd_admin', 'ams_admin', 'devops'],
      },
    },
    {
      path: 'app-apollo',
      name: 'Apollo配置',
      component: () => import('@/views/ams/app-apollo'),
      hidden: true,
      meta: {
        title: 'Apollo配置',
        roles: ['cicd_admin', 'ams_admin', 'devops'],
      },
    },
    {
      path: 'appEnvVariables',
      name: '配置环境变量',
      hidden: false,
      component: () => import('@/views/cicd/app-env'),
      hidden: true,
      meta: {
        title: '配置环境变量',
        // icon: 'list',
        //roles: ['cicd_admin', 'ams_admin', 'devops'],
      },
    },  {
      path: 'apolloConfig',
      name: '配置中心',
      hidden: false,
      component: () => import('@/views/cicd/apollo-config'),
      meta: {
        title: '配置中心',
      },
    },{
      path: 'change-record',
      name: 'teamName',
      hidden: false,
      component: () => import('@/views/cicd/change-record'),
      meta: {
        title: '变更记录',
      },
    },
    {
      path: 'app/app-notice-subscribe',
      name: '订阅通知',
      hidden: false,
      component: () => import('@/views/ams/app-notice-subscribe'),
      meta: {
        title: '订阅通知',
      },
    },
    {
      path: 'app-add',
      name: '应用新增',
      hidden: false,
      component: () => import('@/views/ams/app-add'),
      hidden: true,
      meta: {
        title: '应用新增',
        // icon: 'list',
        roles: ['cicd_admin', 'ams_admin', 'devops'],
      },
    },
    {
      path: 'app/build/',
      name: '应用构建',
      hidden: false,
      component: () => import('@/views/cicd/app-build'),
      hidden: true,
      meta: {
        title: '应用构建',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/build-jenkins/',
      name: '应用构建',
      hidden: false,
      component: () => import('@/views/cicd/app-build-jenkins'),
      hidden: true,
      meta: {
        title: '应用构建',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/design-pipeline-build/',
      name: '持续构建',
      hidden: false,
      component: () => import('@/views/cicd/design-pipeline-build'),
      hidden: true,
      meta: {
        title: '持续构建',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/design-pipeline-build-quality/',
      name: '质量管控',
      hidden: false,
      component: () => import('@/views/cicd/design-pipeline-build-quality'),
      hidden: true,
      meta: {
        title: '质量管控',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/pipline-config/',
      name: '构建计划',
      hidden: false,
      component: () => import('@/views/cicd/pipline-config'),
      hidden: true,
      meta: {
        title: '构建计划',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/pipline-config-template/',
      name: '计划模板',
      hidden: false,
      component: () => import('@/views/cicd/pipline-config-template'),
      hidden: true,
      meta: {
        title: '计划模板',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/pipline-config-design/',
      name: '自定义流水线',
      hidden: false,
      component: () => import('@/views/cicd/pipline-config-design'),
      hidden: true,
      meta: {
        title: '计划模板',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/grayscale-deploy/',
      name: '灰度发布',
      hidden: false,
      component: () => import('@/views/cicd/grayscale-deploy'),
      hidden: true,
      meta: {
        title: '灰度发布',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/app-deploy/',
      name: '应用部署',
      hidden: false,
      component: () => import('@/views/cicd/app-deploy'),
      hidden: true,
      meta: {
        title: '应用部署',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/webconsole/',
      name: '终端',
      hidden: false,
      component: () => import('@/views/cicd/webconsole'),
      hidden: true,
      meta: {
        title: '终端',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/app-deploy-pod/',
      name: '运行实例',
      hidden: false,
      component: () => import('@/views/cicd/app-deploy-pod'),
      hidden: true,
      meta: {
        title: '运行实例',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/build-mobile/',
      name: '移动端应用构建',
      hidden: false,
      component: () => import('@/views/cicd/app-build-mobile'),
      hidden: true,
      meta: {
        title: '移动端应用构建',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/mobile-config',
      name: '移动端应用配置',
      hidden: false,
      component: () => import('@/views/ams/app-mobile-config'),
      hidden: true,
      meta: {
        title: '移动端应用配置',
        icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/git-commits/',
      name: 'Git提交记录',
      component: () => import('@/views/cicd/app-git-commits'),
      hidden: true,
      meta: {
        title: 'Git提交记录',
        // icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
    {
      path: 'app/build-history',
      name: '发布历史',
      component: () => import('@/views/cicd/publish-history'),
      hidden: true,
      meta: {
        title: '发布历史',
        // icon: 'list',
        roles: ['cicd', 'devops'],
      },
    },
  ],
}

export default continuousIntegrationRouter
