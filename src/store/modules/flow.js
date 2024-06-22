import { getFlows, getFlowForm, getProductLine, getPlatform, getOrg, getMuseUser, getFrameWork, createTicket, getMyselfTask,
        getTodoTask, getAuditTask, getDetailTask, getDetailForm, agreeTicket, refuseTicket } from '@/api/flow'
import { getToken } from '@/utils/auth'
const flow = {
    state: {

    },
    mutations: {

    },
    actions: {
        get_flow_list({ commit }, args) {
            return new Promise((resolve, reject) => {
              getFlows(args, getToken()).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        get_flow_form({ commit }, args){
            return new Promise((resolve, reject) => {
                getFlowForm(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_product_line({ commit }, args){
          return new Promise((resolve, reject) => {
              getProductLine(args, getToken()).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
          })
        },
        get_platform_info({ commit }, args){
            return new Promise((resolve, reject) => {
                getPlatform(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_muse_org({commit}, args){
            return new Promise((resolve, reject) => {
                getOrg(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_muse_user({commit}, args){
            return new Promise((resolve, reject) => {
                getMuseUser(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_frame_work({commit}, args){
            return new Promise((resolve, reject) => {
                getFrameWork(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        create_ops_ticket({ commit }, args){
            return new Promise((resolve, reject) => {
                createTicket(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_myself_task({ commit}, args){
            return new Promise((resolve, reject) => {
                getMyselfTask(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_todo_task({ commit }, args){
            return new Promise((resolve, reject) => {
                getTodoTask(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_audit_task({ commit }, args) {
            return new Promise((resolve, reject) => {
                getAuditTask(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_detail_task({ commit }, args){
            return new Promise((resolve, reject) => {
                getDetailTask(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_detail_form({ commit }, args){
            return new Promise((resolve, reject) => {
                getDetailForm(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        agree_ticket({ commit }, args){
            return new Promise((resolve, reject) => {
                agreeTicket(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        refuse_ticket({ commit }, args){
            return new Promise((resolve, reject) => {
                refuseTicket(args, getToken()).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}

export default flow