import Layout from '@/views/layout/Layout'
import sql from "../../components/SqlModify/sqlModify";
import sqlQuery from "../../components/SqlModify/sqlQuery";
import sqlQueryNew from "../../components/SqlModify/sqlQueryNew";
import createSql from "../../components/SqlModify/CreateDatabase";
import querySlow from "../../components/SqlModify/QuerySlow";
import dataModel from "../../components/SqlModify/DataModel";
const sqlRouter = {
    path: '/sql',
    component: Layout,
    redirect: '/sql/myself',
    name: 'sql_modify',
    hidden: false,
    meta: {
        title: '数据管理DMS',
        icon:'shujuguanli',
        roles: ['default']
    },

    children: [
        {
            name: 'App',
            hidden: true,
            // path: '/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant&processKey=sqlConfirmSimple&processName=sqlConfirmSimple&current=1',
            path: 'sql',
            component: sql,
            meta: {
                title: '在线SQL脚本执行',
                icon: 'sqlzhixing',
                roles: ['default'],
            },
        },
        {
            name: 'App',
            hidden: true,
            path: 'dataModel',
            component: dataModel,
            meta: {
                title: '数据模型管理',
                icon: 'vm',
                roles: ['default'],
            },
        },
        /*{
            name: 'App',
            hidden: true,
            path: 'sqlQuery',
            component: sqlQuery,
            meta: {
                title: '在线数据查询',
                icon: 'shujuchaxun',
                roles: ['default'],
            },
        },*/
	    {
            name: 'App',
            hidden: true,
            path: 'sqlQueryNew',
            component: sqlQueryNew,
            meta: {
	            title: `在线数据查询`,
                icon: 'dbSearch',
                roles: ['default'],
            },
        },
        {
            name: 'TenantSetting',
            hidden: true,
            path: 'createSql',
            component: createSql,
            meta: {
                title: '数据库实例管理',
                icon: 'shujukushiliguanli',
                roles: ['default'],
            },
        },
        // {
        //     name: 'App',
        //     hidden: true,
        //     path: 'querySlow',
        //     component: querySlow,
        //     meta: {
        //         title: '慢SQL查询',
        //         icon: 'mansqlchaxun',
        //         roles: ['default'],
        //     },
        // },
    ]

}

export default sqlRouter
