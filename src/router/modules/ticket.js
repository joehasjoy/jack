import Layout from '@/views/layout/Layout'
const ticketRouter = {
    path: '/ticket',
    component: Layout,
    redirect: '/ticket/new',
    name: 'ticket',
    meta: {
      title: '运维工单',
      icon: 'nested',
      roles: ['devops']
    },
    children: [
      {
        path: 'new',
        name: 'new',
        component: () => import('@/views/ticket/new'),
        meta: {
          title: '新建工单',
          icon: 'edit',
          roles: ['devops']
        }
      },
      {
        path: 'myself',
        name: 'myself',
        component: () => import('@/views/ticket/myself'),
        meta: {
          title: '我申请的',
          icon: 'example',
          roles: ['devops']
        }
      },
      {
        path: 'todo',
        name: 'todo',
        component: () => import('@/views/ticket/todo'),
        meta: {
          title: '我的待办',
          icon: 'documentation',
          roles: ['devops']
        }
      },
      {
        path: 'audit',
        name: 'audit',
        component: () => import('@/views/ticket/audit'),
        meta: {
          title: '我相关的',
          icon: 'component',
          roles: ['devops']
        }
      },
      {
        path: 'end',
        name: 'end',
        component: () => import('@/views/ticket/end'),
        meta: {
          title: '已完成的',
          icon: 'tab',
          roles: ['devops']
        }
      },
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/ticket/all'),
        meta: {
          title: '所有工单',
          icon: 'lock',
          roles: ['devops']
        }
      },
      {
        path: 'detail/:id',
        name: 'detail',
        component: () => import('@/views/ticket/detail'),
        meta: {
          title: '工单详情',
          icon: 'list',
          roles: ['devops']
        },
        hidden: true
      }
    ]

}

export default ticketRouter