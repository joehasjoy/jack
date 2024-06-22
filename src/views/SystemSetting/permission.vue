<template>
    <div>
      <el-card style="margin: 10px">
        <el-card style="margin: 5px 0">
          <!-- 搜索 -->
          <el-form :inline="true" :model="formSearch" class="demo-form-inline">
            <el-form-item label=""><el-input v-model="formSearch.title" placeholder="角色名" @keyup.enter.native="GetTableList"></el-input></el-form-item>
            <el-form-item>
              <el-button type="primary" @click="GetTableList">查询</el-button>
              <el-button type="primary" @click="dialognewRowForm = true; newTitle='新建权限'; newRow.id=''">新增</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <div style="width: 100%">
          <!-- 表格 -->
          <table-box :tableData="tableData" :tableKey="tableKey" options="options" :total="total"
                     :page.sync="page" :limit.sync="limit" :operates="operates"  @pagination="GetTableList">
          </table-box>
        </div>
      </el-card>

      <!-- 新建Row -->
      <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" top="30px" :close-on-click-modal="false">
        <el-form size="mini" label-width="120px" :rules="newRules" :model="newRow" ref="newRow">
          <el-form-item hidden>
            <el-input v-model="newRow.id" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="权限名" prop="title" :rules="[{required:true,message:'请输入权限名.', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model="newRow.title" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="URL" prop="url" :rules="[{required:true,message:'请输入url.', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model="newRow.url" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="参数">
            <el-input autocomplete="off" v-model="newRow.args" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="请求类型" prop="type" :rules="[{required:true,message:'请输入选择请求类型.', trigger: 'blur'}]">
            <el-select v-model="newRow.type" filterable clearable placeholder="请求类型" style="width: 240px">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单否" prop="is_menu" :rules="[{required:true,message:'请输入选择请求类型.', trigger: 'blur'}]">
            <el-select v-model="newRow.is_menu" clearable placeholder="菜单否" style="width: 240px">
              <el-option label="否" :value="false"></el-option>
              <el-option label="是" :value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单模块" prop="menu_module" :rules="[{required:true,message:'请输入选择请求菜单模块.', trigger: 'blur'}]">
            <el-select v-model="newRow.menu_module" filterable clearable placeholder="菜单模块" style="width: 240px">
              <el-option :label="item.name" :value="item.id" v-for="(item,index) in global_dict.mudule_list" :key="index"></el-option>
            </el-select>
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
      return {
        formSearch: {},
        condition: [],
        newRules: {
          // display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
        },
        newRow: {"menu_module": '', 'title': '', 'url': '', 'type': 'GET', 'args': '', 'is_menu': true},
        global_dict: {"mudule_list": []},
        dialognewRowForm: false,
        newTitle: '',
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
          name: '权限名',
          value: 'title',
          width: 150,
          hasSort: true,
          // align: 'center',
          // operate: true,
          resizable: true,              // 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）默认 true
          ShowOverflowTooltip: false,   // 当内容过长被隐藏时显示 tooltip 默认 false
        },
          { name: 'URL', value: 'url' },
          { name: '请求类型', value: 'type' },
          { name: '参数', value: 'args' },
          { name: '菜单模块名', value: 'menu_module__name' },
          { name: '菜单否', value: 'is_menu', ShowOverflowTooltip: false, formatter: function(row, column, cellValue, index) {
              if(row.is_menu){var tag='是'}else {tag='否'}
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
                this.dialognewRowForm = true;
                this.newTitle= '编辑权限';
                this.newRow.id = row.id;
                this.newRow.title = row.title;
                this.newRow.url = row.url;
                this.newRow.type = row.type;
                this.newRow.args = row.args;
                this.newRow.menu_module = row.menu_module__id;
                this.newRow.is_menu = row.is_menu;
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
        url: this.GLOBAL.service_tag+'/api/system-setting/permissions/',

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
        // console.log("url:", this.baseURI)
        // console.log("ChangePage:", this.pageSize, this.currentPage)

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
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
            this.$message.error({message: 'GetTableData Error: '+ JSON.stringify(response)});
        });

      },

      // 新增数据
      AddNewRow: function() {
        // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
        if(!this.newRow.title || !this.newRow.url || !this.newRow.type
          || !this.newRow.menu_module){this.$message.warning('请输入必填项.'); return}
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
            this.$message.success({message: response.data.message})
          }else {this.$message.error({message: 'AddNewRow Error: '+ response.data.error})}
        }).catch((response) => {
          this.$message.error({message: 'AddNewRow Error: '+ response});
        });
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'}).close()
      },

      // 编辑选中数据
      editRow: function() {
        // console.log('rowedit:', row, row.roles_id_list.split(','))
        if(!this.newRow.title || !this.newRow.url || !this.newRow.type ||
           !this.newRow.menu_module){this.$message.warning('请输入必填项.'); return}
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        const update_list = JSON.parse(JSON.stringify(this.newRow))
        delete update_list.pers_list
        // console.log("pers_list:", pers_list)
        this.axios({
          method: 'PUT',
          url: this.url,
          data: this.qs.stringify({'update_list': JSON.stringify([update_list]),
            "update_ManyToMany": JSON.stringify([{'id':this.newRow.id, 'newM2M': this.newRow.pers_list}])}),
        }).then((response)=>{
          // console.log(response.data);
          if(response.data.status){
            this.InitGetTableData(this.url, this.limit, this.page)
            this.$message.success({message: response.data.message})
            this.dialognewRowForm = false;
          }else {this.$message.error({message: 'editRow Error: '+ response.data.error})}
        }).catch((response) => {
          this.$message.error({message: 'editRow Error: '+ JSON.stringify(response)});
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
            this.$message.success({message: response.data.message})
          }else {this.$message.error({message: 'deleteRow Error: '+ response.data.error})}
        }).catch((response) => {
          this.$message.error({message: 'deleteRow Error: '+ response});
        });
        this.Loading.service().close()
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
