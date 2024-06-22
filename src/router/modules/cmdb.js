import Layout from '@/views/layout/Layout'
const cmdbRouter = {
    path: '/cmdb',
    component: Layout,
    redirect: '/cmdb/ecs',
    name: 'cmdb',
    meta:{
      title: '资产管理',
      icon: 'table',
      roles: ['devops', 'ons_r', 'ons_w', 'ons_dev_r', 'dba', 'test_w', 'test_r', 'cmdb_rw', 'cmdb_application_w',
              'cmdb_application_r', 'ons_dev_w', 'cmdb_r']
    },
    children: [
      {
        path: 'ecs',
        name: 'ecs_list',
        component: () => import('@/views/cmdb/ecs/list'),
        meta: {
          title: 'ECS列表',
          roles: ['devops', 'cmdb_r']
        }
      },
      {
        path: 'app',
        name: 'app_list',
        component: () => import('@/views/cmdb/application/list'),
        meta: {
          title: '应用列表',
          roles: ['devops', 'dba', 'test_w', 'test_r', 'cmdb_application_r', 'cmdb_application_w']

        }
      },
      {
        path: 'app_detail',
        name: 'app_detail',
        component: () => import('@/views/cmdb/application/detail'),
        meta: {
          title: '应用详情',
          roles: ['devops', 'dba', 'test_w', 'test_r', 'cmdb_application_r', 'cmdb_application_w']
        },
        hidden: true
      },
      {
        path: 'resource',
        name: 'app_resource',
        component: () => import('@/views/cmdb/application/resource'),
        meta: {
          title: '资源详情',
          roles: ['default']
        },
        hidden: true
      },
      {
        path: 'env',
        name: 'env_manage',
        component: () => import('@/views/cmdb/env/list'),
        meta: {
          title: '环境管理',
          roles: ['devops', 'dba']
        }
      },
      {
        path: 'slb',
        name: 'slb_list',
        component: () => import('@/views/cmdb/slb/list'),
        meta: {
          title: 'slb管理',
          roles: ['devops']
        }
      },
      {
        path: 'vswitch',
        name: 'vswitch_list',
        component: () => import('@/views/cmdb/network/vswitch'),
        meta: {
          title: '交换机列表',
          roles: ['devops']
        }
      },
      {
        path: 'dns',
        name: 'dns_manage',
        redirect: '/cmdb/dns/list',
        component: () => import('@/views/cmdb/domain/index'),
        meta: {
          title: '域名管理',
          roles: ['devops', 'dba']
        },
        children: [
           {
             path: 'list',
             name: 'dns_list',
             component: () => import('@/views/cmdb/domain/list/index'),
             meta: {
                title: '域名列表',
                roles: ['devops', 'dba']
              }
           },
           {
              path: 'detail',
              name: 'dns_detail',
              component: () => import('@/views/cmdb/domain/detail/index'),
              meta: {
                title: '解析详情',
                roles: ['devops', 'dba']
              },
              hidden: true
            }
        ]
      },
      
      {
         path: 'ons',
         name: 'ons_manage',
         component: () => import('@/views/cmdb/ons/index'),
         meta: {
           title: 'ONS管理',
           roles: ['devops', 'ons_w', 'ons_r', 'ons_dev_r', 'ons_dev_w']
         }
      },
      {
        path: 'org',
        name: 'org_manage',
        component: () => import('@/views/cmdb/org/list'),
        meta: {
          title: '业务域管理',
          roles: ['devops', 'dba']
        }
      },
      {
        path: 'rds',
        name: 'rds_manage',
        component: () => import('@/views/cmdb/db/rds'),
        meta: {
          title: 'rds管理',
          roles: ['devops', 'dba']
        }
      },
      {
        path: 'redis',
        name: 'redis_manage',
        component: () => import('@/views/cmdb/db/redis'),
        meta: {
          title: 'redis管理',
          roles: ['devops', 'dba']
        }
      },
      {
        path: 'pwd',
        name: 'pwd_manage',
        component: () => import('@/views/cmdb/passwd/list'),
        meta: {
          title: '公共密码管理',
          roles: ['devops', 'dba']
        }
      },
      {
        path: 'alert',
        name: 'alert_subscript',
        component: () => import('@/views/cmdb/alert/index'),
        meta: {
          title: '告警订阅',
          roles: ['devops']
        }
      },
      {
        path: 'cdn',
        name: 'cdn_manage',
        component: () => import('@/views/cmdb/cdn/index'),
        meta: {
          title: 'CDN管理',
          roles: ['devops']
        }
      }
    ]
}

export default cmdbRouter 