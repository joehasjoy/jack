<template>
    <div class="app-container">
        <div class="filter-container">
          <el-button type="primary" size="medium" @click="openAdd">添加业务域</el-button>
        </div>
        <div>
            <el-table
            :data="tableData"
            style="width: 100%">
              <el-table-column 
              label="业务域名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.label }}</span>
                </template>
              </el-table-column>
              <el-table-column 
              label="业务域代号">
                <template slot-scope="scope">
                    <span>{{ scope.row.value }}</span>
                </template>
              </el-table-column>
              <el-table-column
              label="负责人">
                <template slot-scope="scope">
                    <span>{{ scope.row.leader }}</span>
                </template>
              </el-table-column>
              <el-table-column
              label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateDomain(scope.row)">更改</el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <el-dialog
        title="新增业务域"
        :visible.sync="dialogVisible"
        width="30%"
       :before-close="handleClose">
       <el-form :model="orgData" ref="orgData" label-width="100px" :rules="rules">
           <el-form-item label="父级域" prop="parentCode" v-if="domain_list.length > 0">
               <el-cascader
               v-model="orgData.parentCode"
               :options="options"
               :props="{ checkStrictly: true }"
               clearable
               style="width: 100%;"
               @change="changeValue(orgData.parentCode)"></el-cascader>
           </el-form-item>
           <el-form-item label="父级域" prop="parentCode" v-else>
               <el-input v-model="orgData.parentCode"></el-input>
           </el-form-item>
           <el-form-item label="业务域名称" prop="domain">
               <el-input v-model="orgData.domain"></el-input>
           </el-form-item>
           <el-form-item label="业务域代号" prop="domainCode">
               <el-input v-model="orgData.domainCode"></el-input>
           </el-form-item>
           <el-form-item label="负责人" prop="leader">
               <el-input v-model="orgData.leader"></el-input>
           </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="dialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="createSubmit('orgData')">确 定</el-button>
       </span>
      </el-dialog>
      <el-dialog
        title="更新业务域"
        :visible.sync="dialog"
        width="30%"
       :before-close="handleClose">
       <el-form :model="updateOrgData" ref="updateOrgData" label-width="100px" :rules="updateRules">
           <el-form-item label="父级域" prop="parentCode">
               <el-cascader
               v-model="updateOrgData.parentCode"
               :options="options"
               :props="{ checkStrictly: true }"
               clearable
               style="width: 100%;"
               @change="updateValue(updateOrgData.parentCode)"></el-cascader>
           </el-form-item>
           <el-form-item label="业务域名称" prop="domain">
               <el-input v-model="updateOrgData.domain"></el-input>
           </el-form-item>
           <el-form-item label="业务域代号" prop="domainCode">
               <el-input v-model="updateOrgData.domainCode"></el-input>
           </el-form-item>
           <el-form-item label="负责人" prop="leader">
               <el-input v-model="updateOrgData.leader"></el-input>
           </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="dialog = false">取 消</el-button>
         <el-button type="primary" @click="updateSubmit('updateOrgData')">确 定</el-button>
       </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'org_manage',
    data() {
        return {
           dialogVisible: false,
           dialog: false,
           domain_list: [],
           orgData: {
             parentCode: [],
             domain: '',
             domainCode: '',
             leader: ''
           },
           updateOrgData: {
             parentCode: '',
             domain: '',
             domainCode: '',
             leader: ''
           },
           rules: {
               parentCode: [
                   {required: true, message: '此为必填项', trigger: blur}
               ],
               domain: [
                   {required: true, message: '此为必填项', trigger: blur}
               ],
               domainCode: [
                   {required: true, message: '此为必填项', trigger: blur}
               ],
               leader: [
                   {required: true, message: '此为必填项', trigger: blur}
               ]
           },
           updateRules: {
             domainCode: [
                 {required: true, message: '此为必填项', trigger: blur}
             ]
           },
           tableData: []
        }
    },
    methods: {
        init() {
          this.$store.dispatch('get_org').then(resp => {
              this.domain_list = resp.data.data
              this.tableData = []
              this.domain_list.map(item => {
                this.generateTableData(item)
              })
          }).catch(err => {
              this.$message({message: '获取数据失败' + err, type: 'error'})
          })
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
          .catch(_ => {});
      },
      openAdd() {
        this.dialogVisible = true
        this.orgData.parentCode = []
        this.orgData.domain = ''
        this.orgData.domainCode = ''
        this.orgData.leader = ''
      },
      generateOpt(data){
          /*迭代生成级联所需要的数据 */
        const temp = {}
        if(JSON.stringify(data.sublevel) === '{}'){
          temp['value'] = data.domainCode
          temp['label'] = data.domain
        } else {
            const list = []
            data.sublevel.map(item => {
              list.push(this.generateOpt(item))
            })
            temp['value'] = data.domainCode
            temp['label'] = data.domain
            temp['children'] = list
        }
        return temp

      },
      generateTableData(data) {
        /* 生成table所需要的数据格式 */
        const temp = {}
        if(JSON.stringify(data.sublevel) === '{}') {
            temp['value'] = data.domainCode
            temp['label'] = data.domain
            temp['leader'] = data.leader
        } else {
            data.sublevel.map(item => {
                this.generateTableData(item)
            })
            temp['value'] = data.domainCode
            temp['label'] = data.domain
            temp['leader'] = data.leader
        }
        this.tableData.push(temp)
      },
      changeValue(value){
        this.orgData.parentCode = value[value.length - 1]
      },
      updateValue(value) {
        this.updateOrgData.parentCode = value[value.length - 1]
      },
      updateDomain(row) {
        this.updateOrgData.parentCode = []
        this.$store.dispatch('get_org', {domainCode: row.value}).then(resp => {
            if(resp.data.code != 500) {
              const data = resp.data.data
              this.updateOrgData.domainCode = data.domainCode
              this.updateOrgData.domain = data.domain
              this.updateOrgData.leader = data.leader
              this.updateOrgData.parentCode = data.parentleve[0].domainCode
            } else {
                this.$message({message: '没有数据', type: 'error'})
            }
            this.dialog = true
        })
      },
      createSubmit(formName) {
          this.$refs[formName].validate((valid) => {
              if(valid) {
                  this.$store.dispatch('create_org', this.orgData).then(resp => {
                      this.dialogVisible = false
                      if(resp.data.code == 200 || resp.data.code == 201) {
                          this.$message({message: '创建成功', type: 'success'})
                          this.init()
                      } else {
                          this.$message({message: '创建失败' + resp.data.msg, type: 'error'})
                      }
                  }).catch(err => {
                      this.dialogVisible = false
                      this.$message({message: '创建失败' + err, type: 'error'})
                  })
              } else {
                  this.$message({message: '数据不合法', type: 'error'})
              }
          })
      },
      updateSubmit(formName){
        this.$refs[formName].validate((valid) => {
            if(valid) {
                this.$store.dispatch('update_org', this.updateOrgData).then(resp => {
                    this.dialog = false
                    if(resp.data.code == 200 || resp.data.code == 201) {
                        this.$message({message: '更新成功', type: 'success'})
                        this.init()
                    } else {
                        this.$message({message: '更新失败' + resp.data.msg, type: 'error'})
                    }
                }).catch(err => {
                    this.dialog = false
                    this.$message({message: '更新失败' + err, type: 'error'})
                })
            } else {
                this.$message({message: '数据不合法', type: 'error'})
            }
        })
      }
    
    },
    mounted() {
        this.init()
    },
    computed: {
        options () {
            const temp = []
            this.domain_list.map(item => {
               temp.push(this.generateOpt(item))
            })
            return temp
        }
    }
}
</script>
