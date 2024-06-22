const service_tag = '/ops-auth'
const cmdb_tag = '/cmdb'
const baseUrl = 'http://tenant-management-service.ennewi.cn/tenant-management'
const pipeline_tag = 'http://ops-app-rest.ennewi.cn/devops-pipeline-manager'
const devopsWebSocket = 'ws://ops-app-rest.ennewi.cn/devops-pipeline-manager/v2'
const goClientURL = 'http://ops-app-rest.ennewi.cn/devops-k8s-go-client'
const env = 'NEW_PRO'
const appid = 'tenant-management-service'
const accessKey = 'xxxxxxx'
const taskCenter = 'https://rdfa-bp-taskcenter.ennewi.cn'
const efficiencyDevops = 'https://efficiency-manage-frontend.ennew.com'
const createServerBaseURL = 'http://qingyun-web.dev.ennewi.cn'
const canAddVmUsers = ['LVPENGC', 't-LVPENGC', 'CUICHUNLIA', 't-CUICHUNLIA','MALIJING','t-MALIJING','WANCHUANFENG','t-WANCHUANFENG']

//生产环境接入审批在次数增加配置  目前接入租户有:新奥新智、光迅嘉
const checkTenantIds = ['1369923265280311297', '1384075485780504577']
const app_env = 'pro'
const zhugeProductName = '云原生平台'
const zhugeAppKey = '3577008d5b854267b18b650f0c375417'
const zhugeDebug = false

const monitor = 'http://apm.ennew.com'
const openapi = 'http://open-platform-frontend.ennewi.cn/'

// 生产环境发布支持“部署类型”的租户
const prodSupportDeployType = ['1369923265280311297']

window._env_ = {
  service_tag,
  cmdb_tag,
  baseUrl,
  pipeline_tag,
  devopsWebSocket,
  env,
  appid,
  accessKey,
  taskCenter,
	efficiencyDevops,
  createServerBaseURL,
  canAddVmUsers,
  app_env,
  checkTenantIds,
  goClientURL,
  zhugeProductName,
  zhugeAppKey,
  zhugeDebug,
  monitor,
  openapi,
  prodSupportDeployType
}
