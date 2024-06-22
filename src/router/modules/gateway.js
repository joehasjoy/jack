/*
 * @Author: your name
 * @Date: 2021-04-26 19:05:52
 * @LastEditTime: 2021-05-06 14:56:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\router\modules\foundation.js
 */
import Layout from '@/views/layout/Layout'

const gatewayRouter = {
  path: '/gatewayRoot',
  component: Layout,
  hidden: false,
  redirect: '/gatewayRoot/gateway',
  name: 'gatewayRoot',
  meta: {
    title: '网关',
    icon: 'peoples',
    roles: ['default'],
  },
  children: [
    {
      path: 'http://gwops.ennewi.cn',
      name: 'App',
      hidden: false,
      // component: () => import('@/views/ams/middleware'),
      meta: {
        title: '网关',
        icon: 'email',
        roles: ['default'],
      },
    },
  ],
}

export default gatewayRouter
