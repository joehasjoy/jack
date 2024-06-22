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
          <el-input v-model.trim="domain" placeholder="请输入三级域" style="width:20%;margin-left:20px;" clearable></el-input>
          <el-input v-model.trim="search_content" placeholder="输入实例ID或者连接串查询" style="width:20%;margin-left:20px;" clearable @keyup.enter.native="handleFilter"></el-input>
          <el-button  class="filter-item search" style="margin-left:20px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
      <div>
        <el-table :data="tableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                  <el-form>
                      <el-form-item label="所属应用">
                          <span v-if="scope.row.app_code.length === 0">无</span>
                          <div v-else>
                              <span v-for="(item, index) in scope.row.app_code" :key="index" style="margin-left:10px;">{{item}}</span>
                          </div>
                      </el-form-item>
                      <el-form-item label="所属域">
                          <span v-if="scope.row.parent_domain.length === 0">无</span>
                          <div v-else>
                              <span v-for="(item,index) in scope.row.parent_domain" :key="index" style="margin-left:10px;">{{item}}</span>
                          </div>
                      </el-form-item>
                      <el-form-item label="模式">
                          <span>{{scope.row.architecture_type}}</span>
                      </el-form-item>
                      <el-form-item label="实例类型">
                          <span>{{scope.row.instance_class}}</span>
                      </el-form-item>
                      <el-form-item label="最大链接数">
                          <span>{{scope.row.connections}}</span>
                      </el-form-item>
                      <el-form-item label="创建时间">
                          <span>{{scope.row.create_time}}</span>
                      </el-form-item>
                      <el-form-item label="到期时间">
                          <span>{{scope.row.end_time}}</span>
                      </el-form-item>
                      <el-form-item label="端口">
                          <span>{{scope.row.port}}</span>
                      </el-form-item>
                      <el-form-item label="region">
                          <span>{{scope.row.region_id}}</span>
                      </el-form-item>
                      <el-form-item label="vswitch id">
                          <span>{{scope.row.vswitch_id}}</span>
                      </el-form-item>
                      <el-form-item label="可用区">
                          <span>{{scope.row.zone_id}}</span>
                      </el-form-item>
                  </el-form>
              </template>
            </el-table-column>
            <el-table-column label="实例ID" prop="instance_id"></el-table-column>
            <el-table-column label="实例名称" prop="instance_name"></el-table-column>
            <el-table-column label="版本" prop="engine_version"></el-table-column>
            <el-table-column label="链接串" prop="connection_domain"></el-table-column>
            <el-table-column label="状态" prop="instance_status"></el-table-column>
            <el-table-column label="网络类型" prop="network_type"></el-table-column>
            <el-table-column label="内网IP" prop="private_ip"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="openAddDialog(scope.row)">新增关联</el-button>
                    <el-button type="text" @click="openDeleteDialog(scope.row)">解除关联</el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
      <el-dialog
        title="新增关联"
        :visible.sync="add_dialog"
        width="30%"
        :before-close="handleClose">
        <el-form label-width="100px">
            <el-form-item label="实例ID">
                <span>{{instance_id}}</span>
            </el-form-item>
            <el-form-item label="应用">
                <el-select 
                v-model.trim="add_app"
                filterable
                remote
                placeholder="请输入appId搜索"
                :loading="add_loading"
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
            <el-button @click="add_dialog = false">取 消</el-button>
            <el-button type="primary" @click="addSubmit">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="取消关联"
          :visible.sync="delete_dialog"
          width="30%"
          :before-close="handleClose">
          <el-form label-width="100px">
              <el-form-item label="实例ID">
                  <span>{{instance_id}}</span>
              </el-form-item>
              <el-form-item label="关联的应用">
                  <el-select v-model="delete_app" clearable>
                      <el-option v-for="(item, index) in delete_options" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delete_dialog = false">取 消</el-button>
            <el-button type="primary" @click="deleteSubmit">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    
</template>

