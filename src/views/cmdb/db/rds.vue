<template>
    <div class="app-container">
        <div class="filter-container">
          <el-select 
          v-model.trim="select_app"
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
          <el-input v-model.trim="domain" placeholder="请输入三级域" style="width:20%;margin-left:20px;" clearable></el-input>
          <el-input v-model.trim="search_content" placeholder="输入实例ID或者连接串查询" style="width:20%;margin-left:20px;" clearable @keyup.enter.native="handleFilter"></el-input>
          <el-button  class="filter-item search" style="margin-left:20px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <div>
            <el-table :data="tableData">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form label-width="120px">
                            <el-form-item label="所关联的应用">
                                <ul v-if="scope.row.app_code.length != 0">
                                    <li v-for="(item, index) in scope.row.app_code" :key="index">{{item}}</li>
                                </ul>
                                <span v-else>无</span>
                            </el-form-item>
                            <el-form-item label="所属域">
                                <ul v-if="scope.row.parent_domain != 0">
                                    <li v-for="(item, index) in scope.row.parent_domain" :key="index">{{item}}</li>
                                </ul>
                                <span v-else>无</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="instanceId" prop="instanceid"></el-table-column>
                <el-table-column label="连接串" prop="internalendpoint"></el-table-column>
                <el-table-column label="环境" prop="env"></el-table-column>
                <el-table-column label="规格" prop="spec"></el-table-column>
                <el-table-column label="版本" prop="version"></el-table-column>
                <el-table-column label="可用区" prop="zone"></el-table-column>
                <el-table-column label="应用列表" prop="app_code"></el-table-column>
                <el-table-column label="所属域" prop="parent_domain"></el-table-column>
                <!-- <el-table-column label="从实例" prop="slave"></el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="addRelation(scope.row)">新增关联</el-button>
                        <el-button type="text" @click="deleteRelation(scope.row)">删除关联</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
        <el-dialog
          title="新增关联"
          :visible.sync="open_add_dialog"
          width="30%"
          :before-close="handleClose">
          <el-form label-width="100px">
              <el-form-item label="InstanceId">
                  <span>{{instance_id}}</span>
              </el-form-item>
              <el-form-item label="应用">
                  <el-select 
                   v-model.trim="add_app"
                   filterable
                   remote
                   placeholder="请输入appId搜索"
                   :loading="loading"
                   :remote-method="addSearchApp"
                   clearable
                  >
                    <el-option v-for="(item, index) in add_options"
                     :key="index"
                     :label="item.label"
                     :value="item.value"
                     ></el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="open_add_dialog = false">取 消</el-button>
            <el-button type="primary" @click="addSubmit">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="取消关联"
          :visible.sync="open_delete_dialog"
          width="30%"
          :before-close="handleClose">
          <el-form label-width="100px">
              <el-form-item label="InstanceId">
                  <span>{{instance_id}}</span>
              </el-form-item>
              <el-form-item label="关联的应用">
                  <el-select v-model="delete_app" clearable>
                      <el-option v-for="(item, index) in delete_options" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="open_delete_dialog = false">取 消</el-button>
            <el-button type="primary" @click="deleteSubmit">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import pagination from '@/components/Pagination/pagination'
