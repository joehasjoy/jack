/*
 * @Author: your name
 * @Date: 2021-04-14 14:05:00
 * @LastEditTime: 2021-04-19 16:13:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\utils\common.js
 */
/*
* 时间转换
* formatDate(2873495302394, 'yyyy-MM-dd hh:mm:ss')
* */
import store from '../store'
function formatDate(dateTime,fmt) {
	let d = new Date(dateTime)
	let o = {
		"M+" : d.getMonth()+1,                 //月份
		"d+" : d.getDate(),                    //日
		"h+" : d.getHours(),                   //小时
		"m+" : d.getMinutes(),                 //分
		"s+" : d.getSeconds(),                 //秒
		"q+" : Math.floor((d.getMonth()+3)/3), //季度
		"S"  : d.getMilliseconds()             //毫秒
	}
	
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length))
	}
	for(let k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))
		}
	}
	return fmt
}

/*邮箱验证正则*/
function EmailReCheck(email) {
  var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
  if (email === "") { //输入不能为空
    //alert("输入不能为空!");
    return false;
  } else if (!reg.test(email)) { //正则验证不通过，格式不对
    //alert("验证不通过!");
    return false;
  } else {
    //alert("通过！");
    return true;
  }
}

// js保存内容至本地文件
function saveShareContent(content, fileName) {
  let downLink = document.createElement('a')
  downLink.download = fileName
  //字符内容转换为blod地址
  let blob = new Blob([content])
  downLink.href = URL.createObjectURL(blob)
  // 链接插入到页面
  document.body.appendChild(downLink)
  downLink.click()
  // 移除下载链接
  document.body.removeChild(downLink)
}

/* 获取url参数 */
function getParams(key) {
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  console.log('getParms', window.location.search.substr(1))
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

/* 获取url参数 */
function getUrlKey(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}


/*
roles: 为用户所拥有的权限;
permissionRoles: 为设定的权限
*/
function hasPermission(roles, permissionRoles) {
  // console.log('roles:', roles)
  if (roles.some(role => ['admin', 'administrators', 'super_admin'].indexOf(role) >= 0)) return true // admin permission passed directly
  if (!permissionRoles) return true
  // return roles.some(role => permissionRoles.indexOf(role) >= 0)
  return true

}







// 生成yaml编辑页面
function editorInit(editor) {
  require('brace/ext/language_tools') //language extension prerequsite...
  require('brace/mode/yaml')
  // require('brace/mode/json')
  require('brace/theme/monokai')
  require('brace/theme/merbivore')
  require('brace/theme/ambiance')
  require('brace/snippets/yaml') //snippet
  require('brace/snippets/text') //snippet
  // editor.setReadOnly(true)  // 设置只读
  editor.setOption("wrap", true)    // 设置自动换行
  editor.setFontSize(12)
  editor.setOptions({
    // minLines: 20, // 最小行数
    // maxLines: Infinity, //高度自适应
    enableBasicAutocompletion: true, //开启基础自动补全
    enableLiveAutocompletion: true, // 开启实时自动补全
    enableSnippets: true, // 启用代码片段
  })
}

//   处理与参与者中心解耦-登录所需 处理参数和url
function handleAuthLoginParams(parms, url, method) {
	let obj = {}
	// post也需要拼接到地址栏
	if (method === 'post'||method === 'POST' || method === 'PUT'){
		obj = {
			url: `${window._env_.baseUrl}/auth_fallback${url}?fallback_tenantId=${store.getters.authLoginTenantId}&fallback_userName=${store.getters.authLoginUserName}&fallback_userId=${store.getters.authLoginUserId}`
		}
	} else {
		obj = {
			parms: {
				...parms,
				fallback_tenantId: store.getters.authLoginTenantId,
				fallback_userName: store.getters.authLoginUserName,
				fallback_userId: store.getters.authLoginUserId,
			},
			url: `${window._env_.baseUrl}/auth_fallback${url}`
		}
	}
	
	
	return obj
}


export default {
  EmailReCheck,
  saveShareContent,
	formatDate,
  getParams,
  getUrlKey,
  hasPermission,
  editorInit,
	handleAuthLoginParams
}
