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
import sql from "../../components/SqlModify/sqlModify";

const dmsRouter = {
  path: '/sql',
    component: Layout,
    redirect: '/sql/myself',
    name: 'sql_modify',
    hidden: false,
    meta: {
        title: 'SQL变更',
        icon:'peoples',
        roles: ['default']
    },
  children: [
    {
      name: 'App',
      hidden: true,
      path: 'sql',
      component: sql,
      meta: {
          title: 'SQL变更',
          icon: 'peoples',
          roles: ['default'],
      },
  },
  ],
}

export default dmsRouter
