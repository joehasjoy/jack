import axios from 'axios'
import store from '../store'
import NProgress from 'nprogress' // Progress 进度条
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
Vue.use(ElementUI)

function initGetEnv2(url) {
  NProgress.start()
  const parms = {"init": true}
  axios({
    method: 'GET',
    url: url,
    params: parms,
  }).then((response)=>{
    // console.log('aaa:',response.data);
    if(response.data.status){
      // env_list = response.data.data
      // if(response.data.data.length>=1){
        // env_id=response.data.data[0]['id'];
        // initGetNS2(ns_url, env_id)
      // }
    }
    else {this.$notify.error({message: response.data.error})}
    NProgress.done();
  }).catch((response) => {
    this.$notify.error({message: String(response)});
    NProgress.done();
  });
}

function initGetNS2(url, env) {
  NProgress.start()
  const parms = {"env": env}  // env_id
  axios({
    method: 'GET',
    url: url,
    params: parms,
  }).then((response)=>{
    //console.log('aaa:',response.data);
    if(response.data.status){
      // ns_list = response.data.data
      // if(ns_list.length>=1){
      //   ns_id=ns_list[0]['id']
      //   InitGetTableData2(url)
      // }
    }
    // else {$notify.error({message: response.data.error})}
    NProgress.done();
  }).catch((response) => {
    // $notify.error({message: JSON.stringify(response)});
    NProgress.done();
  });
}

// 获取表格数据；
function InitGetTableData2(url) {
  NProgress.start()
  const parms = {"env": $store.state.kube.env_id, "namespace": $store.state.kube.ns_id}
  // console.log('parms:', parms)
  axios({
    method: 'GET',
    url: url,
    params: parms,
  }).then((response)=>{
    // console.log('InitGetTableData:',response.data);
    if(response.data.status){
      // tableData = response.data.rows
    }
      else {this.$notify.error({message: response.data.error})}
    NProgress.done();
  }).catch((response) => {
    this.$notify.error({message: String(response)});
    NProgress.done();
  });
}

// 生成yaml编辑页面
function editorInit2(editor) {
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


// 编辑/获取目标信息
function GetTgtData(url,row) {
  this.NProgress.start()
  const parms = {"env": this.$store.state.kube.env_id, "namespace": row.detail.metadata.namespace, "name": row.name}
  this.axios({
    method: 'GET',
    url: url,
    params: parms,
  }).then((response)=>{
    //console.log('GetTgtData:',response.data, name);
    if(response.data.status){
      this.content = YAML.stringify(response.data.rows)
      // this.content = response.data.data
    }else {this.$notify.error({message: response.data.error})}
    this.NProgress.done();
  }).catch((response) => {
    this.$notify.error({message: JSON.stringify(response)});
    this.NProgress.done();
  });
}

export default {
  editorInit2,
  GetTgtData,
}
