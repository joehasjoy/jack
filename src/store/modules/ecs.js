import { getEcsList, queryEcs, initEcs } from '@/api/ecs'
import { getToken } from '@/utils/auth'
const ecs = {
    state: {

    },
    mutations: {

    },
    actions: {
      get_ecs_list({ commit }, args) {
          return new Promise((resolve, reject) => {
            getEcsList(args, getToken()).then(resp => {
                resolve(resp)
            }).catch(err => {
                reject(err)
            })
          })
      },
      query_ecs({ commit }, args) {
        return new Promise((resolve, reject) => {
          queryEcs(args, getToken()).then(resp => {
            resolve(resp)
          }).catch(err => {
            reject(err)
          })
        })
      },
      init_ecs({ commit }, args) {
        return new Promise((resolve, reject) => {
          initEcs(args, getToken()).then(resp => {
            resolve(resp)
          }).catch(err => {
            reject(err)
          })
        })
      }  
    }
}

export default ecs