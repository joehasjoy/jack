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

const auditLogRouter = {
  path: '/audit',
  component: Layout,
  redirect: '/audit/app',
  name: 'App',
  hidden: false,
  meta: {
    title: '审计日志',
    icon: 'log',
    roles: ['cicd', 'devops'],
  },
  children: [
    {
      path: 'auditLog',
      name: 'Team',
      hidden: false,
      component: () => import('@/views/ams/audit-log'),
      meta: {
        title: '审计日志',
        icon: 'log',
      },
    },
  ],
}

export default auditLogRouter
