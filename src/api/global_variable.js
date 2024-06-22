/*
 * @Author: your name
 * @Date: 2021-04-14 14:05:00
 * @LastEditTime: 2021-08-18 16:48:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\api\global_variable.dev.js
 */
const service_tag = '/ops-auth'
const cmdb_tag = '/cmdb'
const baseUrl =
  'http://tenant-management-service.dev.ennewi.cn/tenant-management'
const pipeline_tag = 'http://ops-app-rest.ennewi.cn/devops-pipeline-manager-dev'
const devopsWebSocket =
  'ws://ops-app-rest.ennewi.cn/devops-pipeline-manager-dev/v2'
const goClientURL = 'http://devops-k8s-go-client.dev.ennewi.cn'
const env = 'NEW_DEV'
const appid = 'tenant-management-service'
const accessKey = 'xxxxxxx'
const taskCenter = 'https://rdfa-bp-taskcenter.dev.ennewi.cn'
const createServerBaseURL = 'http://qingyun-web.dev.ennewi.cn'
const canAddVmUsers = ['LVPENGC', 't-LVPENGC', 'FUZHIWEI', 't-FUZHIWEI']
//生产环境接入审批在次数增加配置  目前接入租户有:
const checkTenantIds = ['1371750490517663745']
const app_env = 'dev'
const zhugeProductName='云原生平台'
const zhugeAppKey='f18695ad248e41ad9e1d494c7889c137'
const zhugeDebug=true

export default {
  service_tag,
  cmdb_tag,
  baseUrl,
  pipeline_tag,
  devopsWebSocket,
  env,
  appid,
  accessKey,
  taskCenter,
  createServerBaseURL,
  canAddVmUsers,
  app_env,
  checkTenantIds,
  goClientURL,
  zhugeProductName,
  zhugeAppKey,
  zhugeDebug
}
