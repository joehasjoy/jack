const service_tag = '/ops-auth'
const cmdb_tag = '/cmdb'
const baseUrl = 'https://tenant-management-service-com.ennew.com/tenant-management'
const pipeline_tag = 'https://ops-app-rest.ennew.com/devops-pipeline-manager'
const devopsWebSocket = 'ws://ops-app-rest.ennew.com/devops-pipeline-manager/v2'
const goClientURL = 'https://ops-app-rest.ennew.com/devops-k8s-go-client'
const env = 'NEW_PRO_ONLINE'
const appid = 'tenant-management-service'
const accessKey = 'xxxxxxx'
const taskCenter = 'https://rdfa-bp-taskcenter.ennew.com'
const efficiencyDevops = 'https://efficiency-manage-frontend.ennew.com'
const createServerBaseURL = 'https://qingyun-web.dev.ennew.com'
const canAddVmUsers = ['LVPENGC', 't-LVPENGC', 'CUICHUNLIA', 't-CUICHUNLIA','MALIJING','t-MALIJING','WANCHUANFENG','t-WANCHUANFENG']
const previewURL='https://devops-onlie-preview.ennew.com'
//fat环境发布时需要指定分支  数能 新智
const checkFatNeedReleaseTestBranchTenantIds=['"1384075485780504577','"1369923265280311297']
//生产环境接入审批在次数增加配置  目前接入租户有:新奥新智、光迅嘉
const checkTenantIds = ['1369923265280311297','1384075485780504577','1387330602944675842']

//接入到灰度发布租户
const canaryDeploy = ['1369923265280311297']
const app_env = 'pro'
const zhugeProductName='研发工作台'
const zhugeAppKey='3577008d5b854267b18b650f0c375417'
const zhugeDebug=false

const monitor = 'http://apm.ennew.com'
const openapi = 'http://open-platform-frontend.ennewi.cn/'
const themeapi = 'https://rdfa-gateway.ennew.com/plat-editor-bff'
const themekey = 'XuAZlXiuHvPOHq1pSmu5NS0G1DaML6hq'
const dataModelUrl = "https://data-asset-front.ennew.com/modeling.html#/step"
const webConsoleUrl = "wss://devops-k8s-manage.ennew.com/webconsole"
const gitLabWebHook = "https://tenant-management-service-com.ennew.com/tenant-management/open-pipeline/webhook/startTask"
const publicBaseUrl = 'https://rdfa-gateway.ennew.com/devops'
const publicAccessKey = 'JWd8f4Gc6vcCcIw0GdJuEaSc4cBqnG7r'

//灰度发布环境
const canaryDeployEnv="PROD"

// 生产环境发布支持“部署类型”的租户
const prodSupportDeployType = ['1369923265280311297', '1387330602944675842']

window._env_ = {
  publicBaseUrl,
  publicAccessKey,
  webConsoleUrl,
	gitLabWebHook,
  dataModelUrl,
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
  canaryDeploy,
  checkFatNeedReleaseTestBranchTenantIds,
  goClientURL,
  zhugeProductName,
  zhugeAppKey,
  zhugeDebug,
  monitor,
  openapi,
  themeapi,
  themekey,
  canaryDeployEnv,
  prodSupportDeployType,
  previewURL
}
