/*
 * @Author: your name
 * @Date: 2021-04-14 14:05:00
 * @LastEditTime: 2021-07-13 20:55:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\api\global_variable.dev.js
 */
const service_tag = '/ops-auth'
const cmdb_tag = '/cmdb'
const baseUrl = 'http://tenant-management-service.ennew.cn/tenant-management'
const pipeline_tag = 'http://ops-app-rest.ennew.cn/devops-pipeline-manager'
const devopsWebSocket = 'ws://ops-app-rest.ennew.cn/devops-pipeline-manager/v2'
const env = 'NEW_PRO_ONLINE'
const appid = 'tenant-management-service'
const accessKey = 'xxxxxxx'
const taskCenter = 'https://rdfa-bp-taskcenter.ennew.cn'
const createServerBaseURL = 'http://qingyun-web.dev.ennewi.cn'
const goClientURL = 'http://ops-app-rest.ennew.cn/devops-k8s-go-client'
const canAddVmUsers = ['LVPENGC', 't-LVPENGC', 'FUZHIWEI', 't-FUZHIWEI']
const app_env = 'online'
//生产环境接入审批在次数增加配置  目前接入租户有:新奥新智、光迅嘉
const checkTenantIds = ['1369923265280311297','1384075485780504577']

const zhugeProductName='云原生平台'
const zhugeAppKey='3577008d5b854267b18b650f0c375417'
const zhugeDebug=false

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
  goClientURL,
  checkTenantIds,
  zhugeProductName,
  zhugeAppKey,
  zhugeDebug
}
