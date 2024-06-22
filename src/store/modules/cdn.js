import { getToken } from '@/utils/auth'
import { getTasks, getCdnQuota, pushCdnCache, refreshCdnCache } from '@/api/cdn'

const cdn = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_tasks({ commit }, args) {
            return new Promise((resolve, reject) => {
              getTasks(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        get_cdn_quota({ commit }, args) {
            return new Promise((resolve, reject) => {
                getCdnQuota(getToken(),  args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        push_cdn_cache({ commit }, args) {
            return new Promise((resolve, reject) => {
                pushCdnCache(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        refresh_cdn_cache({ commit }, args) {
            return new Promise((resolve, reject) => {
                refreshCdnCache(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        }
        
        
    }
}
export default cdn