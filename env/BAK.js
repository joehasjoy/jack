const service_tag = '/ops-auth'
const cmdb_tag = '/cmdb'
const baseUrl = 'http://127.0.0.1:8080/tenant-management'
const pipeline_tag = 'http://ops-app-rest.ennewi.cn/devops-pipeline-manager-dev'
const devopsWebSocket =
  'ws://ops-app-rest.ennewi.cn/devops-pipeline-manager-dev/v2'
const goClientURL = 'http://devops-k8s-go-client.dev.ennewi.cn'
const env = 'NEW_DEV'
const appid = 'tenant-management-service'
const accessKey = 'xxxxxxx'
const taskCenter = 'https://rdfa-bp-taskcenter.dev.ennewi.cn'
const efficiencyDevops = 'https://efficiency-manage-frontend.dev.ennew.com'
const createServerBaseURL = 'http://qingyun-web.dev.ennewi.cn'
const canAddVmUsers = ['LVPENGC', 't-LVPENGC', 'FUZHIWEI', 't-FUZHIWEI']
//生产环境接入审批在次数增加配置  目前接入租户有:
const checkTenantIds = ['1371750490517663745']
const app_env = 'dev'
const zhugeProductName = '云原生平台'
const zhugeAppKey = 'f18695ad248e41ad9e1d494c7889c137'
const zhugeDebug = true
const monitor = 'http://apm.dev.ennewi.cn'
const openapi = 'http://open-platform-frontend.dev.ennewi.cn/'
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
