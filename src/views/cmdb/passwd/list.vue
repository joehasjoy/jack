<template>
  <div class="app-container">
      <div class="filter-container">
         <el-input placeholder="请输入关键字搜索" v-model.trim="search_data"  
         class="filter-item search-input" 
         @keyup.enter.native="handleFilter"
         clearable
         prefix-icon="el-icon-search"
         />
      <el-button  class="filter-item search" type="primary" icon="el-icon-search" 
      @click="handleFilter">搜索</el-button>
      <el-button type="primary" class="float-button" @click="openAdd">新增密码</el-button>
      </div>
      <div>
        <el-table
        :data="tableData"
        style="width:100%;">
          <el-table-column type="expand">
              <template slot-scope="scope">
                  <el-form>
                      <el-form-item label="密码">
                          <span>{{ scope.row.password }}</span>
                      </el-form-item>
                      <el-form-item label="备注">
                          <span>{{ scope.row.remarks }}</span>
                      </el-form-item>
                  </el-form>
              </template>
          </el-table-column>
          <el-table-column
          label="产品">
            <template slot-scope="scope">
                <span>{{ scope.row.product }}</span>
            </template>
          </el-table-column>
          <el-table-column
          label="名称">
            <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
          label="地址">
            <template slot-scope="scope">
                <span> {{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column
          label="用户">
            <template slot-scope="scope">
                <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="success" @click="openModify(scope.row)" size="mini" icon="el-icon-edit"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="openDelete(scope.row)"></el-button>
              </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
      </div>
      <el-dialog
     title="新增项目密码"
     :visible.sync="openDialog"
     width="30%"
     :before-close="handleClose">
       <el-form label-width="80px" :model="addFormData" ref="addFormData" :rules="addRules">
           <el-form-item label="产品" prop="product">
               <el-input v-model.trim="addFormData.product"></el-input>
           </el-form-item>
           <el-form-item label="名称" prop="name">
               <el-input v-model.trim="addFormData.name"></el-input>
           </el-form-item>
           <el-form-item label="地址" prop="address">
               <el-input v-model.trim="addFormData.address"></el-input>
           </el-form-item>
           <el-form-item label="用户名" prop="username">
               <el-input v-model.trim="addFormData.username"></el-input>
           </el-form-item>
           <el-form-item label="密码" prop="password">
               <el-input  v-model.trim="addFormData.password"></el-input>
           </el-form-item>
           <el-form-item label="备注" prop="remarks">
               <el-input type="textarea" v-model.trim="addFormData.remarks"></el-input>
           </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="openDialog = false">取 消</el-button>
         <el-button type="primary" @click="addSubmit('addFormData')">确 定</el-button>
      </span>
     </el-dialog>
     <el-dialog
     title="更新项目密码"
     :visible.sync="modifyDialog"
     width="30%"
     :before-close="handleClose">
       <el-form label-width="60px" :model="modifyFormData" ref="modifyFormData" :rules="modifyRules">
           <el-form-item label="产品" prop="product">
               <el-input v-model.trim="modifyFormData.product"></el-input>
           </el-form-item>
           <el-form-item label="名称" prop="name">
               <el-input v-model.trim="modifyFormData.name"></el-input>
           </el-form-item>
           <el-form-item label="地址" prop="address">
               <el-input v-model.trim="modifyFormData.address"></el-input>
           </el-form-item>
           <el-form-item label="用户名" prop="username">
               <el-input v-model.trim="modifyFormData.username"></el-input>
           </el-form-item>
           <el-form-item label="密码" prop="password">
               <el-input  v-model.trim="modifyFormData.password"></el-input>
           </el-form-item>
           <el-form-item label="备注" prop="remarks">
               <el-input type="textarea" v-model.trim="modifyFormData.remarks"></el-input>
           </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="modifyDialog = false">取 消</el-button>
         <el-button type="primary" @click="modifySubmit('modifyFormData')">确 定</el-button>
      </span>
     </el-dialog>
     <el-dialog
     title="⚠️删除项目密码"
     :visible.sync="deleteDialog"
     width="30%"
     :before-close="handleClose">
       <span>确认删除 {{delete_content}} 吗?</span>
       <span slot="footer" class="dialog-footer">
         <el-button @click="deleteDialog = false">取 消</el-button>
         <el-button type="primary" @click="deleteSubmit">确 定</el-button>
      </span>
     </el-dialog>
  </div>
    
</template>

<script>
import pagination from '@/components/Pagination/pagination'
export default {
    name: 'passwd_manage',
    components: {
      pagination
    },
    data() {
        return {
          total: 0,
          page: 1,
          limit: 10,
          tableData: [],
          search_data: '',
          openDialog: false,
          modifyDialog: false,
          deleteDialog: false,
          delete_content: '',
          addFormData: {
              product: '',
              name: '',
              address: '',
              username: '',
              password: '',
              remarks: ''
          },
          addRules: {
              product: [
                  {required: true, message: '此为必填项', trigger: blur}
              ],
              name: [
                  {required: true, message: '此为必填项', trigger: blur}
              ],
              username: [
                  {required: true, message: '此为必填项', trigger: blur}
              ],
              password: [
                  {required: true, message:'此为必填项', trigger: blur}
              ]
          },
          modifyFormData: {
              product: '',
              name: '',
              address: '',
              username: '',
              password: '',
              remarks: ''
          },
          modifyRules: {
              name: [
                  {required: true, message: '此为必填项', trigger: blur}
              ]
          }
        }
    },
    methods: {
        init() {
          this.$store.dispatch('get_passwd').then(resp => {
              this.tableData = resp.data.data
              this.total = resp.data.total
          })
        },
        handleFilter() {
            this.tableData = []
            if(this.search_data != '') {
                this.$store.dispatch('get_passwd', {name: this.search_data}).then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                }).catch(err => {
                    this.$message({message: '获取数据失败' + err, type: 'error'})
                })
            } else {
                this.init()
            }
        },
        getList() {
            this.tableData = []
            if(this.search_data != '') {
                this.$store.dispatch('get_passwd', {name: this.search_data, pageNumber: this.page,pageSize: this.limit}).then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                }).catch(err => {
                    this.$message({message: '获取数据失败' + err, type: 'error'})
                })
            } else {
                this.$store.dispatch('get_passwd', {pageNumber: this.page,pageSize: this.limit}).then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                }).catch(err => {
                    this.$message({message: '获取数据失败' + err, type: 'error'})
                })
            }
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
        openAdd() {
          this.openDialog = true
        },
        addSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    this.$store.dispatch('create_passwd', this.addFormData).then(resp => {
                        this.openDialog = false
                        if(resp.data.code == 201 || resp.data.code == 200) {
                            this.$message({message: '新增成功', type: 'success'})
                            this.init()
                        } else {
                            this.$message({message: '新增失败', type: 'error'})
                        }
                    }).catch(err => {
                        this.openDialog = false
                        this.$message({message: '新增失败' + err, type: 'error'})
                    })
                } else {
                  this.openDialog = false
                  this.$message({message: '数据不合法', type: 'error'})
                }
            })
        },
        openModify(row){
          this.modifyFormData = row
          this.modifyDialog = true
        },
        modifySubmit(formName) {
          this.$refs[formName].validate((valid) => {
              if(valid) {
                  this.modifyDialog = false
                  this.$store.dispatch('modify_passwd', this.modifyFormData).then(resp => {
                      if(resp.data.code == 201 || resp.data.code == 200) {
                            this.$message({message: '更新成功', type: 'success'})
                            this.init()
                        } else {
                            this.$message({message: '更新失败', type: 'error'})
                        }
                  }).catch(err => {
                      this.$message({message: '更新失败' + err, type: 'error'})
                  })
              } else {
                  this.modifyDialog = false
                  this.$message({message: '数据不合法', type: 'error'})
              }
          })
        },
        openDelete(row) {
          this.delete_content = row.name
          this.deleteDialog = true
        },
        deleteSubmit(){
          if(this.delete_content != '') {
              this.deleteDialog = false
              this.$store.dispatch('delete_passwd',{name: this.delete_content}).then(resp => {
                  if(resp.data.code == 200 || resp.data.code == 201) {
                      this.$message({message: '删除成功', type: 'success'})
                      this.init()
                  } else {
                      this.$message({message: '删除失败' + resp.data.msg, type: 'error'})
                  }
              }).catch(err => {
                  this.$message({message: '删除失败' + err, type: 'error'})
              })
          } else {
              this.deleteDialog = false
              this.$message({message: '删除名称不能为空', type: 'error'})
          }
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style scoped>
.search-input{
    width: 200px;
    margin-left:20px;
}
.search {
    margin-left: 15px;
}
.float-button {
    float: right;
}
</style>
