import {
  login,
  getInfo,
  getJwtToken,
  UserLoginInfo,
  LoginInfo,
  LogoutMethod,
} from '@/api/login'
import jwt from 'jwt-decode'
import { setToken } from '@/utils/auth'
import store from '../../store'

const user = {
  state: {
    userid: null,
    // token: sessionStorage.token,
    token: localStorage.token,
    ticket: localStorage.ticket,
    // token: '',
    // username: sessionStorage.username,
    username: localStorage.username ? localStorage.username : 'user',
    name: localStorage.name ? localStorage.name : 'user',
    // username: '',
    expire: '',
    avatar: '',
    // roles: ['super_admin'],
    roles: [],
    // roles: sessionStorage.roles ?  sessionStorage.getItem('roles') : [],
  },

  mutations: {
    updateToken: (state, token) => {
      state.token = token
      localStorage.token = token
      // sessionStorage.token = token
      // console.log('updateToken:', sessionStorage.token, state.token)
    },
    updateTicket: (state, ticket) => {
      state.ticket = ticket
      localStorage.ticket = ticket

      // console.log('updateToken:', sessionStorage.token, state.token)
    },
    decodeToken: (state, token) => {
      state.userid = jwt(localStorage.token).username
      // state.expire = new Date(1000 * jwt(localStorage.token).exp)
      state.username = jwt(localStorage.token).username
      state.name = jwt(localStorage.token).name
      localStorage.username = state.username
      localStorage.name = state.name
      // sessionStorage.username = state.username
      // console.log('decodeToken:', state.userid, state.username)
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRE: (state, exp) => {
      state.expire = exp
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      // localStorage.roles = roles
      localStorage.roles = roles
    },
    removeStorage: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem('roles')
      localStorage.removeItem('ticket')
      state.roles = []
      // sessionStorage.removeItem('token')
      // sessionStorage.removeItem('roles')
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        resolve()
        // login(username.split('@')[0], userInfo.password)
        //   .then((response) => {
        //     // console.log("token:", response)
        //     const data = response.data.data
        //     // commit('SET_EXPIRE', data.expire_time)
        //     if (response.data.status && data) {
        //       commit('updateToken', data.token)
        //       commit('decodeToken', data.token)
        //       commit('updateTicket', data.ticket)
        //       setToken(data.token)
        //     }
        //     resolve(response)
        //   })
        //   .catch((error) => {
        //     // console.log("token error:", error)
        //     reject(error)
        //   })
      })
    },

    // 获取用户登陆信息
    UserLoginInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        resolve()
        // UserLoginInfo(state.token)
        //   .then((response) => {
        //     // console.log('UserLoginInfo:', response)
        //     const data = response.data.data
        //     if (data.role_list && data.role_list.length > 0) {
        //       // 验证返回的roles是否是一个非空数组
        //       commit('SET_ROLES', data.role_list)
        //       commit('SET_AVATAR', data.name ? data.name : data.username)
        //     } else if (data.role_list.length > 0) {
        //       commit('SET_ROLES', data.role_list)
        //     } else {
        //       commit('SET_ROLES', [])
        //       // reject('getInfo: roles must be a non-null array !')
        //     }
        //     resolve(response)
        //   })
        //   .catch((error) => {
        //     // console.log('GetInfo:', error)
        //     reject(error)
        //   })
      })
    },

    // 获取用户登陆信息
    GetLoginInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        resolve()
        // LoginInfo()
        //   .then((response) => {
        //     // console.log('UserLoginInfo:', response)
        //     const data = response.data.data
        //     if (data.role_list && data.role_list.length > 0) {
        //       // 验证返回的roles是否是一个非空数组
        //       commit('SET_ROLES', data.role_list)
        //       commit('SET_AVATAR', data.name ? data.name : data.username)
        //     } else if (data.role_list.length > 0) {
        //       commit('SET_ROLES', data.role_list)
        //     } else {
        //       commit('SET_ROLES', [])
        //       // reject('getInfo: roles must be a non-null array !')
        //     }
        //     resolve(response)
        //   })
        //   .catch((error) => {
        //     // console.log('GetInfo:', error)
        //     reject(error)
        //   })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        resolve()
        // getJwtToken().then(res => {
        //   const jwt_t = res.data.data.token
        // })
        // getInfo(localStorage.username, state.token)
        //   .then((response) => {
        //     // console.log('getInfo:', response)
        //     const data = response.data.data
        //     if (
        //       data.roles &&
        //       data.roles.length > 0 &&
        //       data.user_type === 'ldap'
        //     ) {
        //       // 验证返回的roles是否是一个非空数组
        //       commit('SET_ROLES', data.roles)
        //       commit('SET_AVATAR', data.user_ldap['attributes']['name'][0])
        //     } else if (data.roles.length > 0) {
        //       commit('SET_ROLES', data.roles)
        //     } else {
        //       reject('getInfo: roles must be a non-null array !')
        //     }
        //     resolve(response)
        //   })
        //   .catch((error) => {
        //     // console.log('GetInfo:', error)
        //     reject(error)
        //   })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      commit('removeStorage')
      setToken('')
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        setToken('')
        commit('removeStorage')
        resolve()
      })
    },

    get_user_info({ commit, state }) {
      return new Promise((resolve, reject) => {
        // console.log("get_user_info0:")
        // getJwtToken().then(res => {
        //   const jwt_t = res.data.data.token
        //   // console.log("get_user_info1:", res)
        // })
        getInfo()
          .then((response) => {
           console.log("get_user_info2:", response)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // session方式登出
    SessionLogOut({ commit, state }) {
      commit('removeStorage')
      setToken('')
      return new Promise((resolve, reject) => {
        LogoutMethod()
          .then((response) => {
            // console.log('UserLoginInfo:', response)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
}

export default user
