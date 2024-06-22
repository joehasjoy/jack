import axios from 'axios'

export function getDnsList(token, data){
    const url = `/cmdb/api/dns/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getPublicList(token, data) {
    const url = `/cmdb/api/dns/domain/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function getPrivateList(token, data) {
    const url = `/cmdb/api/dns/privatezone/info/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
        params: data
    })
    return res
}

export function pausePrivateRecord(token, data) {
    const url = `/dns-service/api/dns/private/recodes/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'patch',
        headers: header,
        data: data
    })
    return res
}

export function pausePublicRecord(token, data) {
    const url = `/dns-service/api/dns/public/recodes/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'patch',
        headers: header,
        data: data
    })
    return res
}

export function deletePrivateRecord(token, data) {
    const url = `/dns-service/api/dns/private/recodes/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'delete',
        headers: header,
        data: data
    })
    return res
}

export function deletePublicRecord(token, data) {
    const url = `/dns-service/api/dns/public/recodes/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'delete',
        headers: header,
        data: data
    })
    return res
}

export function updatePrivateRecord(token, data) {
    const url = `/dns-service/api/dns/private/recodes/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'put',
        headers: header,
        data: data
    })
    return res
}

export function updatePublicRecord(token, data) {
    const url = `/dns-service/api/dns/public/recodes/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'put',
        headers: header,
        data: data
    })
    return res
}

export function createPrivateRecord(token, data) {
    const url = `/dns-service/api/dns/private/recodes/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}

export function createPublicRecord(token, data) {
    const url = `/dns-service/api/dns/public/recodes/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res
}