<script>
import pagination from '@/components/Pagination/pagination'
import { isRedisInstance } from '@/utils/validate'
export default {
    name: 'redis_manage',
    components: {
      pagination,
    },
    data() {
        return {
          tableData:[],
          total: 0,
          page: 1,
          limit: 10,
          select_app: '',
          options: [],
          loading: false,
          domain: '',
          search_content: '',
          add_dialog: false,
          delete_dialog: false,
          add_app: '',
          add_loading: false,
          add_options: [],
          instance_id: '',
          delete_app: '',
          delete_options: []
        }
    },
    methods: {
        init(){
          this.$store.dispatch('get_redis').then(resp => {
              this.tableData = resp.data.data
              this.total = resp.data.total
          }).catch(err => {
              this.$message({message: '获取数据失败 ' +err, type: 'error'})
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
        addSearchApp(query){
          if (query !== ''){
              this.add_loading = true
              this.add_options = []
              this.$store.dispatch('search_app', {appName: query}).then(resp => {
                const data = resp.data.data
                for (let i=0; i< data.length; i++) {
                    this.add_options.push({label: data[i].code, value: data[i].appId})
                }
                this.add_loading = false
              }).catch(err => {
                this.$message({message: '获取应用数据失败' +err, type: 'error'})
              })
            }
        },
        handleFilter(){
          const data = {}
          if(this.select_app != ''){
            data['AppCode'] = this.select_app
          }
          if(this.domain != ''){
            data['ParentDomain'] = this.domain 
          }
          if(isRedisInstance(this.search_content)){
            data['InstanceId'] = this.search_content 
          } else {
              data['ConnectionDomain'] = this.search_content
          }
          this.$store.dispatch('get_redis', data).then(resp => {
              this.tableData = resp.data.data
              this.total = resp.data.total
          }).catch(err => {
              this.$message({message: '获取数据失败 '+err, type: 'error'})
          })
        },
        getList(){
          const data = {}
          if(this.select_app != ''){
            data['AppCode'] = this.select_app
          }
          if(this.domain != ''){
            data['ParentDomain'] = this.domain 
          }
          if(isRedisInstance(this.search_content)){
            data['InstanceId'] = this.search_content 
          } else {
              data['ConnectionDomain'] = this.search_content
          }
          data['pageSize'] = this.limit
          data['pageNumber'] = this.page
          this.$store.dispatch('get_redis', data).then(resp => {
              this.tableData = resp.data.data
              this.total = resp.data.total
          }).catch(err => {
              this.$message({message: '获取数据失败 '+err, type: 'error'})
          })
        },
        openAddDialog(row) {
          this.instance_id = row.instance_id
          this.add_app = ''
          this.add_options = []
          this.add_dialog = true
        },
        openDeleteDialog(row) {
          if(row.app_code.length != 0) {
            this.instance_id = row.instance_id
            this.delete_options = []
            this.delete_app = ''
            row.app_code.forEach(item => {
              this.delete_options.push({label: item, value: item})    
            });
            this.delete_dialog = true
          } else {
              this.$message({message: '没有关联应用', type: 'error'})
          }
        },
        addSubmit(){
          if(this.add_app === ''){
            this.$message({message: 'appid不能为空', type: 'error'})
          } else {
              this.$store.dispatch('redis_add_relation', {instance_id: this.instance_id, appid: this.add_app}).then(resp => {
                  this.add_dialog = false
                  if(resp.data.code === 200 || resp.data.code === 201) {
                      this.$message({message: '关联应用成功', type: 'success'})
                      this.init()
                  } else {
                      this.$message({message: '关联应用失败 '+ resp.data.msg, type: 'error'})
                  }
              }).catch(err => {
                  this.add_dialog = false
                  this.$message({message: '关联应用失败 '+err, type: 'error'})
              })
          }
        },
        deleteSubmit(){
          if(this.delete_app != ''){
            this.$store.dispatch('redis_delete_relation', {instance_id: this.instance_id, appcode: this.delete_app}).then(resp => {
                this.delete_dialog = false
                if(resp.data.code === 200 || resp.data.code === 201) {
                    this.$message({message: '解除关联成功', type: 'success'})
                    this.init()
                } else {
                    this.$message({message: '解除关联失败' +resp.data.msg, type: 'error'})
                }
            }).catch(err => {
                this.delete_dialog = false
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
    mounted() {
        this.init()
    }
}
</script>