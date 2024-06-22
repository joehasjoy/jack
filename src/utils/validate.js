/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = /^[a-zA-Z.0-9]+\@oyohotels.cn/
  //const valid_map = /^[0-9]{11}/
  return valid_map.test(str)
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 数字 */
export function validateNumber(num) {
  const reg = /^[0-9]+$/
  return reg.test(num)
}

/*浮点型 */
export function isFloat(num) {
  const reg = /^-?\d*\.\d+$/
  return reg.test(num)
}


/*判断是否是instanceId */

export function isInstanceId(instanceid) {
  const reg = /^i\-[a-zA-Z0-9]+$/
  return reg.test(instanceid)
}

/* 判断是否是合法IP*/

export function isIp(ip) {
  const reg = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip)
}

/* 判断是否是合法的rds实例id */
export function isRdsInstance(instanceid) {
  const reg = /^rm||^rr\-[a-z0-9]{17}/
  return reg.test(instanceid)
}

/* 判断是否是合法的rds实例id */
export function isRedisInstance(instanceid) {
  const reg = /^r\-[a-z0-9]{18}/
  return reg.test(instanceid)
}

/*判断是否是合法的group ID */
export function isValidGroupId(group) {
  const reg = /^GID[-_][0-9a-zA-Z-_]{3,60}/
  return reg.test(group)
}

/*判断是否是合法的url */

export function isValidUrl(url) {
  const reg = /^[http,https].*/
  return reg.test(url)
}

export function isValidAppid(appid) {
  const reg = /^[a-z]+.*/
  return reg.test(appid)
}