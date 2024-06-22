<template>
  <div>
    <el-card style="margin: 10px">
      <el-card style="margin: 10px 0">
        <!-- 搜索 -->
        <el-form :inline="true" :model="formSearch" class="demo-form-inline">
          <el-form-item><el-input v-model="formSearch.name" placeholder="名称" @keyup.enter.native="InitGetTableData(url,limit,page)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="InitGetTableData(url,limit,page)">查询</el-button>
            <el-button type="primary" @click="showNewRow">新增</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table border :data="tableData">
        <el-table-column label="名称" prop="name" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="内容" prop="content" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="创建时间" prop="ctime" width="190"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showEdit(scope.row)" :plain="true">编辑</el-button>
            <el-button type="danger" size="mini" @click="seletctDelRow(url,scope.row)" :plain="true">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="InitGetTableData(url,limit,page)"></pagination>
      </div>
    </el-card>

    <!-- 新Row -->
    <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" :close-on-click-modal="false" width="998px">
      <el-form size="mini" label-width="120px" :model="newRow" ref="newRow" style="margin-left:auto; margin-right:auto;">
        <el-form-item hidden>
          <el-input v-model="newRow.id" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{required:true,message:'请输入名称', trigger: 'blur'}]">
          <el-input v-model="newRow.name" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :rules="[{required:true,message:'请输入内容', trigger: 'blur'}]">
          <editor v-model="newRow.content" @init="common.editorInit" lang="yaml" theme="merbivore"  width="100%" height="500"></editor>
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
  import YAML from 'yaml'
  export default {
    name: 'kube-template',
    data(){
      return{
        newRow: {name: '', id: '', content: ''},
        newTitle: '新增',
        dialognewRowForm: false,
        formSearch: {name: ''},
        loading: false,
        tableData: [],
        limit: 10,
        page: 1,
        total: 0,
        url: this.GLOBAL.service_tag+'/api/ams/app-kubernetes-template/',
      }
    },

    methods: {
      // 获取表格数据；
      InitGetTableData: function(url, page_size, page_index) {
        this.loading = true
        const parms = {"pageSize": page_size, "pageNumber": page_index, 'name': this.formSearch.name}
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
          }else {this.$notify.error(response.data.error)}
          this.loading = false
        }).catch((response) => {
          this.loading = false
          this.$notify.error(String(response));
        });
      },

      seletctDelRow: function(url,row) {
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

      showNewRow: function() {
        this.dialognewRowForm = true
        this.newTitle = '新增'
        this.newRow.id = ''
        this.newRow.name = ''
        this.newRow.content = ''
      },

      showEdit: function(row) {
        this.dialognewRowForm = true
        this.newTitle = '编辑'
        this.newRow.id = row.id
        this.newRow.name = row.name
        this.newRow.content = row.content
      },

    },

    computed: {},

    mounted () {
      this.InitGetTableData(this.url, this.limit, this.page)
    },
    components: {
      pagination: pagination,
      editor: require('vue2-ace-editor'),
    }
  }
</script>

<style scoped>

</style>
