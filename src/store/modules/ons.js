import { getToken } from '@/utils/auth'
import { createOns, getOnsRegion, getOnsInstance, getOnsTopic, getOnsGroup, createTopic, deleteTopic,
     grantTopicPerm, getTopicSub, createGroup, deleteGroup, getGroupSub, getConsumerToGroupDetail, getConsumerConnect,
      getConsumerStatusDetail, sendMessage, getMessageById, getMessageByIdTrace, getMessageByKey, getMessageByDate,
      pushMessageById, createMessageTraceTask, getTraceByQueryId } from '@/api/ons'

const ons = {
    state: {

    },
    mutations: {

    },
    actions: {
        create_ons({ commit }, args) {
            return new Promise((resolve, reject) => {
              createOns(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
        },
        get_ons_region({ commit }, args) {
            return new Promise((resolve, reject) => {
              getOnsRegion(getToken(), args).then(resp => {
                  resolve(resp)
              }).catch(err => {
                  reject(err)
              })
            })
            
        },
        get_ons_instance({ commit }, args) {
            return new Promise((resolve, reject) => {
                getOnsInstance(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_ons_topic({ commit }, args) {
            return new Promise((resolve, reject) => {
                getOnsTopic(getToken(),args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_ons_group({ commit }, args) {
            return new Promise((resolve, reject) => {
                getOnsGroup(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        create_topic({ commit }, args) {
            return new Promise((resolve, reject) => {
                createTopic(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        delete_topic({ commit }, args) {
            return new Promise((resolve, reject) => {
                deleteTopic(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        grant_topic_perm({ commit }, args) {
            return new Promise((resolve, reject) => {
                grantTopicPerm(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_topic_sub({ commit }, args) {
            return new Promise((resolve, reject) => {
                getTopicSub(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        create_group({ commit }, args) {
            return new Promise((resolve, reject) => {
                createGroup(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        delete_group({ commit }, args) {
            return new Promise((resolve, reject) => {
                deleteGroup(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_group_sub({ commit }, args) {
            return new Promise((resolve, reject) => {
                getGroupSub(getToken(), args).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_consumer_detail({ commit }, args) {
            return new Promise((resolve, reject) => {
                getConsumerToGroupDetail(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_consumer_connection({ commit }, args) {
            return new Promise((resolve, reject) => {
                getConsumerConnect(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_consumer_status({ commit }, args) {
            return new Promise((resolve, reject) => {
                getConsumerStatusDetail(getToken(), args).then(resp =>{
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        send_message({ commit }, args) {
            return new Promise((resolve, reject) => {
                sendMessage(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_message_by_id({ commit }, args) {
            return new Promise((resolve, reject) => {
                getMessageById(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_message_by_id_trace({ commit },args) {
            return new Promise((resolve, reject) => {
                getMessageByIdTrace(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_message_by_key({ commit }, args) {
            return new Promise((resolve, reject) => {
                getMessageByKey(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_message_by_date({ commit }, args) {
            return new Promise((resolve, reject)=> {
                getMessageByDate(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        push_message_by_id({ commit }, args) {
            return new Promise((resolve, reject) => {
                pushMessageById(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        create_message_trace_task({ commit }, args) {
            return new Promise((resolve, reject) => {
                createMessageTraceTask(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        get_trace_by_query_id({ commit }, args) {
            return new Promise((resolve, reject) => {
                getTraceByQueryId(getToken(), args).then(resp => {
                    resolve(resp)
                }).catch(err =>{
                    reject(err)
                })
            })
        }

    }
}
export default ons