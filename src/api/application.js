import axios from 'axios'

export function searchApplication(data, token){
    const url = `/cmdb/api/application/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}


export function getLanguage(token) {
    const url = `/cmdb/api/language/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
    })
    return res
}

export function putApplication(token, data) {
    const url = `/cmdb/api/application/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'put',
        headers: header,
        data: data
    })
    return res
}

export function getAppConfig(token, data) {
    const url = `/cmdb/api/k8s/appInfo/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function putAppConfig(token, data) {
    const url = `/cmdb/api/k8s/appInfo/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'put',
        headers: header,
        data: data
    })
    return res
}

export function getLdapUsers(data){
    const url = `/ops-auth/api/system-setting/user/`
    const res = axios({
        url: url,
        method: 'get',
        params: data
    })
    
    return res
}

export function getAppResourceDetail(data, token){
    const url = `/cmdb/api/appDetail/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        params: data,
        headers: header
    })
    
    return res
}