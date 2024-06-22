/*
 * @Author: your name
 * @Date: 2021-05-06 10:53:31
 * @LastEditTime: 2021-05-06 18:39:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\router\modules\exent.js
 */
import Layout from '@/views/layout/Layout'

const extendRouter = {
  path: '/extend',
  component: Layout,
  hidden: true,
  redirect: '/extend/guide',
  name: 'extend',
  meta: {
    title: '',
    icon: 'peoples',
    roles: ['default'],
  },
  children: [
    {
      name: 'guide',
      hidden: true,
      path: 'guide',
      component: () => import('@/views/guide/guide'),
      meta: {
        title: '指导手册',
        icon: 'component',
        roles: ['default'],
      },
    },
  ],
}

export default extendRouter
