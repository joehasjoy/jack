<template>

    <el-card style="margin: 10px">
      集群
      <el-select v-model="$store.state.kube.env_id" filterable placeholder="集群" style="width: 160px" @change="ChangeKubeCluster">
        <el-option :label="item.name" :value="item.id" v-for="(item,index) in $store.state.kube.env_list" :key="index"></el-option>
      </el-select>
      <el-button style="margin-right: 5px" type="primary" @click="NsSyncDB(url)" :plain="true">NS同步到DB</el-button>

      <el-input v-model="search" placeholder="请输入搜索内容" style="width: 300px;float: right"></el-input>
      <el-button style="float: right;margin-right: 5px" type="primary" @click="dialognTgtNew=true">创建</el-button>
      <el-button style="float: right;margin-right: 5px" @click="ChangeKubeCluster">刷新</el-button>

      <el-table id="out-table" v-loading="$store.state.kube.loading"
        :data="tables.slice((page-1)*limit,page*limit)"
        style="width: 100%;margin-top: 10px;border: 1px solid #EBEEF5">
        <el-table-column label="名称" prop="name" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column sortable label="标签" prop="">
          <template slot-scope="scope">
            <el-tag size="mini" type="info" effect="dark" v-for="(item, key) in scope.row.detail.metadata.labels" :key="key" style="margin-right: 5px">{{key}}:{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable label="状态" prop="status" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.status==='Active'"><span style="color: rgb(51, 203, 1)">{{scope.row.status}}</span></template>
            <template v-else><span style="color: red">{{scope.row.status}}</span></template>
          </template>
        </el-table-column>
        <el-table-column sortable label="创建时间" prop="creation_timestamp" width="200"></el-table-column>
        <el-table-column sortable label="操作" prop="" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="GetTgtData(url,scope.row)" type="warning" :plain="true">编辑</el-button>
            <el-button size="mini" @click="DelTgtData(url,scope.row)" type="danger" :plain="true">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <pagination :total="total" :page.sync="page" :limit.sync="limit"></pagination>
      </div>

<!--      <editor v-model="content" @init="editorInit" lang="yaml" theme="monokai"  width="800" height="300px"></editor>-->
      <!-- 编辑目标 -->
      <el-dialog title="编辑" :visible.sync="dialognTgt" top="30px" width="798px" :close-on-click-modal="false">
        <editor v-model="content" @init="editorInit" lang="yaml" theme="merbivore"  width="100%" height="500"></editor>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="common.saveShareContent(content, tempTgtData.metadata.name+'.yaml')">下 载</el-button>
          <el-button type="warning" plain="plain" @click="UpdateTgt(url)">更 新</el-button>
          <el-button @click="dialognTgt = false">取 消</el-button>
        </div>
      </el-dialog >

      <el-dialog title="事件" :visible.sync="dialognTgtEvent" top="60px" width="70%" :close-on-click-modal="false">
        <el-table :data="tableDataEvents" style="width: 100%" size="mini">
          <el-table-column prop="type" label="类型" width="120"></el-table-column>
          <el-table-column prop="reason" label="原因" width="140px"></el-table-column>
          <el-table-column prop="creation_timestamp" label="时间" width="180"></el-table-column>
          <el-table-column prop="from" label="来自" :show-overflow-tooltip="true" width="300px"></el-table-column>
          <!--              <el-table-column prop="involvedObject" label="对象" :show-overflow-tooltip="true" width="300px"></el-table-column>-->
          <el-table-column prop="message" label="信息"></el-table-column>
        </el-table>
      </el-dialog >

      <el-dialog title="创建" :visible.sync="dialognTgtNew" top="60px" width="600px" :close-on-click-modal="false">
        <el-form ref="formNew" :model="formNew" label-width="80px" size="mini" :rules="formNewRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formNew.name"></el-input>
            <span style="color: #999;font-size: 12px">长度为 1-63 个字符，只能包含数字、小写字母、和“-”，且首尾只能是字母或数字</span>
          </el-form-item>
          <el-form-item label="标签">
            <el-button icon="el-icon-plus" @click="addLabel">添加</el-button>
            <table style="background: #FFF;font-size: 12px;border-top: 1px solid #E1E6EB;margin-top: 8px;border: 1px solid #E1E6EB;width: 100%;margin-bottom: 20px">
              <tbody>
              <tr>
                <td style="width: 30%;text-align: left">变量名称</td>
                <td style="text-align: left">变量值</td>
                <td style="width: 100px;text-align: center">操作</td>
              </tr>
              <tr v-for="(value,key) in label_list" :key="key">
                <td><el-input v-model="value.k" placeholder="名称"></el-input></td>
                <td><el-input v-model="value.v" placeholder="值"></el-input></td>
                <td style="text-align: center"><el-button type="danger" :plain="true" @click="delLabel(value.flag)">删除</el-button></td>
              </tr>
              </tbody>
            </table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="createTgt(url)">确 定</el-button>
          <el-button @click="dialognTgtNew = false">取 消</el-button>
        </div>
      </el-dialog >
    </el-card>

</template>

<script>

  // import kube from '../../api/kubernetes.js'
  import pagination from '@/components/Pagination/pagination'
  import YAML from 'yaml'

  export default {
    name: 'Service',
    data() {
      return {
        formNewRules: {
          name: [
            {required: true,message: "请输入内容",trigger: "blur"},
            { pattern: /^[a-z0-9\-]+$/, message: "请输入有效格式" }
          ],
        },
        flag: 0,
        label_list: [{'k': '', 'v': '', "flag": 0}],
        formNew: {'name': '', labels: {}},
        dialognTgtNew: false,
        dialognTgt: false,
        tableData: [],
        url: this.GLOBAL.service_tag+'/api/kubernetes/namespace/',
        ns_url: this.GLOBAL.service_tag+'/api/kubernetes/namespace/',
        event_url: this.GLOBAL.service_tag+'/api/kubernetes/event/',
        limit: 10,
        page: 1,
        total: 0,
        search: '',
        content: '',
        tableDataEvents: [],
        dialognTgtEvent: false,
      }
    },
    components: {
      editor: require('vue2-ace-editor'),
      pagination: pagination,
    },
    methods: {

      addLabel: function(){
        this.label_list.push({"k": '', "v": "", "flag": ++this.flag})
      },

      delLabel: function(flag){
        for(let i=0;i<this.label_list.length;i++){
          if(flag===this.label_list[i]['flag']){
            delete this.label_list.splice(i,1)
          }
        }
      },

      // 生成yaml编辑页面
      editorInit: function (editor) {
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
      },

      NsSyncDB: function(url) {
        // console.log('row:', row)
        this.NProgress.start()
        let parms = {"env": this.$store.state.kube.env_id, 'sync': true}
        this.axios({
          method: 'POST',
          url: url,
          data: this.qs.stringify(parms),
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.$notify.success(response.data.message)
          }else {this.$notify.error(response.data.error)}
          this.NProgress.done();
        }).catch((response) => {
          this.$notify.error(String(response));
          this.NProgress.done();
        });
      },

      // 创建目标
      createTgt: function(url){
        this.$refs.formNew.validate(valid =>{
          if(valid){
            let ls= this.label_list;
            for(let i=0;i<ls.length;i++){
              if(ls[i].k){
                this.formNew.labels[ls[i].k] =ls[i].v
              }else if(!ls[i].k && ls[i].v){this.$message.warning('当值存在时，变量名称不能为空！');return}
            }
            let parms = {"row": JSON.stringify({"metadata": this.formNew}), 'env': this.$store.state.kube.env_id}
            this.NProgress.start();
            this.axios({
              method: 'POST',
              url: url,
              data: this.qs.stringify(parms),
            }).then((response)=>{
              // console.log('NewTgtData:',response.data, );
              if(response.data.status){
                this.dialognTgtNew = false
                this.$store.dispatch('getKubeTableNoNS', {url:this.url}).then(response=>{
                  this.tableData = response.data.rows
                }).catch(error => {this.$notify.error({message: String(error)});});
                this.$notify.success(response.data.message)
              }else {this.$notify.error(response.data.error)}
              this.NProgress.done();
            }).catch((response) => {
              this.$notify.error(String(response));
              this.NProgress.done();
            });
          }else {this.$message.warning('请输入合法数据')}
        })
      },

      // 获取目标信息
      GetTgtData: function(url,row) {
        // console.log('row:', row)
        this.NProgress.start()
        let parms = {"env": this.$store.state.kube.env_id, "name": row.name}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.content = YAML.stringify(response.data.rows)
            // this.content = response.data.data
            this.dialognTgt = true
          }else {this.$notify.error(response.data.error)}
          this.NProgress.done();
        }).catch((response) => {
          this.$notify.error(String(response));
          this.NProgress.done();
        });
      },

      // 更新编辑目标
      UpdateTgt: function(url){
        this.NProgress.start()
        let data_json;
        try {
          data_json =YAML.parse(this.content, {})
        }
        catch(err){
          this.$notify.error({message: String(err)})
          // console.log('error:', err)
          return
        }
        let parms = {"env": this.$store.state.kube.env_id, "name": data_json.metadata.name, "action": "replace", "body": data_json}
        // console.log('data_json:', parms)
        this.axios({
          method: 'PUT',
          url: url,
          data: this.qs.stringify({'row':JSON.stringify(parms)}),
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.$store.dispatch('getKubeTableNoNS', {url:this.url}).then(response=>{
              this.tableData = response.data.rows
            }).catch(error => {this.$notify.error({message: String(error)});});
            this.$notify.success({message: response.data.message})
            this.dialognTgt = false
          }else {this.$notify.error({message: response.data.error})}
          this.NProgress.done();
        }).catch((response) => {
          this.$notify.error({message: String(response)});
          this.NProgress.done();
        });
        // this.NProgress.done();
      },

      // 编辑/获取目标信息
      DelTgtData: function(url,row) {
        this.NProgress.start()
        let parms = {"env": this.$store.state.kube.env_id, "name": row.detail.metadata.name}
        this.$confirm('将删除该目标, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.axios({
            method: 'DELETE',
            url: url,
            data: this.qs.stringify({'match':JSON.stringify(parms)}),
          }).then((response)=>{
            //console.log('GetTgtData:',response.data, name);
            if(response.data.status){
              this.$notify.success({message: response.data.message})
              this.$store.dispatch('getKubeTableNoNS', {url:this.url}).then(response=>{
                this.tableData = response.data.rows
              }).catch(error => {this.$notify.error({message: String(error)});});
            }else {this.$notify.error({message: response.data.error})}
            this.NProgress.done();
          }).catch((response) => {
            this.$notify.error({message: String(response)});
            this.NProgress.done();
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      // 查看相关联的Events
      GetTgtEvent: function(url, row, kind) {
        this.NProgress.start()
        let field_selector = "involvedObject.kind="+kind+",involvedObject.name="+row.detail.metadata.name;
        this.axios({
          method: 'GET',
          url: url,
          params: {'env': this.$store.state.kube.env_id, "namespace": row.detail.metadata.namespace,"field_selector":field_selector},
        }).then((response)=>{
          // console.log('GetTgtEvent:',response.data,);
          if(response.data.status){
            this.tableDataEvents = response.data.rows
            this.dialognTgtEvent = true
          }else {this.$notify.error({message: response.data.error})}
          this.NProgress.done();
        }).catch((response) => {
          this.$notify.error({message: String(response)});
          this.NProgress.done();
        });
      },

      ChangeKubeCluster: function(){
        this.$store.dispatch('getKubeEnvNoNS', {url:this.url}).then(response=>{
          this.tableData = response.data.rows
        }).catch(error => {
          this.$notify.error({message: String(error)});
        });
      },
    },


    mounted () {
      // this.getInitTable(this.url)
      this.ChangeKubeCluster()
    },
    computed: {
      // 前端过滤
      tables () {
        // console.log("time_range:", this.time_range)
        const search = this.search
        if (search) {
          return this.tableData.filter(dataNews => {
            return Object.keys(dataNews).some(key => {
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData
      },

    },
    watch: {
      // 检测表格数据过滤变化，自动跳到第一页
      tables () {
        this.page = 1
        this.total = this.tables.length
      }
    }
  }
</script>

<style>

</style>
