import axios from 'axios'
import url from 'postcss-url'
import { PWD, UserName } from './conf'
import zhugeAnalytics from '@/utils/zhuge-analytics.js'

export function login(username, password) {
  //  const data = {
  //    'userName': username,
  //    'password': password,
  //    'captcha': ''
  //  }
  //  const head = {
  //    'client_id': 'muse',
  //    'client_type': 'web',
  //    'redirect_uri': ''
  //  }
  //  const res = axios({
  //    url: 'oyo-sso/api/app/login',
  //    method: 'post',
  //    headers: head,
  //    data: data})
  // return res
  const data = {
    username: username,
    password: password,
  }
  const Qs = require('qs')

  return axios({
    url: '/ops-auth/jwt-token/',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: Qs.stringify(data),
  })
}

export function getInfo() {
  return axios({
    url: window._env_.baseUrl + '/user/info',
    method: 'get',
  })
}

export function UserLoginInfo(token) {
  const param = {
    // 'username': username
  }
  const header = { AUTHORIZATION: 'AUTHORIZATION' + ' ' + token }
  return axios({
    url: window._env_.service_tag + '/api/system-setting/user-login-info/',
    method: 'get',
    headers: header,
    params: param,
  })
}

export function LoginInfo() {
  const param = {
    // 'username': username
  }
  return axios({
    url: window._env_.service_tag + '/api/system-setting/user-login-info/',
    method: 'GET',
    params: param,
  })
}

export function LogoutMethod() {
  const param = {
    // 'username': username
  }
  return axios({
    url: window._env_.service_tag + '/api/logout/',
    method: 'GET',
    params: param,
  })
}

export function getJwtToken() {
  const data = {
    username: UserName,
    password: PWD,
  }
  const Qs = require('qs')

  return axios({
    url: '/ops-auth/jwt-token/',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: Qs.stringify(data),
  })
}

// export const ennLogin = ()=>axios({
//   url:"/sys-auth/component/init",
//   method:'get'
// })
export function ennLogin() {
  return axios({
    url: window._env_.baseUrl + '/sys-auth/component/init',
    method: 'get',
  })
}

//鉴权
export function filterAsyncRouterData(roter) {
  getInfo()
    .then((res) => {
      if (res.status === 200) {
        if (res.data.code === 500) {
          this.$alert(res.data.message, '提示', {
            type: 'warning',
          })
        } else {
          let userName = res.data.data.userName
          if (userName !== null && userName !== undefined && userName !== '') {
            zhuge.identify(userName.toLowerCase())
            zhuge.track('打开产品', {
              产品名称: window._env_.zhugeProductName,
              一级分类名称: 'PAAS',
            })
          }
        }
      } else {
        alert('res.status:' + res.status)
      }
    })
    .catch((err) => {
      console.log('err', err)
    })

  let url = window._env_.baseUrl + '/sys-auth/route/init'
  return axios({
    url: url,
    method: 'get',
  })
  //.then((res)=>{
  //   console.log(res)
  //  if(res.status==200){
  //    if(res.data.code === 500){
  //     alert(res.data.message);
  //    }else{
  //     data = res.data.data;
  //     console.log(data)
  //    }
  //  }

  // }).catch((res)=>{

  // })
}
