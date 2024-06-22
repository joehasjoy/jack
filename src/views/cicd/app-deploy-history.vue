<template>
    <el-card style="margin: 10px">
        <el-card style="margin: 5px 0">
            <!-- 搜索 -->
            <el-form
                    :inline="true"
                    :model="formSearch"
                    class="demo-form-inline"
                    @submit.native.prevent
            >
                <el-form-item label="制品名称:">
                    <el-input
                            v-model="formSearch.productName"
                            id="productName"
                            placeholder="请输入制品名称"
                            @keyup.enter.native="GetTableList"
                            clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="环境:">
                  <el-select
                          style="width: 100px"
                          v-model="formSearch.envCode"
                          placeholder="请选择"
                          size="mini"
                          clearable
                  >
                    <el-option
                          v-for="item in AppCiCdData"
                          :key="item.env"
                          :label="item.env"
                          :value="item.env"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

              <el-form-item label="分支:">
                <el-input
                        v-model="formSearch.branch"
                        placeholder="请输入分支"
                        id="branch"
                        clearable
                        @keyup.enter.native="GetTableList"
                ></el-input>
              </el-form-item>

                <el-form-item>
                    <el-button
                            type="primary"
                            @click="GetTableList"
                            icon="el-icon-search"
                            id="appSearch"
                    >查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <div style="width: 100%">
            <!-- 表格 -->
            <el-table
                    id="out-table"
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%; border: 1px solid #ebeef5"
            >
                <el-table-column label="制品名" :show-overflow-tooltip="true" prop="">
                  <template slot-scope="scope">
                    <span>{{ scope.row.productName }}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable label="环境" prop="">
                    <template slot-scope="scope">
                        <span>{{ scope.row.envCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column sortable label="分支" prop="">
                    <template slot-scope="scope">
                        <span>{{ scope.row.branch }}</span>
                    </template>
                </el-table-column>
                <el-table-column sortable label="部署模式" prop="">
                    <template slot-scope="scope">
                        <span>{{ scope.row.mode }}</span>
                    </template>
                </el-table-column>
                <el-table-column sortable label="命名空间/服务器" prop="">
                  <template slot-scope="scope">
                    <span>{{ scope.row.namespaceOrIp }}</span>
                  </template>
                </el-table-column>
<!--                <el-table-column sortable label="颜色" prop="">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.color }}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column sortable label="发布时间" prop="" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                  </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <pagination
                        :total="total"
                        :page.sync="page"
                        :limit.sync="limit"
                        @pagination="GetTableList"
                ></pagination>
            </div>
        </div>
    </el-card>
</template>

