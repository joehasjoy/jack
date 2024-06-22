<template>
    <div style="padding: 10px 10px 0 10px">
      <el-card style="margin: 10px">
        <!-- 搜索 -->
        <el-card style="margin: 5px 0">
          <el-form :inline="true" :model="formSearch" class="demo-form-inline">
            <el-form-item label=""><el-input v-model="formSearch.username" placeholder="用户名" @keyup.enter.native="GetTableList"></el-input></el-form-item>
            <el-form-item label=""><el-input v-model="formSearch.displayname" placeholder="显示名" @keyup.enter.native="GetTableList"></el-input></el-form-item>
            <el-form-item label="">
              <el-select v-model="formSearch.user_type_id" filterable clearable placeholder="用户类型" @change="GetTableList">
                <el-option label="本地" value="1"></el-option>
                <el-option label="LDAP" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formSearch.role" placeholder="角色" filterable clearable @change="GetTableList">
                <el-option :label="item.label" :value="item.label" v-for="(item, index) in roles_list" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="GetTableList">查询</el-button>
              <el-button type="primary" @click="dialognewRowForm = true">新增</el-button>
              <el-button type="primary" @click="syncLDAP" :loading="sync_loading">AD同步</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <div style="width: 100%">
          <!-- 表格 -->
          <table-box :tableData="tableData" :tableKey="tableKey" options="options" :total="total" v-loading="loading"
                     :page.sync="page" :limit.sync="limit" :operates="operates"  @pagination="GetTableList">
          </table-box>
        </div>
      </el-card>


      <!-- 新建Row -->
      <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" :close-on-click-modal="false">
        <el-form size="mini" label-width="120px" :rules="newRules" :model="newRow" ref="newRow">
          <el-form-item label="显示名" prop="display_name">
            <el-input autocomplete="off" v-model="newRow.display_name" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="user_name">
            <el-input style="width: 240px" v-model="newRow.user_name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passwd" :rules="[{required:true,message:'请输入密码',trigger:'blur'}]">
            <el-input autocomplete="off" style="width: 240px" type="password" v-model="newRow.passwd"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input autocomplete="off" style="width: 240px" type="password" v-model="newRow.repassword"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="Email" :rules="[{required:true,message:'请输入内容',trigger:'blur'},{
            pattern: /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,message: '请输入有效的邮箱'}]">
            <el-input autocomplete="off" style="width: 240px" v-model="newRow.Email"></el-input>
          </el-form-item>
          <el-form-item label="角色">
