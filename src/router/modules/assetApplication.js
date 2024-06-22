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

const assetApplicationRouter = {
  path: '/property',
  component: Layout,
  hidden: true,
  redirect: '/property/property',
  name: 'App',
  meta: {
    title: '资源申请',
    icon: 'cloudservice',
    roles: ['default'],
  },
  children: [
    {
      name: 'App',
      hidden: true,
      path: 'apply',
      component: () => import('@/views/property/apply'),
      meta: {
        title: '资源申请',
        icon: 'cloudservice',
        roles: ['default'],
      },
    },
  ],
}

export default assetApplicationRouter
