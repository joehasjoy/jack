import { getToken } from '@/utils/auth'
import { getSlbList } from '@/api/slb'

const slb = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_slb({ commit }, args) {
            return new Promise((resolve, reject) => {
              getSlbList(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        

    }
}
export default slb