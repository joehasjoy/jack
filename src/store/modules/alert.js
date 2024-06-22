import { getToken } from '@/utils/auth'
import { getItems, getNameSpace, getCluster, createSubscribe, getSubscribe, putSubscribe, deleteSubscribe } from '@/api/alert'

const alert = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_items({ commit }, args) {
            return new Promise((resolve, reject) => {
              getItems(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        get_namespace({ commit }, args) {
            return new Promise((resolve, reject) => {
                getNameSpace(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_cluster({ commit }, args) {
            return new Promise((resolve, reject) => {
                getCluster(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        create_subscribe({ commit }, args) {
            return new Promise((resolve, reject) => {
              createSubscribe(getToken(), args).then(resp =>{
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        get_subscribe({ commit }, args) {
            return new Promise((resolve, reject) => {
                getSubscribe(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        put_subscribe({ commit }, args) {
            return new Promise((resolve, reject) => {
                putSubscribe(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err =>{
                    reject(err)
                })
            })
        },
        delete_subscribe({commit}, args) {
            return new Promise((resolve, reject) => {
                deleteSubscribe(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        }
        
        
    }
}
export default alert