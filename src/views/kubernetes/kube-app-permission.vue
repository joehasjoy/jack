<template>
  <div>
    <el-card style="margin: 10px">
      <el-card style="margin: 10px 0">
        <!-- 搜索 -->
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" @submit.native.prevent>
          <el-form-item><el-input v-model="formSearch.name" placeholder="名称" @keyup.enter.native="InitGetTableData(url,limit,page)"></el-input></el-form-item>
          <el-form-item><el-input v-model="formSearch.AppCode" placeholder="AppCode" @keyup.enter.native="InitGetTableData(url,limit,page)"></el-input></el-form-item>
<!--          <el-form-item>-->
<!--            <el-select v-model="formSearch.env" filterable placeholder="环境">-->
<!--              <el-option :value="item.name" :label="item.name" v-for="(item, index) in envs" :key="index"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="InitGetTableData(url,limit,page)">查询</el-button>
            <el-button type="primary" @click="showNewRow()">新增</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table border :data="tableData">
        <el-table-column label="名称" prop="name" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="应用" prop="appCode" width="200" :show-overflow-tooltip="true"></el-table-column>
<!--        <el-table-column label="环境" prop="env" width="100"></el-table-column>-->
        <el-table-column label="命名空间" prop="user_list" width="">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.ns_list" :key="index" style="margin: 0 2px" size="small">{{item.ns__name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="终端" prop="" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.terminal" size="small">是</el-tag>
            <el-tag v-else type="danger" size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="授权用户" prop="user_list" width="">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.user_list" :key="index" style="margin: 0 2px" size="small">{{item.users__displayname}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="授权用户组" prop="usergroup_list" width="">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.usergroup_list" :key="index" style="margin: 0 2px" size="small">{{item.user_group__name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showEdit(scope.row)" :plain="true">编辑</el-button>
            <el-button type="danger" size="mini" @click="seletctDelRow(scope.row, url)" :plain="true">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="InitGetTableData(url,limit,page)"></pagination>
      </div>
    </el-card>

    <!-- 新Row -->
    <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" :close-on-click-modal="false" width="700px">
      <el-form size="small" label-width="120px" :model="newRow" ref="newRow" style="margin-left:auto; margin-right:auto;">
        <el-form-item hidden>
          <el-input v-model="newRow.id" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{required:true,message:'请输入名称', trigger: 'blur'}]">
          <el-input v-model="newRow.name" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="应用代号" prop="appCode" :rules="[{required:true,message:'请输入选择appCode', trigger: 'blur'}]">
          <el-select v-model="newRow.appCode" filterable placeholder="appCode" style="width: 320px">
            <el-option :value="item.code" :label="item.code" v-for="(item, index) in apps" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命令空间" prop="ns_list" :rules="[{required:true,message:'请输选择NS', trigger: 'blur'}]">
          <el-select v-model="newRow.ns_list" filterable multiple placeholder="命令空间" style="width: 320px">
            <el-option :value="item.id" :label="item.name+' <'+item.kube__name+'>'" v-for="(item, index) in ns_list" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="env" hidden>
          <el-select v-model="newRow.env" filterable placeholder="环境">
            <el-option :value="item.name" :label="item.name" v-for="(item, index) in envs" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权用户">
          <el-select v-model="newRow.user_list" clearable filterable multiple placeholder="授权用户" style="width: 320px">
            <el-option :value="item.id" :label="item.displayname+'<'+item.username+'>'" v-for="(item, index) in users" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权用户组">
          <el-select v-model="newRow.usergroup_list" clearable filterable multiple placeholder="授权用户组" style="width: 320px">
            <el-option :value="item.id" :label="item.name" v-for="(item, index) in usergroups" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端">
          <el-switch v-model="newRow.terminal"></el-switch>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" plain="plain" @click="newPutRow(url, 'POST')" v-if="!newRow.id">确 定</el-button>
          <el-button type="warning" plain="plain" @click="newPutRow(url, 'PUT')" v-if="newRow.id">更 新</el-button>
          <el-button @click="dialognewRowForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog >
  </div>

</template>

<script>
  import pagination from '@/components/Pagination/pagination'
  export default {
    name: 'kube-app-permission',
    data(){
      return {
        newRow: {user_list: [], usergroup_list: [], appCode: '', env: '', terminal: false, name: '', ns_list: []},
        newTitle: '新增',
        dialognewRowForm: false,
        formSearch: {appCode: '', env: ''},
        loading: false,
        tableData: [],
        limit: 10,
        page: 1,
        total: 0,
        url: this.GLOBAL.service_tag+'/api/kubernetes/app-permission/',
        envs: [],
        users: [],
        apps: [],
        usergroups: [],
        ns_list: [],
      }
    },
    watch: {},
    methods:{

      seletctDelRow: function(row, url) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delTgt(url, row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      delTgt: function(url,row){
        this.loading = true
        let parms = {rows: [row.id]}
        this.axios({
          method: 'DELETE',
          url: url,
          data: parms,
        }).then((response)=>{
          if(response.data.status){
            this.$notify.success(response.data.message)
            this.InitGetTableData(this.url, this.limit, this.page)
          }else {this.$notify.error(response.data.error)}
          this.loading = false
        }).catch((response) => {
          this.loading = false
          this.$notify.error(String(response));
        });
      },

      // 获取表格数据；
      InitGetTableData: function(url, page_size, page_index) {
        this.loading = true
        const parms = {"pageSize": page_size, "pageNumber": page_index, 'appCode': this.formSearch.AppCode,'name': this.formSearch.name, 'env': this.formSearch.env}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('aaa:',response.data);
          if(response.data.status){
            this.tableData = response.data.data
            this.total = response.data.total
            this.envs = response.data.envs
            this.users = response.data.users
            this.usergroups = response.data.usergroups
            this.apps = response.data.apps
            this.ns_list = response.data.ns_list
          }else {this.$notify.error(response.data.error)}
          this.loading = false
        }).catch((response) => {
          this.loading = false
          this.$notify.error(String(response));
        });
      },

      newPutRow: function(url, method){
        this.$refs.newRow.validate(valid =>{
          if(valid){
            let parms = JSON.parse(JSON.stringify(this.newRow))
            if(method==="POST"){delete parms.id}
            this.axios({
              method: method,
              url: url,
              data: parms,
            }).then((response)=>{
              // console.log('delAppResourceRow:',response.data);
              if(response.data.status){
                this.dialognewRowForm=false
                this.$notify.success(response.data.message)
                this.InitGetTableData(this.url, this.limit, this.page)
              }else {this.$notify.error(response.data.error)}
            }).catch((response) => {
              this.$notify.error(String(response));
            });
          }
          else {this.$message.warning('请输入合法数据')}
        })
      },

      showEdit: function(row) {
        this.dialognewRowForm = true
        this.newTitle = '编辑'
        this.newRow.id = row.id
        this.newRow.appCode = row.appCode
        this.newRow.env = row.env
        this.newRow.name = row.name
        if(row.user_list){var tgts=row.user_list.map(function(val) {
          return Number(val.users__id)})}else {tgts = ''}
        if(row.usergroup_list){var groups=row.usergroup_list.map(function(val) {
          return Number(val.user_group__id)})}else {groups = ''}
        if(row.ns_list){var nss=row.ns_list.map(function(val) {
          return Number(val.ns__id)})}else {nss = ''}
        this.newRow.user_list = tgts
        this.newRow.usergroup_list = groups
        this.newRow.ns_list = nss
        this.newRow.terminal = row.terminal
      },

      showNewRow: function() {
        this.dialognewRowForm = true
        this.newTitle = '新增'
        this.newRow.id = ''
        this.newRow.appCode = ''
        this.newRow.env = ''
        this.newRow.name = ''
        this.newRow.user_list = []
        this.newRow.usergroup_list = []
        this.newRow.ns_list = []
        this.newRow.terminal = false
      },
    },

    computed: {},
    mounted () {
      this.InitGetTableData(this.url, this.limit, this.page)
    },
    components: {
      pagination: pagination,
    }

  }
</script>

<style scoped>

</style>
