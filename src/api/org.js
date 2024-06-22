import axios from 'axios'

export function getOrgList(token, data){
    const url = `/cmdb/api/oyo/tech/org/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function createOrg(token, data) {
    const url = `/cmdb/api/oyo/tech/org/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function updateOrg(token, data) {
    const url = `/cmdb/api/oyo/tech/org/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'put',
        headers: header,
        data: data
    })
    return res
}