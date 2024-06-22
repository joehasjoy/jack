import axios from 'axios'

export function getSlbList(token, data){
    const url = `/cmdb/api/slb/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}