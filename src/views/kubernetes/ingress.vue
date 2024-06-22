<template>

    <el-card style="margin: 10px">
      集群
      <el-select v-model="$store.state.kube.env_id" filterable placeholder="集群" style="width: 160px" @change="ChangeKubeCluster">
        <el-option :label="item.name" :value="item.id" v-for="(item,index) in $store.state.kube.env_list" :key="index"></el-option>
      </el-select>
      命名空间
      <el-select v-model="$store.state.kube.ns_id" filterable placeholder="命名空间" style="width: 240px" @change="ChangeNS">
        <el-option :label="item.name" :value="item.id" v-for="(item,index) in $store.state.kube.ns_list" :key="index"></el-option>
      </el-select>
      <el-button type="primary" @click="showNewRow">新增</el-button>
      <el-button type="danger" @click="deleteSelectItems">批量删除</el-button>

      <el-input v-model="search" placeholder="请输入搜索内容" style="width: 300px;float: right"></el-input>
      <el-button style="float: right" @click="ChangeNS()">刷新</el-button>

      <el-table id="out-table" v-loading="$store.state.kube.loading" ref="table"
        :data="tables.slice((page-1)*limit,page*limit)" border
        style="width: 100%;margin-top: 10px;">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" :index="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" width="240">
          <template slot-scope="scope">
            <a @click="colClick(scope.row, 'event')">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column sortable label="端点" prop="" width="160">
          <template slot-scope="scope">
            <div v-for="(item) in scope.row.detail.status.loadBalancer.ingress">{{item.ip}}</div>
          </template>
        </el-table-column>
        <el-table-column sortable label="规则" prop="">
          <template slot-scope="scope">
            <div v-for="(item) in scope.row.detail.spec.rules">
              <div v-for="(backend) in item.http.paths">{{item.host}}{{backend.path}} -> {{backend.backend.serviceName}}</div>
            </div>
          </template>
        </el-table-column>

<!--        <el-table-column sortable label="命令空间" prop="namespace" width="200"></el-table-column>-->
        <el-table-column sortable label="创建时间" prop="creation_timestamp" align="center" width="160"></el-table-column>
        <el-table-column sortable label="操作" prop="" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="colClick(scope.row, 'event')">详细</el-button>
            <el-dropdown size="small" trigger="click" @command="handleCommand">
              <el-button type="primary" size="mini" :plain="true">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{'action': 'edit', 'row': scope.row}">编辑YAML</el-dropdown-item>
                <el-dropdown-item :command="{'action': 'delete', 'row': scope.row}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <pagination :total="total" :page.sync="page" :limit.sync="limit"></pagination>
      </div>

