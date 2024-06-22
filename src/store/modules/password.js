import { getToken } from '@/utils/auth'
import { getPasswdList, createPasswd, modifyPasswd, deletePasswd } from '@/api/password'

const pwd = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_passwd({ commit }, args) {
            return new Promise((resolve, reject) => {
              getPasswdList(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
       create_passwd({ commit }, args) {
           return new Promise((resolve, reject) => {
               createPasswd(getToken(), args).then(resp => {
                   resolve(resp)
               }).catch(err => {
                   reject(err)
               })
           })
       },
        modify_passwd({ commit }, args) {
            return new Promise((resolve, reject) => {
              modifyPasswd(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        delete_passwd({ commit }, args) {
            return new Promise((resolve, reject) => {
              deletePasswd(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        }

    }
}
export default pwd