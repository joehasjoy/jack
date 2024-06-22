/*
 * @Author: your name
 * @Date: 2021-04-26 19:05:52
 * @LastEditTime: 2021-08-18 17:18:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\router\modules\foundation.js
 */
import Layout from '@/views/layout/Layout'
const openplatformRouter = {
  path: '/openplatform',
  component: Layout,
  redirect: '/openapi',
  name: 'ticket',
  hidden: false,
  meta: {
    title: '开放平台',
    icon: 'table',
    roles: ['devops'],
  },
  children: [
    {
      path: '/openapi',
      // name: 'OpenplatformChild',
      name: 'App',
      hidden: false,
      meta: {
        title: '开放平台',
        icon: 'property',
        roles: ['devops'],
      },
    },
  ],
}

export default openplatformRouter
