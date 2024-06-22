/*
 * @Author: your name
 * @Date: 2021-04-19 15:55:47
 * @LastEditTime: 2021-08-13 10:22:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\utils\pipline.js
 */
/*
获取编译语言的详细信息
*/
import { Message } from 'element-ui'
import pinyin from 'js-pinyin'
import axios from 'axios'
import store from "../store";
import common from "./common";
export function getUseLanguageName(useLanguage) {
  // console.log(typeof(useLanguage))
  console.log(useLanguage)
  var name = ""
  if (useLanguage === 1) {
    name = "java"
  }
  if (useLanguage === 2) {
    name = "python"
  }
  if (useLanguage === 3) {
    name = "golang"
  }
  if (useLanguage === 4) {
    name = "nodeJs"
  }
  if (useLanguage === 5) {
    name = "Javascript"
  }
  if (useLanguage === 6) {
    name = "android"
  }
  if (useLanguage === 7) {
    name = "iOS"
  }
  if (useLanguage === 8) {
    name = "flutter"
  }
  if (useLanguage === 9) {
    name = "miniProgram"
  }
  return name
}


export function getEnvList() {
	//   处理与参与者中心解耦 - 降级判断，参数 URL 处理
	let url = window._env_.baseUrl + '/env/get';
	let parms = {};
	if (store.getters.authLoginToken){
		let resParam = common.handleAuthLoginParams(parms,`/env/get`)
		parms = resParam.parms;
		url = resParam.url;
	}
  axios({
    url: url,
	  params: parms,
    method: 'GET'
  }).then(res => {
    if (res.data.code === 200) {
      if (res.data.data != undefined || res.data.data != null) {
        var envs = [];
        res.data.data.forEach((obj) => {
          envs.push(obj);
        });
        localStorage.setItem("envs", JSON.stringify(envs));
      }
    }
  }).catch(err => {
    console.log(err)
  })
}

export function getEnvNameIndex(name) {
  var index = 0
  var env_list = JSON.parse(localStorage.getItem('envs'))
  if (env_list != null) {
    var resultEnvList = env_list.filter(env => env.selectValue.toUpperCase() === name);
    if (resultEnvList != null && resultEnvList.length > 0) {
      index = resultEnvList[0].selectKey
    } else {
      Message({
        type: 'error',
        message: "加载环境变量数据失败",
        showClose: true,
      })
    }
  }
  return index;
}

//流水线类型
export function getPipeLineType(language) {
  var _type = ""
  if (language == "java") {
    _type = "maven-k8s-pipeline.yml";
  }
  if (language == "python") {
    _type = "python-k8s-pipeline.yml"
  }
  if (language == "nodeJs" || language == "Javascript") {
    _type = "npm-k8s-pipeline.yml"
  }
  return _type;
}

export function GoToPipeline(row, global, router) {
  let tenantId = localStorage.getItem("originTenantId");
  let userID = localStorage.getItem("userName");
  var condition = false;
  //一城一家              //新奥股份             //光迅嘉信息技术有限公司     //数能
  //var allowTenants = ["1379625828887797762", "1384342759875670018", "1384075485780504577", "1387330602944675842"]


  //配置相应的租户进入老流水线
  var enterOldPiplineTenants = ['1369923265280311297']

  console.log(enterOldPiplineTenants.indexOf(tenantId) > -1)

  if (global.app_env === "online" || global.app_env === "pro") {
    if (enterOldPiplineTenants.indexOf(tenantId) > -1) {
      condition = true
    }
  }

  //判断是否是com域名 如果是 .ennew.com 全部走 Jenkins流水线
  if (global.baseUrl.indexOf(".ennew.com") > -1) {
    condition = false;
  }

  pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
  if (row.useLanguage < 6) {
    if (condition) {
      router.push(
        "/cicd/app/build-jenkins/?appId=" + row.id + "&appCode=" + row.code + "&groupIdStr=" + pinyin.getCamelChars(row.groupIdStr).toLowerCase()
      );
    } else {
      router.push(
        "/cicd/app/build-jenkins/?appId=" + row.id + "&appCode=" + row.code + "&groupIdStr=" + pinyin.getCamelChars(row.groupIdStr).toLowerCase()
      );
    }
  } else {
    router.push(
      "/cicd/app/build-mobile/?appId=" + row.id + "&appCode=" + row.code + "&groupIdStr=" + pinyin.getCamelChars(row.groupIdStr).toLowerCase()
    );
  }
}