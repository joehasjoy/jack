// eslint-disable-next-line no-unused-vars
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Vue from 'vue'
import axios from 'axios'
import YAML from 'yaml'
import qs from 'qs'

const globalVariable = window._env_

Vue.use(ElementUI)

// 获取Kube Env list信息
export function initGetEnv(url) {
  let parms = { init: true }
  return axios({
    method: 'GET',
    url: url,
    params: parms,
  })
}

// 获取namespace list信息
export function initGetNS(url, env) {
  let parms = { env: env } // env_id
  // console.log('pp:', parms, url)
  return axios({
    method: 'GET',
    url: url,
    params: parms,
  })
}

export function initGetTable(url, env, ns, label_selector, field_selector) {
  let parms = {
    env: env,
    namespace: ns,
    label_selector: label_selector,
    field_selector: field_selector,
  }
  // console.log('parms:', parms)
  return axios({
    method: 'GET',
    url: url,
    params: parms,
  })
}

export function initGetTableNoNS(url, env, label_selector, field_selector) {
  let parms = {
    env: env,
    label_selector: label_selector,
    field_selector: field_selector,
  }
  // console.log('parms:', parms)
  return axios({
    method: 'GET',
    url: url,
    params: parms,
  })
}

// 获取目标信息
export function GetTgtData(url, env, ns, name) {
  let parms = { env: env, namespace: ns, name: name }
  return axios({
    method: 'GET',
    url: url,
    params: parms,
  })
}

// 更新目标信息
export function UpdateTgt(url, env, content) {
  let data_json
  try {
    data_json = YAML.parse(content, {})
  } catch (err) {
    this.$notify.error({ message: String(err) })
    // console.log('error:', err)
    return
  }
  let parms = {
    env: env,
    namespace: data_json.metadata.ns,
    name: data_json.metadata.name,
    action: 'replace',
    body: data_json,
  }
  return axios({
    method: 'PUT',
    url: url,
    data: this.qs.stringify({ row: JSON.stringify(parms) }),
  })
}

// 删除目标
export function DelTgtData(url, env, row) {
  let parms = {
    env: env,
    namespace: row.detail.metadata.namespace,
    name: row.detail.metadata.name,
  }
  return axios({
    method: 'DELETE',
    url: url,
    data: qs.stringify({ match: JSON.stringify(parms) }),
  })
}

const kube = {
  state: {
    loading: false,
    env_id: '',
    env_list: [],
    ns_id: '',
    ns_list: [],

    ns_url: globalVariable.service_tag + '/api/kubernetes/namespace/',
  },

  mutations: {
    update_env_list: (state, env_list) => {
      state.env_list = env_list
      let flag = false
      for (let i = 0; i < env_list.length; ++i) {
        if (sessionStorage.getItem('kube_env_id') === String(env_list[i].id)) {
          flag = true
        }
      }
      if (sessionStorage.getItem('kube_env_id') && flag) {
        state.env_id = Number(sessionStorage.getItem('kube_env_id'))
      } else if (env_list.length >= 1) {
        state.env_id = env_list[0]['id']
      }
    },

    update_ns_list: (state, ns_list) => {
      state.ns_list = ns_list
      if (ns_list.length > 0) {
        var nss = ns_list.map(function(val) {
          return val.name
        })
      } else {
        nss = []
      }
      let kube_ns_id = sessionStorage.getItem('kube_ns_id')
      // console.log(ns_list, kube_ns_id, nss.indexOf(kube_ns_id) >= 0)
      if (kube_ns_id && nss.indexOf(kube_ns_id) >= 0) {
        state.ns_id = kube_ns_id
      } else if (ns_list.length >= 1) {
        state.ns_id = ns_list[0]['id']
      }
    },
  },

  actions: {
    /* 获取kubernetes集群环境 */
    getKubeEnv({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        initGetEnv(state.ns_url)
          .then((response) => {
            if (response.data.status) {
              // env_list = response.data.data
              // console.log('store:', response.data.data)
              if (response.data.data.length > 0) {
                commit('update_env_list', response.data.data)
                resolve(dispatch('getKubeNS', data))
              } else {
                sessionStorage.setItem('kube_env_id', '')
                sessionStorage.setItem('kube_ns_id', '')
              }
            } else {
              reject(response.data.error)
            }
          })
          .catch((response) => {
            reject(response)
          })
      })
    },
    /* 获取kubernetes 命名空间列表 */
    getKubeNS({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        initGetNS(state.ns_url, state.env_id)
          .then((response) => {
            if (response.data.status) {
              // console.log('store:', response.data.data)
              sessionStorage.setItem('kube_env_id', state.env_id)
              // 当kube_env 改变时，ns设初始状态
              // sessionStorage.setItem('kube_ns_id', '')
              // state.ns_id = ''
              commit('update_ns_list', response.data.data)
              // resolve(dispatch('getKubeTable', data))
              if (data.ns_list) {
                resolve(response)
              } else {
                resolve(dispatch('getKubeTable', data))
              }
            } else {
              reject(response.data.error)
            }
          })
          .catch((response) => {
            reject(response)
          })
      })
    },
    /* 获取kubernetes 服务列表 */
    getKubeTable({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        state.loading = true
        initGetTable(
          data.url,
          state.env_id,
          state.ns_id,
          data.label_selector,
          data.field_selector
        )
          .then((response) => {
            if (response.data.status) {
              sessionStorage.setItem('kube_ns_id', state.ns_id)
              resolve(response)
            } else {
              reject(response.data.error)
            }
            state.loading = false
          })
          .catch((response) => {
            reject(response)
            state.loading = false
          })
      })
    },

    getKubeTgtData({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        GetTgtData(data.url, data.env, data.ns, data.name)
          .then((response) => {
            if (response.data.status) {
              // console.log('store:', response.data.data)
              resolve(response)
            } else {
              reject(response.data.error)
            }
          })
          .catch((response) => {
            reject(response)
          })
      })
    },

    DelKubeTgt({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        //
        $notify.success({ message: response.data.message })
        DelTgtData(data.url, data.env, data.row)
          .then((response) => {
            if (response.data.status) {
              // console.log('store:', response.data.data)

              resolve(response)
            } else {
              reject(response.data.error)
            }
          })
          .catch((response) => {
            reject(response)
          })
      })
    },

    /* 没有命名空间的服务组件 */
    /* 获取kubernetes集群环境 */
    getKubeEnvNoNS({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        sessionStorage.setItem('kube_env_id', state.env_id)
        initGetEnv(state.ns_url)
          .then((response) => {
            if (response.data.status) {
              // console.log('store:', response.data.data)
              state.env_list = response.data.data
              if (sessionStorage.getItem('kube_env_id')) {
                state.env_id = Number(sessionStorage.getItem('kube_env_id'))
              } else if (response.data.data.length >= 1) {
                state.env_id = response.data.data[0]['id']
              }
              // commit('update_env_list', response.data.data)
              resolve(dispatch('getKubeTableNoNS', data))
            } else {
              reject(response.data.error)
            }
          })
          .catch((response) => {
            reject(response)
          })
      })
    },
    /* 获取kubernetes 服务列表 */
    getKubeTableNoNS({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        state.loading = true
        initGetTableNoNS(
          data.url,
          state.env_id,
          data.label_selector,
          data.field_selector
        )
          .then((response) => {
            if (response.data.status) {
              // sessionStorage.setItem('kube_env_id', state.env_id)
              resolve(response)
            } else {
              reject(response.data.error)
            }
            state.loading = false
          })
          .catch((response) => {
            reject(response)
            state.loading = false
          })
      })
    },
  },
}
export default kube
