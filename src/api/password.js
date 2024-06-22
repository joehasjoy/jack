import axios from 'axios'

export function getPasswdList(token, data){
    const url = `/cmdb/api/passwd/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function createPasswd(token, data) {
    const url = `/cmdb/api/passwd/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function modifyPasswd(token, data) {
    const url = `/cmdb/api/passwd/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'put',
        headers: header,
        data: data
    })
    return res
}

export function deletePasswd(token, data) {
    const url = `/cmdb/api/passwd/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'delete',
        headers: header,
        params: data
    })
    return res
}