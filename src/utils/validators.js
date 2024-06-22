import { validateNumber, isFloat, isValidGroupId, isValidAppid } from '@/utils/validate'

let Validators = {}

Validators.datetime = function (rule, value, callback) {
  let now = new Date()
  let expire = Date.parse(value)
  if (!value) {
    callback(new Error('不能为空，且时间必须为未来时间'))
  }
  if (now > expire) {
    callback(new Error('过期时间必须为未来时间'))
  } else {
    callback()
  }
}

Validators.string = function (rule, value, callback) {
  if (value !== '') {
    callback()
  } else {
    callback(new Error('不能为空'))
  }
}

Validators.number = function (rule, value, callback) {
  if (validateNumber(value) || isFloat(value)) {
    callback()
  } else {
    callback(new Error('必须为数字'))
  }
}

Validators.float = function (rule, value, callback) {
  if (isFloat(value)) {
    callback()
  } else {
    callback(new Error('必须为浮点型'))
  }
}
Validators.groupid = function(rule, value, callback){
   if(isValidGroupId(value)){
     callback()
   } else {
     callback(new Error('输入不合法'))
   }
}

Validators.appid = function(rule, value, callback){
  if(isValidAppid(value)){
    callback()
  } else {
    callback(new Error('appId不合法,请参考提示'))
  }
}
export default Validators