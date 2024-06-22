<template>
    <div style="padding: 10px 10px 0 10px">
      <!-- 搜索 -->
      <el-form :inline="true" :model="formSearch" class="demo-form-inline">
        <el-form-item label="名称"><el-input v-model="formSearch.name" placeholder="名称"></el-input></el-form-item>
        <el-form-item label="命名空间"><el-input v-model="formSearch.ns__name" placeholder="命名空间"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="GetTableList">查询</el-button>
        </el-form-item>
      </el-form>

      <el-button size="mini" plain="plain" @click="dialognewRowForm = true; newTitle='新建'; newRow.id=''">新增</el-button>
      <el-button size="mini" plain="plain" type="danger">删除</el-button>
      <el-button size="mini" plain="plain" style="float: right" @click="InitGetTableData(url, limit, page)">刷新</el-button>
      <div style="width: 100%">
        <!-- 表格 -->
        <table-box :tableData="tableData" :tableKey="tableKey" options="options" :total="total"
                   :page.sync="page" :limit.sync="limit" :operates="operates"  @pagination="GetTableList">
        </table-box>
      </div>

      <!-- 新建Row -->
      <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" top="30px" :close-on-click-modal="false" width="500px">
        <el-form ref="newForm" size="mini" label-width="120px" :rules="newRules" :model="newRow">
          <el-form-item hidden>
            <el-input v-model="newRow.id" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name" :rules="[{required:true,message:'请输入名称.', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model="newRow.name" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="命名空间" prop="ns_id" :rules="[{required:true,message:'请输入选择.', trigger: 'blur'}]">
            <el-select v-model="newRow.ns_id" filterable placeholder="命名空间" style="width: 240px">
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in global_dict.ns_list" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权人">
            <el-select v-model="newRow.user_list" filterable clearable multiple collapse-tags placeholder="授权人" style="width: 240px">
              <el-option :label="item.name+'-'+item.username" :value="item.id" v-for="(item, index) in global_dict.user_list" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权组">
            <el-select v-model="newRow.user_group_id" filterable clearable placeholder="授权组" style="width: 240px">
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in global_dict.user_group_list" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端">
            <el-select v-model="newRow.terminal" placeholder="terminal" style="width: 240px">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用" prop="is_enable" :rules="[{required:true,message:'请输入选择.', trigger: 'blur'}]">
            <el-select v-model="newRow.is_enable" placeholder="启用" style="width: 240px">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
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
    name: 'ns-permission',
    props: {},

    data() {
      return {
        formSearch: {},
        condition: [],
        newRules: {
          // display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
        },
        newRow: {'name': '', 'ns_id': '', 'user_list': [],'user_group_id':null, 'is_enable': true, terminal: false},
        global_dict: {"ns_list": [], 'user_group_list': [], 'user_list':[]},
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
          name: '名称',
          value: 'name',
          width: 150,
          hasSort: true,
          // align: 'center',
          // operate: true,
          resizable: true,              // 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）默认 true
          ShowOverflowTooltip: false,   // 当内容过长被隐藏时显示 tooltip 默认 false
        },
          { name: '命名空间', value: 'ns__name', ShowOverflowTooltip: true},
          { name: 'Kube-Cluster', value: 'ns__kube__name' },
          { name: '授权用户', value: 'user_list_name', formatter(row) {
            if(row.user_list_name){
              let tgts = row.user_list_name.split(',')
              let tag = ''
              for (let x = 0; x < tgts.length; x++) {
                tag = tag + '<el-tag class="el-tag--mini el-tag" plain="plain" style="margin-right: 3px">' + tgts[x] + '</el-tag>'
              }
              return tag
            }
          } },
          { name: '授权组', value: 'user_group__name' },
          { name: '终端', value: 'terminal',width:80,align: 'center', formatter: function(row, column, cellValue, index) {
            if(row.terminal){var tag='是'}else {tag='否'}
            return tag
          }},
          { name: '启用', value: 'is_enable',width:80,align: 'center', ShowOverflowTooltip: false, formatter: function(row, column, cellValue, index) {
              if(row.is_enable){var tag='是'}else {tag='否'}
              return tag
            }},
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
                if(row.user_list_id){var tgts=row.user_list_id.split(',').map(function(val) {
                  return Number(val)})}else {tgts = []}
                this.dialognewRowForm = true;
                this.newTitle= '编辑';
                this.newRow.id = row.id;
                this.newRow.name = row.name;
                this.newRow.ns_id = Number(row.ns__id);
                this.newRow.user_list = tgts;
                this.newRow.user_group_id = row.user_group__id;
                this.newRow.terminal = row.terminal;
                this.newRow.is_enable = row.is_enable;
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
        url: this.GLOBAL.service_tag+'/api/kubernetes/ns-authority/',

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
          if(this.formSearch.name){conn['name__icontains']=[this.formSearch.name]}
          if(this.formSearch.ns__name){conn['ns__name__icontains']=[this.formSearch.ns__name]}
        }
        const parms = {"pageSize": page_size, "pageNumber": page_index, 'conditions': conn}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('aaa:',response.data);
          if(response.data.status){
            this.tableData = response.data.rows
            this.total = response.data.total
            this.condition = response.data.condition_config
            this.global_dict = response.data.global_dict
          }else {this.$notify.error(response.data.error)}
        }).catch((response) => {
            this.$notify.error('GetTableData Error: '+ String(response));
        });

      },

      // 新增数据
      AddNewRow: function() {
        // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
        this.$refs.newForm.validate(valid =>{
          if(valid){
            this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
            let row = JSON.parse(JSON.stringify(this.newRow))
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
                this.$notify.success(response.data.message)
              }else {this.$notify.error('AddNewRow Error: '+ response.data.error)}
            }).catch((response) => {
              this.$notify.error('AddNewRow Error: '+ String(response));
            });
            this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'}).close()
          }
          else {this.$message.warning('请输入合法数据')}
        })

      },

      // 编辑选中数据
      editRow: function() {
        this.$refs.newForm.validate(valid =>{
          if(valid){
            this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
            let update_list = JSON.parse(JSON.stringify(this.newRow))
            delete update_list.user_list
            // console.log("update_list:", update_list)
            this.axios({
              method: 'PUT',
              url: this.url,
              data: this.qs.stringify({'update_list': JSON.stringify([update_list]),
                "update_ManyToMany": JSON.stringify([{'id':this.newRow.id, 'newM2M': String(this.newRow.user_list)}])}),
            }).then((response)=>{
              // console.log(response.data);
              if(response.data.status){
                this.InitGetTableData(this.url, this.limit, this.page)
                this.$notify.success(response.data.message)
                this.dialognewRowForm = false;
              }else {this.$notify.error('editRow Error: '+ response.data.error)}
            }).catch((response) => {
              this.$notify.error('editRow Error: '+ String(response));
            });
            this.Loading.service().close()
          }else {this.$message.warning('请输入合法数据')}
        })

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
            this.$notify.success(response.data.message)
          }else {this.$notify.error('deleteRow Error: '+ response.data.error)}
        }).catch((response) => {
          this.$notify.error('deleteRow Error: '+ String(response));
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