import { isRdsInstance } from '@/utils/validate'
export default {
    name: 'rds_manage',
    components: {
      pagination
    },
    data() {
        return {
          tableData: [],
          page: 1,
          limit: 10,
          total: 0,
          select_app: '',
          env: '',
          env_options: [],
          options: [],
          loading: false,
          domain: '',
          search_content: '',
          open_add_dialog: false,
          instance_id: '',
          add_app: '',
          add_options: [],
          delete_options: [],
          open_delete_dialog: false,
          delete_app: ''
        }
    },
    methods: {
        init() {
          this.$store.dispatch('get_rds').then(resp => {
              this.tableData = resp.data.data
              this.total = resp.data.total
          }).catch(err => {
              this.$message({message: '获取数据失败 '+err, type: 'error'})
          })
          this.$store.dispatch('get_env').then(res => {
                this.env_options = res.data.data.map(item => {
                    return {value: item.code, label: item.code}
                })
            }).catch(err => {
                this.$message({message:'获取数据失败' + err, type: 'error'})
            })
        },
        handleFilter(){
          const data = {}
          if(this.select_app != ''){
            data['AppCode'] = this.select_app
          }
          if(this.env != ''){
            data['env'] = this.env
          }
          if(this.domain != '') {
              data['ParentDomain'] = this.domain
          }
          if( this.search_content != '' && isRdsInstance(this.search_content) ) {
            data['InstanceId'] = this.search_content 
          }
          if(this.search_content != '' && !isRdsInstance(this.search_content)){
            data['internalendpoint'] = this.search_content
          }
          this.$store.dispatch('get_rds', data).then(resp => {
              this.tableData = resp.data.data
              this.total = resp.data.total
          }).catch(err => {
              this.$message({message: '获取数据失败 '+err, type: 'error'})
          })
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
                this.$message({message: '获取应用数据失败' +err, type: 'error'})
              })
            }
            
        },
        getList() {
          const data = {}
          if(this.select_app != ''){
            data['AppCode'] = this.select_app
          }
          if(this.env != ''){
            data['env'] = this.env
          }
          if(this.domain != '') {
              data['ParentDomain'] = this.domain
          }
          if( this.search_content != '' && isRdsInstance(this.search_content) ) {
            data['InstanceId'] = this.search_content 
          }
          if(this.search_content != '' && !isRdsInstance(this.search_content)){
            data['internalendpoint'] = this.search_content
          }
          data['pageNumber'] = this.page
          data['pageSize'] = this.limit
          this.$store.dispatch('get_rds', data).then(resp => {
              this.tableData = resp.data.data
              this.total = resp.data.total
          }).catch(err => {
              this.$message({message: '获取数据失败 '+err, type: 'error'})
          })
        },
        addRelation(row){
          this.instance_id = row.instanceid
          this.add_app = ''
          this.add_options = []
          this.open_add_dialog = true
        },
        deleteRelation(row){
          if(row.app_code.length != 0) {
            this.instance_id = row.instanceid
            this.delete_options = []
            this.delete_app = ''
            row.app_code.forEach(item => {
              this.delete_options.push({label: item, value: item})    
            });
            this.open_delete_dialog = true
          } else {
              this.$message({message: '没有关联应用', type: 'error'})
          }
          
        },
        addSubmit(){
          if(this.add_app != ''){
             this.$store.dispatch('add_relation', {instance_id: this.instance_id, appid: this.add_app}).then(resp => {
                 this.open_add_dialog = false
                 if(resp.data.code === 200 || resp.data.code === 201) {
                     this.$message({message: '关联成功', type: 'success'})
                     this.init()
                 } else {
                     this.$message({message: '关联失败 ' +resp.data.msg, type: 'error'})
                 }
             }).catch(err => {
                 this.open_add_dialog = false
                 this.$message({message: '关联失败 '+ err, type: 'error'})
             })
          } else {
              this.open_add_dialog = false
              this.$message({message: 'appid不能为空', type: 'error'})
          }
        },
        addSearchApp(query){
           if (query !== ''){
              this.loading = true
              this.add_options = []
              this.$store.dispatch('search_app', {appName: query}).then(resp => {
                const data = resp.data.data
                for (let i=0; i< data.length; i++) {
                    this.add_options.push({label: data[i].code, value: data[i].appId})
                }
                this.loading = false
              }).catch(err => {
                this.$message({message: '获取应用数据失败' +err, type: 'error'})
              })
            }
        },
        deleteSubmit(){
          if(this.delete_app != ''){
            this.$store.dispatch('delete_relation', {instance_id: this.instance_id, appcode: this.delete_app}).then(resp => {
                this.open_delete_dialog = false
                if(resp.data.code === 200 || resp.data.code === 201) {
                    this.$message({message: '解除关联成功', type: 'success'})
                    this.init()
                } else {
                    this.$message({message: '解除关联失败' +resp.data.msg, type: 'error'})
                }
            }).catch(err => {
                this.open_delete_dialog = false
                this.$message({message: '解除关联失败' +err, type: 'error'})
            })
          } else {
              this.$message({message: '关联的应用不能为空', type: 'error'})
          }
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
          })
          .catch(_ => {});
        }
    },
    mounted(){
      this.init()
    }
}
</script>

<style scoped>
 ul li {
     list-style: none;
 }
</style>