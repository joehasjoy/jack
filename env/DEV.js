const service_tag = '/ops-auth'
const cmdb_tag = '/cmdb'
const baseUrl =
'https://devops-portal-service.dev.ennew.com/tenant-management'
const pipeline_tag = 'http://ops-app-rest.ennewi.cn/devops-pipeline-manager-dev'
const devopsWebSocket =
  'ws://ops-app-rest.ennewi.cn/devops-pipeline-manager-dev/v2'
const goClientURL = 'http://devops-k8s-go-client.dev.ennewi.cn'
const env = 'NEW_DEV'
const appid = 'tenant-management-service'
const accessKey = 'xxxxxxx'
const taskCenter = 'https://rdfa-bp-taskcenter.dev.ennew.com'
const efficiencyDevops = 'https://efficiency-manage-frontend.dev.ennew.com'
const createServerBaseURL = 'http://qingyun-web.dev.ennewi.cn'
const canAddVmUsers = ['LVPENGC1', 't-LVPENGC', 'FUZHIWEI', 't-FUZHIWEI']
//生产环境接入审批在次数增加配置  目前接入租户有:
const checkTenantIds = ['1371750490517663745']
//接入到灰度发布租户
const canaryDeploy = ['1371750490517663745']
//fat环境发布时需要指定分支  数能 新智
const checkFatNeedReleaseTestBranchTenantIds=['1384075485780504577','1369923265280311297']
const app_env = 'dev'
const zhugeProductName = '云原生平台'
const zhugeAppKey = 'f18695ad248e41ad9e1d494c7889c137'
const zhugeDebug = true
const monitor = 'http://apm.dev.ennewi.cn'
const openapi = 'http://open-platform-frontend.dev.ennewi.cn/'
const themeapi = 'https://rdfa-gateway.dev.ennew.com/bff'
const themekey = 'NmANCM3eGcSmVGIxqsPnbKjWxKLm0zUy'
const dataModelUrl = "https://data-asset-front.dev.ennew.com/modeling.html#/step"
const webConsoleUrl = "https://devops-suppor-component.dev.ennew.com"
const gitLabWebHook = "http://devops-portal-service-yj.dev.ennew.com/tenant-management/open-pipeline/webhook/startTask"
const publicBaseUrl = 'https://rdfa-gateway.dev.ennew.com/devops'
const publicAccessKey = 'rnOzmxVKioKSWkx2ckZraS8GoLrGEGev'
//灰度发布环境
const canaryDeployEnv="DEV"

// 生产环境发布支持“部署类型”的租户
const prodSupportDeployType = ['1369923265280311297', '1371750490517663745']

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
  checkFatNeedReleaseTestBranchTenantIds,
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
  goClientURL,
  zhugeProductName,
  zhugeAppKey,
  zhugeDebug,
  monitor,
  openapi,
  themeapi,
  themekey,
  canaryDeployEnv,
  prodSupportDeployType
}
