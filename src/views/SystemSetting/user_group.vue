<template>
    <div>
      <el-card style="margin: 10px">
        <!-- 搜索 -->
        <el-card style="margin: 5px 0">
          <el-form :inline="true" :model="formSearch" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label=""><el-input v-model="formSearch.name" placeholder="用户组名" @keyup.enter.native="GetTableList"></el-input></el-form-item>
            <el-form-item>
              <el-select v-model="formSearch.username" clearable filterable placeholder="用户" @change="GetTableList">
                <el-option :value="item.username" :label="item.label" v-for="(item, index) in global_dict.users_choices_list" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formSearch.role" placeholder="角色" filterable clearable>
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in roles" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="GetTableList">查询</el-button>
              <el-button type="primary" @click="showNew">新增</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-table :data="tableData" border v-loading="loading">
          <el-table-column label="名称" prop="name" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="描述" prop="description" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="角色" prop="" >
            <template slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.roles_list" :key="index" size="mini" style="margin-left: 5px">{{item.title}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="用户" prop="">
            <template slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.users_list" :key="index" size="mini" style="margin-left: 5px">{{item.displayname}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column sortable label="操作" prop="" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="warning"  size="mini" @click="showEdit(scope.row)" :plain="true" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger"  size="mini" @click="seletctDelTgt(scope.row)" :plain="true" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="GetTableList"></pagination>
        </div>
      </el-card>
      <!-- 新Row -->
      <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" :close-on-click-modal="false">
        <el-form size="mini" label-width="120px" :rules="newRules" :model="newRow" ref="newRow">
          <el-form-item hidden>
            <el-input v-model="newRow.id" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="组名" prop="name" :rules="[{required:true,message:'请输入组名.', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model="newRow.name" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input style="width: 340px" v-model="newRow.description" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="">
            <el-select v-model="newRow.roles_list" placeholder="角色" filterable multiple>
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in roles" :key="index"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户">
<!--            :button-texts="['到左边', '到右边']"-->
            <el-transfer
              filterable
              :titles="['可选', '已选']"
              filter-placeholder="输入搜索内容"
              v-model="newRow.users_list"
              :props="{key: 'id',label: 'label'}"
              :data="global_dict.users_choices_list">
            </el-transfer>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="AddNewRow" v-if="!newRow.id">确 定</el-button>
          <el-button type="warning" plain="plain" @click="editRow" v-if="newRow.id">更 新</el-button>
          <el-button @click="dialognewRowForm = false">取 消</el-button>
        </div>
      </el-dialog >


    </div>
</template>

<script>
  import Table from '@/components/tableTemp'
  import pagination from '@/components/Pagination/pagination'
  export default {
    name: 'user_manage',
    props: {},

    data() {

      return {
        loading: false,
        formSearch: {},
        roles: [],
        newRules: {
          display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
        },
        newRow: {"users_list": [], 'name': '', 'description':　'', 'roles_list': []},
        global_dict: {},
        dialognewRowForm: false,
        newTitle: '新建用户组',
        options: {
          stripe: true, // 是否为斑马纹 table
          loading: false, // 是否添加表格loading加载动画
          highlightCurrentRow: true, // 是否支持当前行高亮显示
          mutiSelect: true, // 是否支持列表项选中功能
        }, // table 的参数
        tableData: [],

        total: 0,
        page: 1,
        limit: 10,
        url: this.GLOBAL.service_tag+'/api/system-setting/user-group/',

      }
    },
    created: function(){},
    watch: {},
    methods: {
      GetTableList: function(val) {
        // console.log("GetTableList3333:", this.page, this.limit, val)
        this.InitGetTableData(this.url, this.limit, this.page)
      },

      // 获取表格数据；
      InitGetTableData: function(url,page_size, page_index, conn) {
        this.loading = true
        const parms = {"pageSize": page_size, "pageNumber": page_index,'name': this.formSearch.name,
          'username': this.formSearch.username,'role_title': this.formSearch.role,}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('aaa:',response.data);
          if(response.data.status){
            this.tableData = response.data.data
            this.total = response.data.total
            this.roles = response.data.roles_choices_list
            this.global_dict = response.data.global_dict
          }else {this.$message.error({message: response.data.error})}
          this.loading = false
        }).catch((response) => {
          this.loading = false
            this.$message.error({message: 'GetTableData Error: '+ JSON.stringify(response)});
        });
      },

      // 新增数据
      AddNewRow: function() {
        // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
        if(!this.newRow.name){this.$message.warning('请输入必填项.'); return}
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        const row = JSON.parse(JSON.stringify(this.newRow))
        delete row['id']
        this.axios({
          method: 'POST',
          url: this.url,
          data: row,
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.dialognewRowForm = false;
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$message.success({message: response.data.message})
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'}).close()
      },

      // 编辑选中数据
      editRow: function() {
        // console.log('rowedit:', row, row.roles_id_list.split(','))
        if(!this.newRow.name){this.$message.warning('请输入必填项.'); return}
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        // const update_list = JSON.parse(JSON.stringify(this.newRow))
        // delete update_list.users_list
        // console.log("users_list:", users_list)
        this.axios({
          method: 'PUT',
          url: this.url,
          // data: this.qs.stringify({'update_list': JSON.stringify([update_list]),
          //   "update_ManyToMany": JSON.stringify([{'id':this.newRow.id, 'newM2M': this.newRow.users_list}])}),
          data: this.newRow,
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$message.success({message: response.data.message})
            this.dialognewRowForm = false;
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
        this.Loading.service().close()
      },

      // 删除选中数据
      deleteRow: function(row) {
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        this.axios({
          method: 'DELETE',
          url: this.url,
          data: [row.id],
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$message.success({message: response.data.message})
          }else {this.$message.error({message: 'deleteRow Error: '+ response.data.error})}
        }).catch((response) => {
          this.$message.error({message: 'deleteRow Error: '+ response});
        });
        this.Loading.service().close()
      },

      //提示删除确认动作app Resource
      seletctDelTgt: function(row,){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRow(row)
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });

      },

      showNew: function() {
        this.dialognewRowForm = true;
        this.newTitle='新建用户组';
        this.newRow.id=''
        this.newRow.name=''
        this.newRow.users_list=[]
        this.newRow.roles_list=[]
        this.newRow.description=''
      },

      showEdit: function(row) {
        this.dialognewRowForm = true;
        this.newTitle='编辑用户组';
        this.newRow.id=row.id
        this.newRow.name=row.name
        if(row.users_list){var temp_users=row.users_list.map(function(val) {
          return val.id})}else {temp_users = []}
        if(row.roles_list){var temp_roles=row.roles_list.map(function(val) {
          return val.id})}else {temp_roles = []}
        this.newRow.users_list=temp_users
        this.newRow.roles_list=temp_roles
        this.newRow.description=row.description
      },
    },

    computed: {},
    mounted () {
      this.InitGetTableData(this.url, this.limit, this.page)
    },
    components: {
      'table-box': Table,
      'pagination': pagination,
    }

  }
</script>

<style scoped>

</style>
