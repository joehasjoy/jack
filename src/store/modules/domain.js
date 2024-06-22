import { getToken } from '@/utils/auth'
import { getDnsList, getPublicList, getPrivateList, pausePrivateRecord, pausePublicRecord, deletePrivateRecord, deletePublicRecord, updatePrivateRecord, updatePublicRecord, createPrivateRecord, createPublicRecord } from '@/api/domain'

const domain = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_dns({ commit }, args) {
            return new Promise((resolve, reject) => {
              getDnsList(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        get_public_zone({ commit }, args) {
            return new Promise((resolve, reject) => {
              getPublicList(getToken(), args).then(res => {
                  resolve(res)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        get_private_zone({ commit }, args) {
            return new Promise((resolve, reject) => {
                getPrivateList(getToken(), args).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        pause_private_record({ commit }, args) {
          return new Promise((resolve, reject) => {
            pausePrivateRecord(getToken(), args).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
          })
        },
        pause_public_record({ commit }, args) {
            return new Promise((resolve, reject) => {
              pausePublicRecord(getToken(), args).then(res => {
                  resolve(res)
              }).catch(err => {
                  reject(err)
              })
            })
          },
        delete_private_record({ commit }, args) {
          return new Promise((resolve, reject) => {
              deletePrivateRecord(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
          })
        },
        delete_public_record({ commit }, args) {
            return new Promise((resolve, reject) => {
                deletePublicRecord(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        update_private_record({ commit }, args) {
            return new Promise((resolve, reject) => {
                updatePrivateRecord(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        update_public_record({ commit }, args) {
            return new Promise((resolve, reject) => {
                updatePublicRecord(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        create_private_record({ commit }, args) {
            return new Promise((resolve, reject) => {
                createPrivateRecord(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        create_public_record({ commit }, args) {
            return new Promise((resolve, reject) => {
                createPublicRecord(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
            
        }
    }
}
export default domain