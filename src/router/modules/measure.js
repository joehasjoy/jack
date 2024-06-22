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


const measureRouter = {
  path: '/measure',
  component: Layout,
  hidden: true,
  redirect: '/measure',
  name: 'App',
  meta: {
    title: '度量统计',
    icon: 'platform',
    roles: ['default'],
  },
  children: [
    {
      path: 'http://realtime-platform-frontend.ennewi.cn/',
      name: 'Middleware',
      hidden: false,
      meta: { title: '实时计算平台', icon: 'setting' }
    },
    {
      path: 'http://search-platform-frontend.ennewi.cn/',
      name: 'Middleware',
      hidden: false,
      meta: { title: '搜索平台', icon: 'setting' }
    }
  ],
}

export default measureRouter