<script>
  import Table from '@/components/tableTemp'
  import pagination from '@/components/Pagination/pagination'
  import {GoToPipeline, getUseLanguageName} from '@/utils/pipeline.js'
  import app from '@/guide/app.js'
  import {showGuideInfo} from '@/utils/guide.js'

  export default {
    name: 'app',
    props: ['appId'],

    data() {
      return {
        // appId: '',
        AppCiCdData: [
          {
            env: "DEV",
          },
          {
            env: "FAT",
          },
          {
            env: "UAT",
          },
          {
            env: "PROD",
          },
        ],
        AppCreatedPermissiondialogVisible: false,
        checkPermissionURL: '',
        languages: [],
        users: [],
        formSearch: {appCode: ''},
        condition: [],
        newRules: {
          // display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
        },
        newRow: {name: '', is_enable: true, description: ''},
        global_dict: {mudule_list: []},
        dialognewRowForm: false,
        newTitle: '新增应用',
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
        loading: false,
        cmdb_app_url: this.GLOBAL.baseUrl + '/app/',
        app_url: this.GLOBAL.baseUrl + '/appDeploy/list/condition',
      }
    },
    created: function () {
    },
    // watch: {
    //   appId: {
    //     handler: function(newVal, oldVal) {
    //       this.$nextTick(() => {
    //         if(newVal){
    //           this.appId = newVal;
    //         }
    //       });
    //     },
    //     immediate: true
    //   }
    // },
    methods: {
      stateLanguage: function (row, column) {
        return getUseLanguageName(row.useLanguage)
      },

      //跳转新增页面
      appAddClick: function () {
        this.AppCreatedPermissiondialogVisible = true
        this.checkPermissionURL =
          this.GLOBAL.taskCenter +
          '/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant&processKey=appAply&processName=appAply&current=1'
      },
      // 跳转构建页面
      buildClick: function (row) {
        GoToPipeline(row, this.GLOBAL, this.$router)
      },
      appDetailClick: function (row) {
        this.$router.push(
          '/cicd/app-detail?appId=' + row.id + '&owner=' + row.prodMgrName
        )
      },
      appEditClick: function (row) {
        this.$router.push('/cicd/app-edit?appId=' + row.id)
      },

      GetTableList: function () {
        // console.log("GetTableList3333:", this.page, this.limit, val)
        this.InitGetTableData(this.app_url, this.limit, this.page)
      },

      // 获取表格数据；
      InitGetTableData: function (url, page_size, page_index) {
        const parms = {
          pageSize: page_size,
          pageNumber: page_index,
          productName: this.formSearch.productName,
          envCode: this.formSearch.envCode,
          branch: this.formSearch.branch,
          appId: this.appId,
        }
        this.loading = true
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        })
          .then((response) => {
            if (response.data.code == 200) {
              this.tableData = response.data.data.list
              this.total = response.data.data.total
              // this.users = response.data.users
              // this.languages = response.data.languages
            } else {
              this.$notify.error(response.data.error)
            }
            this.loading = false
          })
          .catch((response) => {
            this.loading = false
            this.$notify.error('GetTableData Error: ' + String(response))
          })
      },

      // 新增数据
      AddNewRow: function () {
        // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
        this.$refs.newRow.validate((valid) => {
          if (valid) {
            this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
            let row = JSON.parse(JSON.stringify(this.newRow))
            delete row['id']
            this.axios({
              method: 'POST',
              url: this.url,
              data: this.qs.stringify({row: JSON.stringify(row)}),
            })
              .then((response) => {
                // console.log(response.data);
                if (response.data.status) {
                  this.dialognewRowForm = false
                  this.InitGetTableData(this.url, this.limit, this.page)
                  this.$notify.success(response.data.message)
                } else {
                  this.$notify.error('AddNewRow Error: ' + response.data.error)
                }
              })
              .catch((response) => {
                this.$notify.error('AddNewRow Error: ' + response)
              })
            this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'}).close()
          } else {
            this.$message.warning('请输入合法数据')
          }
        })
      },

      // 编辑选中数据
      editRow: function () {
        // console.log('rowedit:', row, row.roles_id_list.split(','))
        this.$refs.newRow.validate((valid) => {
          if (valid) {
            this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
            const update_list = JSON.parse(JSON.stringify(this.newRow))
            // console.log("pers_list:", pers_list)
            this.axios({
              method: 'PUT',
              url: this.url,
              data: this.qs.stringify({
                update_list: JSON.stringify([update_list]),
                update_ManyToMany: JSON.stringify([]),
              }),
            })
              .then((response) => {
                // console.log(response.data);
                if (response.data.status) {
                  this.InitGetTableData(this.url, this.limit, this.page)
                  this.$notify.success(response.data.message)
                  this.dialognewRowForm = false
                } else {
                  this.$notify.error('editRow Error: ' + response.data.error)
                }
              })
              .catch((response) => {
                this.$notify.error('editRow Error: ' + String(response))
              })
            this.Loading.service().close()
          } else {
            this.$message.warning('请输入合法数据')
          }
        })
      },

      // 删除选中数据
      deleteRow: function (row, index) {
        this.Loading.service({background: 'rgba(0, 0, 0, 0.7)'})
        this.axios({
          method: 'DELETE',
          url: this.app_url,
          data: this.qs.stringify({rows: JSON.stringify([row.id])}),
        })
          .then((response) => {
            // console.log(response.data);
            if (response.data.status) {
              this.InitGetTableData(this.url, this.limit, this.page)
              this.$notify.success({message: response.data.message})
            } else {
              this.$notify.error({message: String(response.data.error)})
            }
          })
          .catch((response) => {
            this.$notify.error({message: String(response)})
          })
        this.Loading.service().close()
      },

      // 同步数据
      SyncData: function () {
        // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
        this.axios({
          method: 'POST',
          url: this.app_url,
          data: {sync: true},
        })
          .then((response) => {
            // console.log(response.data);
            if (response.data.status) {
              this.InitGetTableData(this.app_url, this.limit, this.page)
              this.$message.success(response.data.message)
            } else {
              this.$message.error(
                'SyncData Error: ' + String(response.data.error)
              )
            }
          })
          .catch((response) => {
            this.$message.error('SyncData Error: ' + String(response))
          })
      },

      //  编辑权限
      editPermission: function () {
        let ret = this.common.hasPermission(this.$store.state.user.roles, [
          'cicd_admin',
          'devops',
        ])
        console.log('editPermission:', ret)
        return ret
      },
    },

    computed: {
      GetLanguages() {
        return getUseLanguageName(scope.row.useLanguage)
      },
    },
    mounted() {
      let appCode = this.common.getUrlKey('appCode')
      if (appCode) {
        this.formSearch.appCode = appCode
      }
      this.InitGetTableData(this.app_url, this.limit, this.page)
      showGuideInfo(app, 'app', this.$driver)
    },
    components: {
      'table-box': Table,
      pagination: pagination,
    },
  }
</script>

<style scoped>
</style>
