import axios from 'axios'

export function getVswitchList(token, data){
    const url = `/cmdb/api/vswitch/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function putVswitch(token, data){
    const url = `/cmdb/api/vswitch/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'put',
        headers: header,
        data: data
    })
    return res
}

export function postVswitch(token, data){
    const url = `/cmdb/api/vswitch/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}