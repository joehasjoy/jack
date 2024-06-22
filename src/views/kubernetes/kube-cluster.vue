<template>
    <div>
      <el-card style="margin: 10px">
        <!-- 搜索 -->
        <el-form :inline="true" :model="formSearch" class="demo-form-inline">
          <el-form-item label=""><el-input v-model="formSearch.name" placeholder="名称" @keyup.enter.native="GetTableList"></el-input></el-form-item>
          <el-form-item label=""><el-input v-model="formSearch.url" placeholder="URL" @keyup.enter.native="GetTableList"></el-input></el-form-item>
          <el-form-item label="">
            <el-select v-model="formSearch.env" filterable clearable placeholder="所属环境" style="width: 240px">
              <el-option :label="item.name" :value="item.name" v-for="(item,index) in env_list" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="GetTableList">查询</el-button>
            <el-button type="primary" @click="showNew">新增</el-button>
          </el-form-item>
        </el-form>

        <div style="width: 100%">
          <!-- 表格 -->
          <table-box :tableData="tableData" :tableKey="tableKey" options="options" :total="total"
                     :page.sync="page" :limit.sync="limit" :operates="operates"  @pagination="GetTableList">
          </table-box>
        </div>

      </el-card>

      <!-- 新建Row -->
      <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" :close-on-click-modal="false" width="500px">
        <el-form ref="newForm" size="mini" label-width="120px" :rules="newRules" :model="newRow">
          <el-form-item hidden>
            <el-input v-model="newRow.id" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name" :rules="[{required:true,message:'请输入名称.', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model="newRow.name" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="所属环境">
            <el-select v-model="newRow.env_id_list" filterable clearable multiple placeholder="所属环境" style="width: 240px">
              <el-option :label="item.name" :value="item.id" v-for="(item,index) in env_list" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="URL" prop="url" :rules="[{required:true,message:'请输入url.', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model="newRow.url" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="Token" prop="token" :rules="[{required:true,message:'请输入token.', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model="newRow.token" style="width: 240px"></el-input>
          </el-form-item>

          <el-form-item label="Ca">
            <el-input autocomplete="off" v-model="newRow.ca" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="Cert">
            <el-input autocomplete="off" v-model="newRow.cert" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="Key">
            <el-input autocomplete="off" v-model="newRow.key" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="SSL启用" prop="ssl" :rules="[{required:true,message:'请输入选择类型.', trigger: 'blur'}]">
            <el-select v-model="newRow.ssl" placeholder="SSL启用" style="width: 240px">
              <el-option label="否" :value="false"></el-option>
              <el-option label="是" :value="true"></el-option>
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
    name: 'user_manage',
    props: {},

    data() {
      return {
        env_list: [],
        formSearch: {},
        condition: [],
        newRules: {
          // display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
        },
        newRow: {'name': '', 'url': '', 'token': '','ca':'','cert':'','key':'', 'ssl': false, 'is_enable': true,"env_id_list":[]},
        global_dict: {"env_list": []},
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
          { name: 'URL', value: 'url', width: '200'},
          { name: 'Token', value: 'token', ShowOverflowTooltip: true},
          { name: '所属环境', value: 'env_list', formatter(row) {
            if(row.env_list){
            let tgts = row.env_list.split(',')
            let tag = ''
            for (let x = 0; x < tgts.length; x++) {
              tag = tag + '<el-tag class="el-tag--mini el-tag" plain="plain" style="margin-right: 3px">' + tgts[x] + '</el-tag>'
            }
            return tag
          }
        } },
          { name: 'Ca', value: 'ca' },
          { name: 'Cert', value: 'cert' },
          { name: 'SSL启用', value: 'ssl', width:'100'},
          { name: '启用', value: 'is_enable', ShowOverflowTooltip: false, width:'100', formatter: function(row, column, cellValue, index) {
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
                if(row.env_id_list){var tgts=row.env_id_list.split(',').map(function(val) {
                  return Number(val)})}else {tgts = []}
                this.dialognewRowForm = true;
                this.newTitle= '编辑';
                this.newRow.id = row.id;
                this.newRow.name = row.name;
                this.newRow.url = row.url;
                this.newRow.env_id_list = tgts;
                this.newRow.token = '';
                this.newRow.ca = row.ca;
                this.newRow.cert = row.cert;
                this.newRow.key = row.key;
                this.newRow.ssl = row.ssl;
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
        url: this.GLOBAL.service_tag+'/api/kubernetes/kube-cluster/',

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
      InitGetTableData: function(url,page_size, page_index) {
        const parms = {"pageSize": page_size, "pageNumber": page_index, 'name': this.formSearch.name, 'url': this.formSearch.url, 'env': this.formSearch.env}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('aaa:',response.data.condition_config);
          if(response.data.status){
            this.tableData = response.data.data
            this.total = response.data.total
            this.env_list = response.data.env_list
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
            delete update_list.env_id_list
            // console.log("pers_list:", pers_list)
            this.axios({
              method: 'PUT',
              url: this.url,
              data: this.qs.stringify({'update_list': JSON.stringify([update_list]),
                "update_ManyToMany": JSON.stringify([{'id':this.newRow.id, 'newM2M': String(this.newRow.env_id_list)}])}),
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

      showNew: function() {
        this.dialognewRowForm = true
        this.newTitle='新建'
        this.newRow = {'id': '','name': '', 'url': '', 'token': '','ca':'','cert':'','key':'', 'ssl': false, 'is_enable': true,"env_id_list":[]}
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
