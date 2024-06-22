import { getToken } from '@/utils/auth'
import { getRds, addRelation, deleteRelation } from '@/api/rds'

const rds = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_rds({ commit }, args) {
            return new Promise((resolve, reject) => {
              getRds(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        add_relation({ commit }, args) {
            return new Promise((resolve, reject) => {
                addRelation(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        delete_relation({ commit }, args) {
            return new Promise((resolve, reject) => {
                deleteRelation(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        }
        
        
    }
}
export default rds