import Layout from '@/views/layout/Layout'
import workorder from "@/views/workorder/workorder";
import applyWorkOrder from "@/views/workorder/applyWorkOrder";
const workOrderSystemRouter = {
  path: '/workorder',
  component: Layout,
  hidden: true,
  redirect: '/workorder/workorder',
  name: 'App',
  meta: {
    title: '平台工单',
    icon: 'workorder',
    roles: ['default'],
  },
  children: [
    {
      name: 'App',
      hidden: true,
      path: 'workorder',
      component: workorder,
      meta: {
        title: '平台工单',
        icon: 'workorder',
        roles: ['default'],
      },
    },
	  {
		  name: 'applyWorkOrder',
		  show: false,
		  path: 'applyWorkOrder',
		  component: applyWorkOrder,
		  meta: {
			  title: '平台工单申请',
			  icon: 'workorder',
			  roles: ['default'],
		  },
	  },
  ],
}

export default workOrderSystemRouter
