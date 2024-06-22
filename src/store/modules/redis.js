import { getToken } from '@/utils/auth'
import { getRedis, addRelation, deleteRelation } from '@/api/redis'

const redis = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_redis({ commit }, args) {
            return new Promise((resolve, reject) => {
              getRedis(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        redis_add_relation({ commit }, args) {
            return new Promise((resolve, reject) => {
                addRelation(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        redis_delete_relation({ commit }, args) {
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
export default redis