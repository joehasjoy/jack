import axios from 'axios'

export function getFlows(data, token){
    const url = `/flow-service/api/flow/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getFlowForm(data, token){
    const url = `/flow-service/api/flow/start/form/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getProductLine(data, token){
    const url = `/cmdb/api/oyo/product/line/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getPlatform(data, token){
    const url = `/cmdb/api/oyo/platform/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getOrg(data, token){
    const url = `/cmdb/api/oyo/org/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getMuseUser(data, token){
    const url = `/cmdb/api/oyo/user/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getFrameWork(data, token){
    const url = `/cmdb/api/oyo/third/domain/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function createTicket(data, token){
    const url = `/flow-service/api/flow/create/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function getMyselfTask(data, token){
    const url = `/flow-service/api/flow/query/initiated/tasks/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getTodoTask(data, token){
   const url = `/flow-service/api/flow/query/done/tasks/`
   const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getAuditTask(data, token){
    const url = `/flow-service/api/flow/query/todo/tasks/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getDetailTask(data, token){
    const url = `/flow-service/api/flow/query/task/detail/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function getDetailForm(data, token) {
    const url = `/flow-service/api/flow/query/form/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function agreeTicket(data, token){
    const url = `/flow-service/api/flow/pass/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function refuseTicket(data, token){
    const url = `/flow-service/api/flow/deny/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}