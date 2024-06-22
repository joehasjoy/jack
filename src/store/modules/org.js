import { getToken } from '@/utils/auth'
import { getOrgList, createOrg, updateOrg } from '@/api/org'

const org = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_org({ commit }, args) {
            return new Promise((resolve, reject) => {
              getOrgList(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        create_org({ commit }, args) {
            return new Promise((resolve, reject) => {
              createOrg(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        update_org({ commit }, args) {
            return new Promise((resolve, reject) => {
                updateOrg(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        }
        

    }
}
export default org