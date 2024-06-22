import axios from 'axios'
import { Message } from 'element-ui'
import JSONbig from "json-bigint";

//创建axios的一个实例
let instance = axios.create({
  baseURL:  window._env_.baseURL, //接口统一域名
  timeout: 40000, //40秒超时
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
	transformResponse: [function (data) {
		try {
			// 如果转换成功则返回转换的数据结果
			return JSONbig.parse(data)
		} catch (err) {
			// 如果转换失败，则包装为统一数据格式并返回
			return {
				data
			}
		}
	}]
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  function(response) {
		// 这个是rdfa框架定义的 0 就是成功
	  if (response.data.code == 200 || response.data.code == 0) {
      return response.data
    } else {
      Message({
        type: 'error',
        message: response.data.message,
      })
    }
  },
  function(error) {
    Message({
      type: 'error',
      message: '请求错误,请稍候再试',
    })
    return Promise.reject(error)
  }
)

export function _request(methods, url, data = undefined, params = {}) {
  return new Promise((resolve, reject) => {
    instance({
      baseURL: window._env_.baseUrl,
      method: methods,
      url: url,
      params: params,
      data: data,
    })
      .then((response) => {
        return resolve(response)
      })
      .catch((error) => {
        return reject(error)
      })
  })
}
