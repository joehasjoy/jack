<template>
    <div>
      <el-card style="margin: 10px">
        <!-- 搜索 -->
        <el-card style="margin: 5px 0">
          <el-form :inline="true" :model="formSearch" class="demo-form-inline">
            <el-form-item label=""><el-input v-model="formSearch.title" placeholder="角色名" @keyup.enter.native="GetTableList"></el-input></el-form-item>
            <el-form-item>
              <el-button type="primary" @click="GetTableList">查询</el-button>
              <el-button type="primary" @click="showNew">新增</el-button>
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

      <!-- 新Row -->
      <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" top="30px" :close-on-click-modal="false">
        <el-form size="mini" label-width="120px" :rules="newRules" :model="newRow" ref="newRow">
          <el-form-item hidden>
            <el-input v-model="newRow.id" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="角色名" prop="title" :rules="[{required:true,message:'请输入角色名.', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model="newRow.title" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input style="width: 340px" v-model="newRow.description" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="权限">
<!--            :button-texts="['到左边', '到右边']"-->
            <el-transfer
              filterable
              :titles="['可选', '已选']"
              filter-placeholder="输入搜索内容"
              v-model="newRow.pers_list"
              :props="{key: 'id',label: 'name'}"
              :data="global_dict.pers_list">
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
      return {
        loading: false,
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
        newRow: {"pers_list": [], 'title': '', 'description': ''},
        global_dict: {},
        dialognewRowForm: false,
        newTitle: '新建角色',
        options: {
          stripe: true, // 是否为斑马纹 table
          loading: false, // 是否添加表格loading加载动画
          highlightCurrentRow: true, // 是否支持当前行高亮显示
          mutiSelect: true, // 是否支持列表项选中功能
        }, // table 的参数
        tableData: [],
        tableKey: [
          {
          // hide: true,
          name: '角色名',
          value: 'title',
          width: 150,
          hasSort: true,
          // align: 'center',
          // operate: true,
          resizable: true,              // 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）默认 true
          ShowOverflowTooltip: false,   // 当内容过长被隐藏时显示 tooltip 默认 false
        },{name: '描述', value: 'description'},
          { name: '权限', value: 'pers_list', ShowOverflowTooltip: false, formatter: function(row, column, cellValue, index) {
              if(row.pers_list){
                var data_list = row.pers_list.split(',')
                var tag=''
                for(var x=0;x<data_list.length;x++){tag = tag + '<el-tag class="el-tag--mini el-tag" plain="plain" style="margin-right: 3px">'+data_list[x]+'</el-tag>'}
              }else {tag = '-'}
              return tag
            }},
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
                if(row.pers_id_list){var pers=row.pers_id_list.split(',').map(function(val) {
                  return Number(val)})}else {pers = []}
                this.dialognewRowForm = true;
                this.newTitle= '编辑角色';
                this.newRow.id = row.id;
                this.newRow.title = row.title;
                this.newRow.description = row.description;
                this.newRow.pers_list = pers;
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
        url: this.GLOBAL.service_tag+'/api/system-setting/roles/',

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
        if(conn==undefined){
          conn={}
          if(this.formSearch.title){conn['title__icontains']=[this.formSearch.title]}
          // if(this.formSearch.user_type_id){conn['user_type_id']=[this.formSearch.user_type_id]}
        }
        const parms = {"pageSize": page_size, "pageNumber": page_index, 'conditions': conn}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('aaa:',response.data.condition_config);
          if(response.data.status){
            this.tableData = response.data.rows
            this.total = response.data.total
            this.condition = response.data.condition_config
            this.global_dict = response.data.global_dict
          }else {this.$notify.error({message: response.data.error})}
        }).catch((response) => {
            this.$notify.error({message: 'GetTableData Error: '+ JSON.stringify(response)});
        });
      },

      // 新增数据
      AddNewRow: function() {
        // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
        if(!this.newRow.title){this.$notify.warning('请输入必填项.'); return}
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        const row = JSON.parse(JSON.stringify(this.newRow))
        delete row['id']
        this.axios({
          method: 'POST',
          url: this.url,
          data: this.qs.stringify({'row': JSON.stringify(row)}),
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
        if(!this.newRow.title){this.$notify.warning('请输入必填项.'); return}
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        const update_list = JSON.parse(JSON.stringify(this.newRow))
        delete update_list.pers_list
        // console.log("pers_list:", pers_list)
        this.axios({
          method: 'PUT',
          url: this.url,
          data: this.qs.stringify({'update_list': JSON.stringify([update_list]),
            "update_ManyToMany": JSON.stringify([{'id':this.newRow.id, 'newM2M': String(this.newRow.pers_list)}])}),
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$notify.success(response.data.message)
            this.dialognewRowForm = false;
          }else {this.$notify.error('editRow Error: '+ response.data.error)}
        }).catch((response) => {
          this.$notify.error('editRow Error: '+ JSON.stringify(response));
        });
        this.Loading.service().close()
      },

      // 删除选中数据
      deleteRow: function(row, index) {
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
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
        this.Loading.service().close()
      },

      showNew: function() {
        this.dialognewRowForm = true;
        this.newTitle='新建角色';
        this.newRow.id=''
        this.newRow.title=''
        this.newRow.pers_list=[]
        this.newRow.description=''
      }
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
