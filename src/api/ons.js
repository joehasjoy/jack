import axios from 'axios'

export function createOns(token, data){
    const url = `/ons-service/api/ons/oneclick/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function getOnsRegion(token, data) {
    const url = `/cmdb/api/ons/region/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getOnsInstance(token, data) {
    const url = `/cmdb/api/ons/instance/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getOnsTopic(token, data) {
    const url = `/cmdb/api/ons/topic/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getOnsGroup(token, data) {
    const url = `/cmdb/api/ons/group/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function createTopic(token, data) {
    const url = `/ons-service/api/ons/topic/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function deleteTopic(token, data) {
    const url = `/ons-service/api/ons/topic/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'delete',
        headers: header,
        data: data
    })
    return res
}

export function grantTopicPerm(token, data) {
    const url = `/ons-service/api/ons/topic/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'put',
        headers: header,
        data: data
    })
    return res
}

export function getTopicSub(token, data) {
    const url = `/ons-service/api/ons/topic/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function createGroup(token, data) {
    const url =`/ons-service/api/ons/group/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function deleteGroup(token, data) {
    const url =`/ons-service/api/ons/group/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'delete',
        headers: header,
        data: data
    })
    return res
}

export function getGroupSub(token, data) {
    const url = `/ons-service/api/ons/group/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getConsumerToGroupDetail(token, data) {
    const url = `/ons-service/api/ons/consumer/accmulate/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getConsumerConnect(token, data) {
    const url = `/ons-service/api/ons/comsumer/connection/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getConsumerStatusDetail(token, data){
    const url = `/ons-service/api/ons/comsumer/status/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function sendMessage(token, data) {
    const url = `/ons-service/api/ons/message/send/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function getMessageById(token, data) {
    const url = `/ons-service/api/ons/message/getbymsgid/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getMessageByIdTrace(token, data) {
    const url = `/ons-service/api/ons/message/consumeraccumulate/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getMessageByKey(token, data) {
    const url = `/ons-service/api/ons/message/getbykey/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getMessageByDate(token, data) {
    const url = `/ons-service/api/ons/message/querybytopic/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function pushMessageById(token, data) {
    const url = `/ons-service/api/ons/message/push/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function createMessageTraceTask(token, data) {
    const url = `/ons-service/api/ons/trace/query/msgid/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function getTraceByQueryId(token, data) {
    const url = `/ons-service/api/ons/trace/get/result/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}