import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Vue from 'vue'
import axios from 'axios'

Vue.use(ElementUI)

// 获取目标信息
export function VersionStatus(url, app_version_id) {
  let parms = { app_version_id: app_version_id }
  return axios({
    method: 'GET',
    url: url,
    params: parms,
  })
}

const ci_cd = {
  state: {
    loading: false,

    cmdb_appDetail_url: window._env_.cmdb_tag + '/api/appDetail/',
    k8s_app_url: window._env_.cmdb_tag + '/api/k8s/appInfo/', // 获取 app 的k8s 资产信息
    app_property_url: window._env_.cmdb_tag + '/api/app/property/',

    env_url: window._env_.service_tag + '/api/cicd/env/',
    dashboard_url: window._env_.service_tag + '/api/ams/dashboard/',
    app_url: window._env_.service_tag + '/api/ams/app/',
    app_resource_url: window._env_.service_tag + '/api/ams/app-resource/',
    app_resource_kube_url:
      window._env_.service_tag + '/api/ams/app-resource-kubernetes/',
    app_version_url: window._env_.service_tag + '/api/cicd/build/app-version/',
    version_status_url: window._env_.service_tag + '/api/cicd/version-status/',
    deployment_version_url:
      window._env_.service_tag + '/api/cicd/build/deployment/',
    git_branch_url: window._env_.service_tag + '/api/cicd/git-project/branch/',
    kube_app_url: window._env_.service_tag + '/api/cicd/kube-app/list/', // 获取 app运行在kubernetes信息列表
    app_merge_url: window._env_.service_tag + '/api/cicd/app-version/merge/', // 获取 app_version merge结果
    event_url: window._env_.service_tag + '/api/kubernetes/event/',
    sec_scan_url: window._env_.service_tag + '/api/cicd/sec-scan/',
    download_url: window._env_.service_tag + '/api/cicd/version-download/',
    sonar_url: 'http://sonar.ahotels.tech/dashboard?id=',

    //ws
    log_url: '/ws' + '/api/kubernetes/pod-log.html',
    term_url: '/ws' + '/api/kubernetes/pod-terminal.html',

    task_url: window._env_.service_tag + '/api/task/',
    unit_url: window._env_.service_tag + '/api/task/release/',
    execute_url: window._env_.service_tag + '/api/task/execute/',
  },

  mutations: {
    temp: (state) => {},
  },

  actions: {
    /* 获取kubernetes 服务列表 */
    GetVersionStatus({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        // state.loading = true
        VersionStatus(state.version_status_url, data.app_version_id)
          .then((response) => {
            resolve(response)
            // state.loading = false
          })
          .catch((response) => {
            reject(response)
            // state.loading = false
          })
      })
    },
  },
}

export default ci_cd
