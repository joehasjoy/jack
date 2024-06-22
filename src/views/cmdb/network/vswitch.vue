<template>
    <div class="app-container">
        <div class="filter-container">
          <el-select
          v-model.trim="env"
          filterable
          clearable
          placeholder="请选择环境"
          style="margin-left:20px;"
          @change="queryVswitch(env)"
          >
            <el-option
            v-for="item in env_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="content">
            <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="vswitch_id"
            label="交换机ID"
            ></el-table-column>
            <el-table-column
            prop="vswitch_name"
            label="交换机名称"
            ></el-table-column>
            <el-table-column
            prop="availableipaddresscount"
            label="可用IP数"
            ></el-table-column>
            <el-table-column
            prop="zone"
            label="可用区"
            ></el-table-column>
            <el-table-column
            prop="description"
            label="备注"
            ></el-table-column>
            <el-table-column
            label="操作"
            align="center">
              <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="editerForienky(scope.row)">新建关联</el-button>
                  <el-button type="text" size="mini" @click="modifyForienky(scope.row)">修改关联</el-button>
              </template>
            </el-table-column>
            </el-table>
            <el-dialog
              title="关联交换机"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose">
              <el-form :model="formData" label-width="70px">
                <el-form-item label="环境" >
                  <el-select v-model="formData.env" style="width: 100%;">
                      <el-option
                       v-for="item in env_options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"
                       ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="交换机ID" >
                   <el-input v-model="formData.vswitch_id" ></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
              </span>
            </el-dialog>

            
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
    </div>
</template>

<script>
import pagination from '@/components/Pagination/pagination'
export default {
    name: 'vswitch_list',
    components: {
      pagination
    },
    data() {
        return {
          env: '',
          env_options: [],
          tableData: [],
          total: 0,
          page:1,
          limit: 10,
          dialogVisible: false,
          formData: {
              env: '',
              vswitch_id: '',
              label: ''
          }
        }
    },
    methods: {
        init() {
            this.$store.dispatch('get_vswitch').then(resp => {
                this.tableData = resp.data.data
                this.total = resp.data.total
            }).catch(err => {
                this.$message({message: err, type: 'error'})
            })
            this.$store.dispatch('get_env').then(res => {
                this.env_options = res.data.data.map(item => {
                    return {value: item.code, label: item.code}
                })
            }).catch(err => {
                console.log(err)
                this.$message({message: err, type: 'error'})
            })
        
        },
        queryVswitch(env){
            this.tableData = []
            if (env == '') {
                this.$store.dispatch('get_vswitch').then(resp => {
                this.tableData = resp.data.data
                this.total = resp.data.total
            }).catch(err => {
                this.$message({message: err, type: 'error'})
            })
            } else {
                this.$store.dispatch('get_vswitch', {env: env}).then(resp => {
                 this.tableData = resp.data.data
                 this.total = resp.data.total
              }).catch(err => {
                  this.$message({message: err, type: 'error'})
              })
            }
        },
        getList(){
            this.tableData = []
            this.$store.dispatch('get_vswitch', {pageSize: this.limit, pageNumber: this.page, env: this.env}).then(resp => {
                this.tableData = resp.data.data
                this.total = resp.data.total
            }).catch(err => {
                this.$message({message: err, type: 'error'})
            })

        },
        editerForienky(row) {
            this.dialogVisible = true
            this.env= ''
            this.formData.vswitch_id = row.vswitch_id
            this.formData.label = 'new'

        },
        modifyForienky(row) {
            this.dialogVisible = true
            this.env = ''
            this.formData.vswitch_id = row.vswitch_id
            this.formData.label = 'modify'

        },
        submitForm(){
            if (this.formData.label == 'new') {
                delete this.formData.label
                this.$store.dispatch('post_vswitch', this.formData).then(resp => {
                  if(resp.data.code == 201) {
                      this.$message({message: '关联成功', type: 'success'})
                  } else {
                      this.$message({message: '关联失败', type: 'error'})
                  }
                }).catch(err => {
                  console.log(err)
                  this.$message({message: err, type: 'error'})
                })
            } else if (this.formData.label == 'modify') {
                delete this.formData.label
                this.$store.dispatch('put_vswitch', this.formData).then(resp => {
                    if(resp.data.code == 201) {
                        this.$message({message: '修改关联成功', type: 'success'})
                    } else {
                        this.$message({message: '修改关联失败', type: 'error'})
                    }
                }).catch(err => {
                    this.$message({message: err, type: 'error'})
                })
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

<style scoped>
 .content{
     margin-top: 20px;
 }
</style>


