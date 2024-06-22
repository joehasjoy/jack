import Layout from '@/views/layout/Layout'
import test from "../../components/effciencyManage/test"
import configFrom from "../../components/effciencyManage/configFrom"
const effciencyManageRouter = {
	path: '/effciency',
	component: Layout,
	redirect: '/effciency/app',
	name: 'App',
	hidden: false,
	meta: {
		title: '效能管理',
		icon: 'xioaneng1',
		roles: ['cicd', 'devops'],
	},
	children: [
		{
			path: '/home-panel/config-sheet',
			// component: configFrom,
			name: 'App',
			hidden: false,
			meta: { title: '配置单', icon: 'peizhidan' },
		},
		{
			path: '/home-panel/test-sheet',
			component: test,
			name: 'App',
			hidden: false,
			meta: { title: '提测单', icon: 'tice' },
		},
	
	],
}

export default effciencyManageRouter
