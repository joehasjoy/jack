import axios from 'axios'

export function getRedis(token, data){
    const url = `/cmdb/api/redis/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function addRelation(token, data){
    const url = `/cmdb/api/redis/application/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function deleteRelation(token, data){
    const url = `/cmdb/api/redis/application/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'delete',
        headers: header,
        data: data
    })
    return res
}