<!--            :button-texts="['到左边', '到右边']"-->
            <el-transfer
              filterable
              :titles="['可选', '已选']"
              filter-placeholder="输入搜索内容"
              v-model="newRow.roles_list"
              :data="roles_list">
            </el-transfer>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="AddNewRow">确 定</el-button>
          <el-button @click="dialognewRowForm = false">取 消</el-button>
        </div>
      </el-dialog >

      <!-- 编辑用户 -->
      <el-dialog title="编辑用户" :visible.sync="dialogeditRowForm" :close-on-click-modal="false">
        <el-form size="mini" label-width="120px" :model="editRowData">
          <el-form-item hidden>
            <el-input v-model="editRowData.id"></el-input>
          </el-form-item>
          <el-form-item label="显示名" prop="displayname" :rules="[{required:true,message:'请输入显示名',trigger:'blur'}]">
            <el-input autocomplete="off" v-model="editRowData.displayname" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username" :rules="[{required:true,message:'请输入用户名',trigger:'blur'}]">
            <el-input style="width: 240px" v-model="editRowData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" v-if="editRowData.user_type_id==1">
            <el-button @click="setPassword.id =editRowData.id, dialogPassword=true">修改密码</el-button>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email" :rules="[{required:true,message:'请输入内容',trigger:'blur'},{
            pattern: /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,message: '请输入有效的邮箱'}]">
            <el-input autocomplete="off" style="width: 240px" v-model="editRowData.email"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <!--            :button-texts="['到左边', '到右边']"-->
            <el-transfer
              filterable
              :titles="['可选', '已选']"
              filter-placeholder="输入搜索内容"
              v-model="editRowData.roles_list"
              :data="roles_list">
            </el-transfer>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editRow">确 定</el-button>
          <el-button @click="dialogeditRowForm = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 修改密码 -->
      <el-dialog title="修改密码" :visible.sync="dialogPassword" :close-on-click-modal="false">
        <el-form size="mini" label-width="120px" :model="setPassword" :rules="passRules">
          <el-form-item hidden>
            <el-input v-model="setPassword.id"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password" :rules="[{required:true,message:'请输入密码',trigger:'blur'}]">
            <el-input autocomplete="off" style="width: 240px" type="password" v-model="setPassword.password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="aginpassword">
            <el-input autocomplete="off" style="width: 240px" type="password" v-model="setPassword.aginpassword"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPassword = false">取 消</el-button>
          <el-button type="primary" @click="changePassword">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import Table from '@/components/tableTemp'
  export default {
    name: 'user_manage',
    props: {},

    data() {
      const validateCheckPass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.newRow.passwd) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      const validateSetPass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.setPassword.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        formSearch: {},
        condition: [],
        newRules: {
          display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
          user_name: [
            {required: true,message: "请输入内容",trigger: "blur"},
            {min:2,max:20,message:'长度在2到20个字符之间',trigger:'blur'}],
          repassword: [{required:true,message:'请输入密码',trigger:'blur'},{validator: validateCheckPass,trigger:'blur'}],
          phone: [
            { required: true, message: "请输入电话号码" },
            { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: "手机格式不对" }
          ],
          email: [
            { required: true, message: "请输入电子邮箱" },
            { pattern: /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, message: "请输入有效的邮箱" }
          ],
        },
        passRules: {aginpassword: [
            {required:true,message:'请输入密码',trigger:'blur'},{validator: validateSetPass,trigger:'blur'}
          ]},
        setPassword: {},
        newRow: {"roles_list": []},
        editRowData: {"username": "","displayname": "","email": "","user_type_id":2,"roles_list": []},
        roles_list: [],
        // data: generateData(),
        dialognewRowForm: false,
        dialogeditRowForm: false,
        dialogPassword: false,
        newTitle: '新建用户',
        options: {
          stripe: true, // 是否为斑马纹 table
          loading: false, // 是否添加表格loading加载动画
          highlightCurrentRow: true, // 是否支持当前行高亮显示
          mutiSelect: true, // 是否支持列表项选中功能
        }, // table 的参数
        tableData: [
          // { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        ],
        tableKey: [
          {
          // hide: true,
          name: '显示名',
          value: 'displayname',
          width: 100,
          hasSort: true,
          // align: 'center',
          // operate: true,
          resizable: true,              // 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）默认 true
          ShowOverflowTooltip: false,   // 当内容过长被隐藏时显示 tooltip 默认 false
        },
          { name: '用户名', value: 'username' },
          { name: '用户类型', value: 'user_type_id', align: 'center', formatter: function(row, column, cellValue, index) {
            // console.log("row:", row)
            if(row.user_type_id==1){var user_type = '本地'}else {user_type = 'LDAP'}
            return user_type
          }
        },
          { name: '邮箱', value: 'email', ShowOverflowTooltip: true, },
          { name: '角色', value: 'roles_list', formatter: function(row, column) {
            if(row.roles_list){
              var roles = row.roles_list.split(',')
              // console.log('roles:', roles)
              var tag=''
              for(var x=0;x<roles.length;x++){
                tag = tag + '<el-tag class="el-tag--mini el-tag" plain="plain" style="margin-right: 3px">'+roles[x]+'</el-tag>'
              }
            }else {tag = '-'}
              return tag
            } },
          // { name: '操作', value: '',align: 'center', hide:false,formatter: function(row, column) {
          //     // console.log("row:", row, column, cellValue, index)
          //     var tag_edit = '<el-button class="el-button el-button--mini el-button--primary"  @click="btn_click()">编辑</el-button>'
          //     var tag_del = '<el-button class="el-button el-button--mini el-button--danger" icon="el-icon-delete">删除</el-button>'
          //     return tag_edit + tag_del
          //   } },
    ],
        operates: {
          width: 200,
          fixed: 'right',
          label: '操作',
          align: 'center',
          list: [
            {
              id:'1',
              label: '编辑',
              type: 'warning',
              show: true,
              icon: 'el-icon-edit',
              size: 'mini',
              plain: true,
              disabled: false,
              method: (row, index) => {
                // console.log('edit0::::', row)
                // this.handleEdit(index, row)
                if(row.roles_id_list){var roles=row.roles_id_list.split(',').map(function(val) {
                  return Number(val)})}else {roles = []}
                this.dialogeditRowForm = true;
                this.editRowData.id = row.id;
                this.editRowData.username = row.username;
                this.editRowData.email = row.email;
                this.editRowData.displayname = row.displayname;
                this.editRowData.user_type_id = row.user_type_id;
                this.editRowData.roles_list = roles;
              }
            },
            {
              id:'2',
              label: '删除',
              type: 'danger',
              size: 'mini',
              icon: 'el-icon-delete',
              show: true,
              plain: true,
              disabled: false,
              method: (row, index) => {
                // console.log('delete::::')
                // this.deleteRow(row,index)
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.deleteRow(row,index)
                  // this.$message({
                  //   type: 'success',
                  //   message: '删除成功!'
                  // });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              }
            }
          ]
        },  // 列操作按钮
        total: 0,
        page: 1,
        limit: 10,
        url: this.GLOBAL.service_tag+'/api/system-setting/user/',
        sync_url: this.GLOBAL.service_tag+'/api/system-setting/ldap-sync/',
        loading: false,
        sync_loading: false,
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
        // console.log("ChangePage:", this.pageSize, this.currentPage)
        let parms = {"pageSize": page_size, "pageNumber": page_index, 'conditions': conn,
          'username': this.formSearch.username, 'displayname': this.formSearch.displayname,
          'role_title': this.formSearch.role,'user_type_id': this.formSearch.user_type_id}

        this.loading = true
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          const roles = [];
          response.data.global_dict.roles_list.map(function(value, index, array) {
            const temp={'label': value.name, 'key': value.id}
            roles.push(temp)
          })
          // console.log('aaa:',response.data.condition_config);
          if(response.data.status){
            this.tableData = response.data.rows
            this.total = response.data.total
            this.roles_list = roles
            this.condition = response.data.condition_config
          }else {this.$notify.error({message: String(response.data.error)})}
          this.loading = false
        }).catch((response) => {
          this.loading = false
            this.$notify.error({message: String(response)});
        });
      },

      // 新增数据
      AddNewRow: function() {
        // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
        if(!this.newRow.user_name || !this.newRow.display_name || !this.newRow.Email ||
          !this.newRow.Email || !this.newRow.passwd){this.$notify.warning('请输入必填项.'); return}
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        this.axios({
          method: 'POST',
          url: this.url,
          data: this.qs.stringify({'row': JSON.stringify(this.newRow)}),
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.dialognewRowForm = false;
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$notify.success({message: response.data.message})
          }else {this.$notify.error({message: 'AddNewRow Error: '+ response.data.error})}
        }).catch((response) => {
          this.$notify.error({message: 'AddNewRow Error: '+ response});
        });
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'}).close()
      },

      // 编辑选中数据
      editRow: function() {
        // console.log('rowedit:', row, row.roles_id_list.split(','))
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        const update_list = JSON.parse(JSON.stringify(this.editRowData))
        delete update_list.roles_list
        // console.log("roles_list:", roles_list)
        this.axios({
          method: 'PUT',
          url: this.url,
          data: this.qs.stringify({'update_list': JSON.stringify([update_list]),
            "update_ManyToMany": JSON.stringify([{'id':this.editRowData.id, 'newM2M': this.editRowData.roles_list}])}),
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$notify.success({message: response.data.message})
            this.dialogeditRowForm = false;
          }else {this.$notify.error({message: 'editRow Error: '+ response.data.error})}
        }).catch((response) => {
          this.$notify.error({message: 'editRow Error: '+ JSON.stringify(response)});
        });
        this.Loading.service().close()
      },

      // 删除选中数据
      deleteRow: function(row, index) {
        this.axios({
          method: 'DELETE',
          url: this.url,
          data: this.qs.stringify({'match': JSON.stringify([row.id])}),
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$notify.success({message: response.data.message})
          }else {this.$notify.error({message: 'deleteRow Error: '+ response.data.error})}
        }).catch((response) => {
          this.$notify.error({message: 'deleteRow Error: '+ response});
        });
      },

      // 修改用户密码
      changePassword: function() {
        // console.log("changePassword:", this.setPassword)
        if(!this.setPassword.password || !this.setPassword.aginpassword){this.$notify.warning('请输入必填项.'); return}
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        this.axios({
          method: 'PUT',
          url: this.url,
          data: this.qs.stringify({'password_list': JSON.stringify([{"id": this.setPassword.id, "password":this.setPassword.password}])}),
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.dialogPassword = false
            this.$notify.success({message: response.data.message})
          }else {this.$notify.error({message: 'changePassword Error: '+ response.data.error})}
        }).catch((response) => {
          this.$notify.error({message: 'changePassword Error: '+ JSON.stringify(response)});
        });
        this.Loading.service().close()
      },

      // 同步LDAP用户
      syncLDAP: function() {
        this.sync_loading = true
        this.axios({
          method: 'POST',
          url: this.sync_url,
          data: {},
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$message.success({message: response.data.message})
          }else {this.$message.error({message: String(response.data.error)})}
          this.sync_loading = false
        }).catch((response) => {
          this.sync_loading = false
          this.$message.error({message: String(response)});
        });

      },
    },

    computed: {},
    mounted () {
      this.InitGetTableData(this.url, this.limit, this.page)
    },
    components: {
      'table-box': Table
    }

  }
</script>

<style scoped>

</style>
