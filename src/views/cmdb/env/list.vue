<template>
  <div class="app-container"> 
      <div class="filter-container" style="float:right;">
          <el-button type="warning" round size="mini" @click="changeDial">新建环境</el-button>
      </div>
      <div>
          <el-table
          :data="tableData">
          <el-table-column
          prop="code"
          label="环境"
          ></el-table-column>
          <el-table-column
          prop="remarks"
          label="说明"
          ></el-table-column>
          </el-table>
      </div>
      <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" >
        <el-form-item label="环境名" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="中文说明" prop="remarks">
          <el-input v-model="ruleForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createEnv('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
    
</template>

<script>
export default {
    name: 'env_list',
    data() {
        return {
          tableData: [],
          dialogVisible: false,
          ruleForm: {
              code: '',
              remarks: '',
          },
          rules: {
              code: [
                  {required: true, message: '此为必填项',trigger: 'blur'}
              ]
          }
        }
    },
    methods: {
        init(){
          this.$store.dispatch('get_env').then(resp => {
              this.tableData = resp.data.data
          })
        },
        createEnv(Formname){
          this.$refs[Formname].validate((valid) => {
            if (valid) {
                this.$store.dispatch('create_env', this.ruleForm).then(resp => {
                    console.log(resp)
                    if (resp.data.code == 201) {
                        this.dialogVisible = false
                        this.$message({message: '创建成功', type: 'success'})
                        this.init()
                    } else {
                        this.$message({message: '创建不成功', type: 'error'})
                    }
                })
            } else {
                console.log('invalid data')
                this.$message({message: 'invalid data', type: 'error'})
            }
          })

        },
        changeDial(){
          this.dialogVisible = true
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

</style>


