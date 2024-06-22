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
 * @FilePath: \pass-frontend\src\router\modules\exent.js
 */
import Layout from '@/views/layout/Layout'

const propertyRouter = {
  path: '/property',
  component: Layout,
  hidden: true,
  redirect: '/property/property',
  name: 'App',
  meta: {
    title: '资产管理',
    icon: 'property',
    roles: ['default'],
  },
  children: [
    {
      name: 'App',
      hidden: true,
      path: 'apply',
      component: () => import('@/views/property/apply'),
      meta: {
        title: '资产申请',
        icon: 'cloudservice',
        roles: ['default'],
      },
    },
    {
      name: 'App',
      hidden: true,
      path: 'vm',
      component: () => import('@/views/property/vm'),
      meta: {
        title: '虚机管理',
        icon: 'vm',
        roles: ['default'],
      },
    },
  ],
}

export default propertyRouter
