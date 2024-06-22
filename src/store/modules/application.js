import { searchApplication, getLanguage, putApplication, getAppConfig, putAppConfig, getLdapUsers, getAppResourceDetail } from '@/api/application'
import { getToken } from '@/utils/auth'
const application = {
    state: {

    },
    mutations: {

    },
    actions: {
        search_app({ commit }, args) {
          return new Promise((resolve, reject) => {
            searchApplication(args, getToken()).then(resp => {
                resolve(resp)
            }).catch(err => {
                reject(err)
            })
          })
      },
      get_language({ commit }) {
          return new Promise((resolve, reject) => {
            getLanguage(getToken()).then(resp => {
                resolve(resp)
            }).catch(err => {
                reject(err)
            })
          })
      },
      put_app({ commit }, args) {
          return new Promise((resolve, reject) => {
            putApplication(getToken(), args).then(resp => {
                resolve(resp)
            }).catch(err => {
                reject(err)
            })
          })
      },
      get_app_config({ commit }, args) {
          return new Promise((resolve, reject) => {
              getAppConfig(getToken(),args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
          })
      },
      put_app_config({ commit }, args) {
          return new Promise((resolve, reject) => {
              putAppConfig(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
          })
      },
      get_ad_user({ commit }, args) {
          return new Promise((resolve, reject) => {
            getLdapUsers(args).then(resp => {
                resolve(resp)
            }).catch(err => {
                reject(err)
            })
          })
      },
      get_app_resource_detail({ commit }, args){
          return new Promise((resolve, reject) => {
            getAppResourceDetail(args, getToken()).then(resp => {
              resolve(resp)  
            }).catch(err => {
              reject(err)
            })
          })
      },  
    }
}

export default application