<!--      <editor v-model="content" @init="editorInit" lang="yaml" theme="monokai"  width="800" height="300px"></editor>-->
      <!-- 编辑目标 -->
      <el-dialog title="编辑" :visible.sync="dialognTgt" top="30px" width="798px" :close-on-click-modal="false">
        <editor v-model="content" @init="common.editorInit" lang="yaml" theme="merbivore"  width="100%" height="500"></editor>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="common.saveShareContent(content, tempTgtData.metadata.name+'.yaml')">下 载</el-button>
          <el-button type="warning" plain="plain" @click="UpdateTgt('PUT')">更 新</el-button>
          <el-button @click="dialognTgt = false">取 消</el-button>
        </div>
      </el-dialog >

      <!-- NewRow -->
      <el-dialog title="添加" :visible.sync="dialogNewTgt" top="30px" width="798px" :close-on-click-modal="false">
        <editor v-model="content" @init="common.editorInit" lang="yaml" theme="merbivore"  width="100%" height="500"></editor>
        <div slot="footer" class="dialog-footer">
          <!--          <el-button type="primary" plain="plain" @click="common.saveShareContent(content, tempTgtData.metadata.name+'.yaml')">下 载</el-button>-->
          <el-button type="primary" @click="UpdateTgt('POST')">添加</el-button>
          <el-button @click="dialogNewTgt = false">取 消</el-button>
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
        dialogNewTgt: false,
        dialognTgt: false,
        tableData: [],
        url: this.GLOBAL.service_tag+'/api/kubernetes/ingress/',
        ns_url: this.GLOBAL.service_tag+'/api/kubernetes/namespace/',
        event_url: this.GLOBAL.service_tag+'/api/kubernetes/event/',
        limit: 10,
        page: 1,
        total: 0,
        search: '',
        content: '',
        tempTgtData: {},
        tableDataEvents: [],
        dialognTgtEvent: false,
      }
    },
    components: {
      editor: require('vue2-ace-editor'),
      pagination: pagination,
    },
    methods: {
      index(val){
        // console.log('index:', val, this.currentPage, this.pageSize)
        return (this.page - 1)*this.limit + val + 1
      },
      // 跳转详细
      colClick: function(row, activeName){
        // console.log('row, column, cell, event', row)
        // this.$router.push('/kubernetes/deployment-detail.html?name='+row.name+'&namespace='+row.namespace+'&env='+this.$store.state.kube.env_id+'&activeName='+activeName)
      },

      showNewRow: function(){
        this.dialogNewTgt = true
        this.content = ''
      },

      // 操作、更多动作
      handleCommand: function(command){
        // console.log('handleCommand:', command)
        if(command.action==='edit'){
          this.GetTgtData(this.url,command.row)
          this.tempTgtData = command.row.detail
          // console.log("tempTgtData:", this.tempTgtData)
          this.dialognTgt = true
        }else if(command.action==='delete'){
          this.$confirm('将删除该目标, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.DelTgtData(this.url,[command.row])
            // this.$message({ type: 'success', message: '删除成功!' });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }

      },

      // 编辑/获取目标信息
      GetTgtData: function(url,row) {

        let parms = {"env": this.$store.state.kube.env_id, "namespace": row.detail.metadata.namespace, "name": row.name}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.content = YAML.stringify(response.data.rows)
            // this.content = response.data.data
          }else {this.$message.error({message: response.data.error})}

        }).catch((response) => {
          this.$message.error({message: String(response)});

        });
      },

      // 更新编辑目标
      UpdateTgt: function(method){
        let data_json;
        try {
          data_json =YAML.parse(this.content, {})
        }
        catch(err){
          this.$message.error({message: String(err)})
          // console.log('error:', err)
          return
        }
        let parms = {"env": this.$store.state.kube.env_id, "namespace":data_json.metadata.namespace,
          "name": data_json.metadata.name, "action": "replace", "body": data_json}
        // console.log('data_json:', parms)
        this.axios({
          method: method,
          url: this.url,
          data: parms,
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            // this.content = response.data.data
            this.ChangeNS()
            this.$message.success({message: response.data.message})
            this.dialognTgt = false
            this.dialogNewTgt = false
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
      },

      // 编辑/获取目标信息
      DelTgtData: function(url,rows) {
        let parms = []
        for(let i=0;i<rows.length;++i){
          parms.push({"env": this.$store.state.kube.env_id, "namespace": rows[i].detail.metadata.namespace, "name": rows[i].detail.metadata.name})
        }
        this.axios({
          method: 'DELETE',
          url: url,
          data: parms,
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.$message.success({message: response.data.message})
            this.ChangeNS()
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
      },

      // 批量删除
      deleteSelectItems: function(){
        const _selectData = this.$refs.table.selection
        // console.log(_selectData);
        if(_selectData.length>0){
          this.$confirm('将删除该目标, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.DelTgtData(this.url,_selectData)
          }).catch(() => {this.$message({ type: 'info', message: '已取消删除' });});
        }
      },

      // 查看相关联的Events
      GetTgtEvent: function(url, row, kind) {
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
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
      },

      ChangeKubeCluster: function(){
        this.$store.dispatch('getKubeNS', {'url': this.url}).then(response=>{
          this.tableData = response.data.rows
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },
      ChangeNS: function(){
        this.$store.dispatch('getKubeTable', {'url': this.url}).then(response=>{
          this.tableData = response.data.rows
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },
    },


    mounted () {
      // this.initGetEnv(this.ns_url)
      this.$store.dispatch('getKubeEnv', {'url': this.url}).then(response=>{
        this.tableData = response.data.rows
        // console.log('rows:', this.tableData)
      }).catch(error => {
        this.$message.error({message: String(error)});
      });

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
