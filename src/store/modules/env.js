import { getToken } from '@/utils/auth'
import { getEnvList, createEnv } from '@/api/env'

const env = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_env({ commit }, args) {
            return new Promise((resolve, reject) => {
              getEnvList(getToken()).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        create_env({ commit }, args){
          return new Promise((resolve, reject) => {
              createEnv(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
          })
        }

    }
}
export default env