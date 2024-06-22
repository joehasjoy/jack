import { getToken } from '@/utils/auth'
import { getVswitchList, putVswitch, postVswitch } from '@/api/vswitch'

const vswitch = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_vswitch({ commit }, args) {
            return new Promise((resolve, reject) => {
              getVswitchList(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        put_vswitch({ commit }, args) {
            return new Promise((resolve, reject) => {
                putVswitch(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        post_vswitch({ commit }, args) {
            return new Promise((resolve, reject) => {
                postVswitch(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        }
        

    }
}
export default vswitch