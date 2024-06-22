<template>
    <div class="app-container">
        <div class="filter-container">
          <el-select 
          v-model.trim="select_search"
          filterable
          remote
          placeholder="请输入appId搜索"
          :loading="loading"
          :remote-method="searchApp"
          clearable
          >
            <el-option v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
          </el-select>

          <el-select
          v-model.trim="env"
          filterable
          clearable
          placeholder="请选择环境"
          style="margin-left:20px;">
            <el-option
            v-for="item in env_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            ></el-option>
          </el-select>
          <el-input class="search_input" v-model.trim="search_content" clearable prefix-icon="el-icon-search" style="width:250px;margin-left:10px;" @keyup.native.enter="handleFilter"></el-input>
          <el-button  class="filter-item search" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button  style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">导出数据</el-button>
          <el-button type="warning" style="float:right;" @click="initOpen" v-if="user_roles.includes('devops')">服务器初始化</el-button>
        </div>
        <div>
            <el-table
            :data=tableData
            style="width: 100%"
            :cell-class-name="cellSelfStyle"
            id="expand_table"
            @row-click="rowClick"
            ref="refTable"
            :row-class-name="tableRowClassName"
            >
              <el-table-column 
              label="实例ID"
              prop="instance_id"
              min-width="120"
              >
              </el-table-column>
              <el-table-column 
              label="环境"
              prop="env"
              align="left"
              min-width="50">
              </el-table-column>
              <el-table-column
              label="实例名"
              prop="instance_name"
              align="left"
              min-width="220"
              ></el-table-column>
              <el-table-column
              label="内网IP"
              prop="private_ip"
              
              ></el-table-column>
              <el-table-column
              label="运行状态"
              prop="instance_status"
              
              ></el-table-column>
              <el-table-column
              label="实例配置"
              prop="hardware"
              
              ></el-table-column>
              <el-table-column
              label="创建时间"
              prop="create_time"
              
              ></el-table-column>
              <el-table-column 
              label="到期时间"
              prop="expire_time"
              ></el-table-column>
              <!--<el-table-column
              label="操作">
                <template slot-scope="scope">
                  <el-dropdown @command="handleCommand">
                    <el-button type="primary" size="mini">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{action:'connectApp', data: scope.row}" >关联应用</el-dropdown-item>
                      <el-dropdown-item :command="{action: 'cancelConnectApp', data:scope.row}" v-if="scope.row.app_id != 999999">取消关联</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                </template>
              </el-table-column>-->
              <el-table-column type="expand" id="expand_table">
                  <template slot-scope="props">
                      <el-form label-position="left" inline class="demo-table-expand">
                        <el-row v-for="(item, index) in props.row.disks" :key="index">
                            <div v-if="item.type=='system'">
                              <el-col :span="10">
                                <el-form-item label="系统盘大小">
                                  <span>{{ item.size }}</span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="10">
                                <el-form-item label="系统盘类型">
                                  <span>{{ item.category }}</span>
                                </el-form-item>
                              </el-col>
                            </div>
                            <div v-else>
                                <el-col :span="10">
                                <el-form-item label="数据盘大小">
                                  <span>{{ item.size }}</span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="10">
                                <el-form-item label="数据盘类型">
                                  <span>{{ item.category }}</span>
                                </el-form-item>
                              </el-col>
                            </div>
                        </el-row>
                        <el-col :span="10">
                          <el-form-item label="APPID">
                            <span>{{props.row.application_info.code}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item label="镜像">
                            <span>{{ props.row.image_id }}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item label="付费类型">
                            <span>{{ props.row.instance_charge_type }}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="实例规格">
                                <span>{{ props.row.instance_type}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="公网IP">
                                <span>{{ props.row.eip}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="域ID">
                                <span>{{ props.row.region_id}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="VPC ID">
                                <span>{{ props.row.vpc_id}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="交换机ID">
                                <span>{{ props.row.vswitch_id}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="可用区ID">
                                <span>{{ props.row.zone_id}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="更新时间">
                                <span>{{ props.row.update_time}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="备注">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                        </el-col>
                      </el-form>
                  </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
            <el-dialog
              title="手动初始化"
              :visible.sync="init_dialog"
              width="30%"
              :before-close="handleClose">
              <el-form :model="initForm" ref="initForm" :rules="initRules" label-width="80px">
                <el-form-item label="环境" prop="env">
                  <el-select
                    v-model="initForm.env"
                    filterable
                    clearable
                    placeholder="请选择环境"
                    style="width:100%;"
                    >
                    <el-option
                      v-for="item in env_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="组名" prop="groupName">
                  <el-select
                  v-model="initForm.groupName"
                  filterable
                  clearable
                  style="width:100%;"
                  >
                    <el-option
                    v-for="item in group_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="appCode" prop="appCode">
                  <el-select 
                  v-model="initForm.appCode" 
                  filterable
                  remote
                  placeholder="请输入关键字搜索"
                  :loading="loading"
                  :remote-method="searchApp"
                  clearable
                  style="width:100%;"
                  >
                    <el-option v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>

                </el-form-item>
                <el-form-item label="IP" prop="ip">
                  <el-input v-model.trim="initForm.ip"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="init_dialog = false">取 消</el-button>
                <el-button type="primary" @click="initSubmit('initForm')">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="关联应用"
              :visible.sync="connectApp_dialog"
              width="30%"
              >
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="connectApp_dialog = false">取消</el-button>
                <el-button type="primary" @click="connectApp_dialog = false">提交</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import pagination from '@/components/Pagination/pagination'
import { isInstanceId } from '@/utils/validate'
import { getToken } from '@/utils/auth'
export default {
    name: 'ecs_list',
    components: {
        pagination
    },
    
    data() {
        return {
          tableData: [],
          total: 0,
          limit: 10,
          page:1,
          select_search: '',
          options: [],
          loading: false,
          env: '',
          search_content: '',
          env_options: [],
          getRowKeys(row) {
            return row.id
          },
          init_dialog: false,
          group_options: [
            {value: 'frontend', label: 'frontend'},
            {value: 'backend', label: 'backend'},
            {value: 'openservice', label: 'openservice'},
            {value: 'bigdata', label: 'bigdata'},
            {value: 'infra', label: 'infra'},
            {value: 'members', label: 'members'},
            {value: 'rdfa', label: 'rdfa'},
            {value: 'iot', label: 'iot'},
            {value: 'middleware', label: 'middleware'},
            {value: 'tradingcenter', label: 'tradingcenter'},
            {value: 'ump', label: 'ump'},
            {value: 'dataapplications', label: 'dataapplications'}
          ],
          initForm: {
            ip: '',
            groupName: '',
            appCode: '',
            env: ''
          },
          initRules: {
            ip: [
              {required: true, message: '此为必填项', trigger: blur}
            ]
          },
          connectApp_dialog:false,
          user_roles: [],
        }
    },
    methods: {
        init() {
            this.$store.dispatch('get_ecs_list').then(res => {
                this.total = res.data.total
                this.tableData = res.data.data
            }).catch(err => {
                console.log(err)
                this.$message({message: '获取数据失败' + err, type: 'error'})
            })
            this.$store.dispatch('get_env').then(res => {
                this.env_options = res.data.data.map(item => {
                    return {value: item.code, label: item.code}
                })
            }).catch(err => {
                console.log(err)
                this.$message({message:'获取数据失败' + err, type: 'error'})
            })
        },
        getList(){
            if(this.select_search !== '' || this.env !== '') {
                const data = {}
                if (this.select_search !== ''){
                  data['appCode'] = this.select_search
                } 
                if (this.env !== ''){
                  data['env'] = this.env
                }
                data['pageNumber'] = this.page
                data['pageSize'] = this.limit
                this.$store.dispatch('query_ecs', data).then(resp => {
                    this.total = resp.data.total
                    this.tableData = resp.data.data
                }).catch(err => {
                  console.log(err)
                  this.$message({message:'获取数据失败' + err, type: 'error'})
                })
            } else {
              this.$store.dispatch('get_ecs_list', {pageNumber: this.page, pageSize: this.limit}).then(res => {
                this.total = res.data.total
                this.tableData = res.data.data
              }).catch(err => {
                console.log(err)
                this.$message({message:'获取数据失败' + err, type: 'error'})
              })
            }
        },
        cellSelfStyle(row, column, rowIndex, columnIndex){
          if(row.columnIndex == 4) {
              if(row.row.instance_status == 'Running'){
                  return 'normal_status'
              } else {
                  return 'error_status'
              }
          }
        },
        rowClick(row, column, e){
          this.$refs.refTable.toggleRowExpansion(row)
        },
        tableRowClassName ({row, rowIndex}) {
        // 把每一行的索引放进row
        row.index = rowIndex;
        },
        searchApp(query){
            if (query !== ''){
              this.loading = true
              this.options = []
              this.$store.dispatch('search_app', {appName: query}).then(resp => {
                const data = resp.data.data
                for (let i=0; i< data.length; i++) {
                    this.options.push({label: data[i].code, value: data[i].code})
                }
                this.loading = false
              }).catch(err => {
                console.log(err)
                this.$message({message: '获取应用数据失败' +err, type: 'error'})
              })
            }
            
        },
        handleFilter() {
            if(this.select_search !== '' || this.env !== '' || this.search_content != '') {
                const data = {}
                if (this.select_search !== ''){
                  data['appCode'] = this.select_search
                } 
                if (this.env !== ''){
                  data['env'] = this.env
                }
                if(isInstanceId(this.search_content)) {
                  data['instanceId'] = this.search_content
                } else {
                  data['ip'] = this.search_content
                }
                this.$store.dispatch('query_ecs', data).then(resp => {
                    this.total = resp.data.total
                    this.tableData = resp.data.data
                }).catch(err => {
                  console.log(err)
                  this.$message({message:'获取数据失败' + err, type: 'error'})
                })
            } else {
                this.$store.dispatch('get_ecs_list', {pageNumber: 1, pageSize: this.limit}).then(res => {
                this.total = res.data.total
                this.tableData = res.data.data
              }).catch(err => {
                console.log(err)
                this.$message({message:'获取数据失败'+ err, type: 'error'})
            })
            }

        },
        handleCommand(command) {
          console.log(command)
          if(command.action==='connectApp'){
            this.connectApp_dialog = true
          }
          
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
        initOpen() {
          this.init_dialog = true
        },
        initSubmit(formName) {
          this.$refs[formName].validate((valid) => {
            if(valid) {
              this.$store.dispatch('init_ecs', this.initForm).then(resp => {
                this.init_dialog = false
                if(resp.data.code == 201){
                  this.$message({message: '初始化请求成功', type: 'success'})
                } else {
                  this.$message({message: '初始化请求失败', type: 'error'})
                }
              }).catch(err => {
                this.init_dialog = false
                this.$message({message: '初始化请求失败' + err, type: 'error'})
              })
            }
          })
        },
        handleDownload() {
          const url = 'http://cmdb-ops.ahotels.tech/export/application/resource/?token=' + getToken()
          window.open(url)
          //this.downloadLoading = true
          // this.$store.dispatch('export_resource2excel').then(resp => {
          //   const data = resp.data
          //   console.log(data)
          // })
          // import('@/components/vendor/export2excel').then(excel => {
          //   const tHeader = ['code', 'name',  '二级域', '三级域', '部门', 'env', 'ip', 'cpu(请求数/限制数)', 
          //                    '内存(请求数/限制数)', '命名空间', 'lable']
          //   const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
          //   const list = this.list
          //   const data = this.formatJson(filterVal, list)
          //   excel.export_json_to_excel({
          //     header: tHeader,
          //     data,
          //     filename: this.filename,
          //     autoWidth: this.autoWidth,
          //     bookType: this.bookType
          //   })
          // this.downloadLoading = false
          // })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        }

    },
    mounted() {
        this.init()
        this.user_roles = this.$store.getters.roles
    }
}
</script>

<style>
  .normal_status {
      color: #009900;
  }
  .error_status {
      color: #ff9900;
  }
  /* #expand-table [class*=" el-icon-"], [class^=el-icon-] {
    display: none;
  }  */
  .el-table__expand-icon>.el-icon {
      display: none;
  } 
  .search {
    margin: 10px;
  }
  .search_input {
    width:250px;
    margin-left: 10px;
  }
</style>


