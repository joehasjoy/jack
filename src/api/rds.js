import axios from 'axios'

export function getRds(token, data){
    const url = `/cmdb/api/rds/info/`
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
    const url = `/cmdb/api/rds/application/`
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
    const url = `/cmdb/api/rds/application/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'delete',
        headers: header,
        data: data
    })
    return res
}