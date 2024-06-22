/*
 * @Author: your name
 * @Date: 2021-04-26 19:05:52
 * @LastEditTime: 2021-12-03 15:27:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\router\modules\foundation.js
 */
import Layout from '@/views/layout/Layout'
const foundationRouter = {
    path: '/foundation',
    component: Layout,
    redirect: '/foundation/middleware',
    name: 'ticket',
    hidden: false,
    meta: {
        title: '开发者工具',
        icon: 'service',
        roles: ['devops']
    },
    children: [
        {
            path: 'https://oss-console-web.ennew.com',
            name: 'App',
            hidden: false,
            meta: { title: '对象存储', icon: 'oss' }
        },
         {
            path: 'https://svc-govern-web.ennew.com',
            name: 'App',
            hidden: false,
            meta: { title: '服务治理', icon: 'register' }
        },
        {
            path: 'https://foundation-frontend.ennew.com',
            name: 'App',
            hidden: false,
            meta: { title: '触达平台', icon: 'push' }
        },
        {
            path: 'https://rdfa-timer-console.ennew.com/',
            name: 'App',
            hidden: false,
            meta: { title: '调度中心', icon: 'taskwork' }
        },
        // {
        //     path: 'https://servicemesh.ennew.com/kiali/',
        //     name: 'Middleware',
        //     hidden: false,
        //     meta: { title: '服务网格', icon: 'servicemesh' }
        // },
        {
            path: 'https://rdfa-mq.ennew.com/',
            name: 'App',
            hidden: false,
            meta: { title: '消息中心', icon: 'queue' }
        },
        // {
        //     path: 'http://rdfa-codegen-front.dev.ennew.com/#/homepage/createProject',
        //     name: 'Middleware',
        //     hidden: true,
        //     meta: { title: '代码生成器', icon: 'code' }
        // },
        {
            path: 'https://open-platform-frontend.ennew.com',
            // name: 'OpenplatformChild',
            name: 'App',
            hidden: false,
            meta: {
                title: '开放平台',
                icon: 'platform'
            }
        },
        {
            path: 'http://crawler-platform-frontend.ennew.com/',
            name: 'App',
            hidden: false,
            meta: { title: '爬虫平台', icon: 'pachong' }
        },
        {
            path: 'http://realtime-platform-frontend.ennew.com/',
            name: 'App',
            hidden: false,
            meta: { title: '数据传输', icon: 'shujuchuanshu' }
        },
        {
            path: 'http://search-platform-frontend.ennew.com/',
            name: 'App',
            hidden: false,
            meta: { title: '搜索服务', icon: 'search' }
        },
        {
            path: 'https://component-management.ennew.com/#/componentsManage?appId=guest',
            name: 'App',
            hidden: false,
            meta: { title: '组件平台', icon: 'componentPlatform1' }
        },
		    {
	            path: 'http://gwops.ennewi.cn',
	            name: 'App',
	            hidden: false,
			        title: '网关中心',
	            meta: {
	                title: '网关中心',
	                icon: 'tree'
	            }
	        },
        // {
        //     path: 'http://rdfa-cfg-portal.ennewi.cn',
        //     name: 'Middleware',
        //     hidden: false,
        //     meta: { title: '配置中心', icon: 'setting' }
        // }
       

    ]
}

export default foundationRouter