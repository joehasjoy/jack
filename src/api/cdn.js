import axios from 'axios'

export function getTasks(token, data){
    const url = `/cdn-service/api/cdn/describe_refresh_tasks/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getCdnQuota(token, data){
    const url = `/cdn-service/api/cdn/describe_refresh_quota/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function pushCdnCache(token, data) {
    const url = `/cdn-service/api/cdn/push_object_cache/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function refreshCdnCache(token, data) {
    const url = `/cdn-service/api/cdn/refresh_object_caches/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}