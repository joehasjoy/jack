/*
 * @Author: your name
 * @Date: 2021-06-30 13:51:46
 * @LastEditTime: 2021-06-30 16:04:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\api\env.js
 */
import axios from 'axios'
export function getEnvList(token){
    const url = `/cmdb/api/env/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'get',
        headers: header,
    })
    return res
}




export function createEnv(token, data) {
    const url = `/cmdb/api/env/`
    const header = {'AUTHORIZATION': 'AUTHORIZATION' +' ' + token}
    const res = axios({
        url: url,
        method: 'post',
        headers: header,
        data: data
    })
    return res

}