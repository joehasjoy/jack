<template>
  <div>
    <div class="menu">
      <span class="title">工单选项</span>
      <el-radio-group v-model="radio2">
        <el-radio v-for="(item, index) in workflows" :key="index" :label="item.id" @change="handleWorkflow">{{item.name}}</el-radio>
      </el-radio-group> 
    </div>
    <div class="bottom" v-if="workflow_id===-1">
     <span>请选择工单类型</span>
    </div>
    <div class="content" v-else-if="workflow_id >= 1">
    <div >
      <!-- <Form :model="newForm" :rules="newFormRules" ref="newForm" :label-width="150">
        
        <Row>
          <Col :md="{span: item.field_type_id === 55 ? 22 : 11}" v-for="(item, index) in newForm.datas" :key="index">
            <FormItem :label="item.name || item.field_name" :prop="'datas.' + index + '.field_value'" :rules="newFormRules[item.field_key]" style="font-size:8px">
              <Input v-if="item.field_type_id===5"  v-model="item.field_value" placeholder="请输入"></Input>
              <InputNumber v-if="item.field_type_id===15" v-model="item.field_value" :step="0.5" :min="0" style="width: 100%"></InputNumber>
              <DatePicker v-if="item.field_type_id===30" v-model="item.field_value"  type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width:100%"></DatePicker>
              <DatePicker v-if="item.field_type_id===25" v-model="item.field_value" type="date"  format="yyyy-MM-dd" ></DatePicker>
               
              <Select v-if="item.field_type_id === 40" v-model="item.field_value" multiple></Select>
              <Select v-if="item.field_type_id===45" v-model="item.field_value" filterable clearable  placeholder="请搜索">
                <Option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </Option>
              </Select>
              <Select v-if="item.field_type_id===35" v-model="item.field_value" filterable clearable  placeholder="请搜索">
                <Option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </Option>
              </Select>
              <Select v-if="item.field_type_id===50" v-model="item.field_value" multiple  placeholder="请选择">
                <Option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </Option>
              </Select>
              
              <div v-if="item.field_type_id===55">
                 <editor :height="400" v-model="item.field_value"></editor>
              </div>
             
            </FormItem>  
          </Col>        
        </Row>
        <FormItem style="text-align: center;">
          <Button v-for="(btn, b) in init_data.transition" :key="b" @click="handleButton('newForm', btn.transition_id)"  type='primary' style="margin: 0 5px;" >{{btn.transition_name}}</Button>
          <Button type="warning" style="margin: 0 5px;" @click="reset('newForm')">取消</Button>
        </FormItem>
    
     </Form> -->
      <el-form :model="newForm" :rules="newFormRules" ref="newForm" label-width="150px" size="small">
        
        <el-row>
          <el-col :md="{span: item.field_type_id === 55 ? 22 : 11}" v-for="(item, index) in newForm.datas" :key="index">
            <el-form-item :label="item.name || item.field_name" :prop="'datas.' + index + '.field_value'" :rules="newFormRules[item.field_key]" style="font-size:8px">
              <el-input v-if="item.field_type_id===5"  v-model.trim="item.field_value" placeholder="请输入"></el-input>
              <el-input-number v-if="item.field_type_id===15" v-model="item.field_value" :step="0.5" :min="0" :max="30" style="width: 100%"></el-input-number>
              <el-date-picker v-if="item.field_type_id===30" v-model="item.field_value"  type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width:100%"></el-date-picker>
              <el-date-picker v-if="item.field_type_id===25" v-model="item.field_value" type="date"  format="yyyy-MM-dd" ></el-date-picker>
               
              <el-select v-if="item.field_type_id === 40" v-model="item.field_value" multiple placeholder="请选择" style="width: 100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </el-option>
              </el-select>
              <el-select v-if="item.field_type_id===45" v-model="item.field_value" filterable clearable  placeholder="请搜索" style="width: 100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </el-option>
              </el-select>
              <el-select v-if="item.field_type_id===35" v-model="item.field_value" filterable clearable  placeholder="请搜索" style="width: 100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </el-option>
              </el-select>
              <el-select v-if="item.field_type_id===50" v-model="item.field_value" multiple  placeholder="请选择" style="width: 100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </el-option>
              </el-select>
              
              <div v-if="item.field_type_id===55">
                 <editor :height="400" v-model="item.field_value"></editor>
              </div>
             
            </el-form-item>  
          </el-col>        
        </el-row>
        <el-form-item style="text-align: center;">
          <el-button v-for="(btn, b) in init_data.transition" :key="b" @click="handleButton('newForm', btn.transition_id)"  type='primary' style="margin: 0 5px;" >{{btn.transition_name}}</el-button>
          <el-button type="warning" style="margin: 0 5px;" @click="reset('newForm')">取消</el-button>
        </el-form-item>
    
     </el-form>
     </div>
    </div>
    <div class="bottom" v-else-if="workflow_id === -2">
      <span>您没有权限创建此工单</span>
    </div>
    <div class="bottom" v-else>
      <span>工作流未配置正确，请联系管理员</span>
    </div>
  </div>
</template>


<script>

import { validateNumber } from '@/utils/validate'
import editor from '@/components/Tinymce/index'
import Validators from '@/utils/validators'
import {Date} from '@/utils/datetime'

export default {
  name: 'new',
  components: {
    editor
  },
  data () {
    return {
      loading: false,
      workflows: [],
      workflow_id: -1,
      radio2: false,
      init_data: {},
      msg: '',
      
    }
  },
  methods: {
    init () {
      this.loading = true
      this.$store.dispatch('api_workflows').then(resp => {
        this.workflows = resp.data.data.value 
        this.loading = false
      })
    },
    
    handleWorkflow(flowid) {
      /* 初始化工作流 */
      this.$store.dispatch('init_workflow', flowid).then(resp => {
        this.init_data = resp.data.data
        if (resp.data.data === ''){
            this.workflow_id = -2
        } else if (validateNumber(resp.data.data.workflow_id)){
          this.workflow_id = resp.data.data.workflow_id
        } else {
          this.workflow_id = -1
        }

      }).catch(err => {
        console.log(err)
        this.workflow_id = null
      }) 
    },
    handleButton(formName, id) {
      let temp = {}
      for (let i = 0; i < this.newForm.datas.length; i++){
        let k = this.newForm.datas[i].field_key
        temp[k] = this.newForm.datas[i].field_value
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            workflow_id: this.workflow_id,
            transition_id: id
          }
          Object.assign(data, temp)
          for (let i = 0; i < Object.keys(this.newForm.datas).length; i++) {
            let k = this.newForm.datas[i].field_key
            if ([25, 30].includes(this.newForm.datas[i].field_type_id)) {
              data[k] = data[k].format("yyyy-MM-dd hh:mm:ss")
            }
            if ([40, 50, 70].includes(this.newForm.datas[i].field_type_id)) {
              data[k] = data[k].join(',')
            }
          }
          this.$store.dispatch('create_ticket', data).then(resp => {
            if (resp.data.code == 0){
              const ticket_id = resp.data.data.ticket_id
              this.$message({message: '创建成功', type: 'success'})
              this.$router.push({name: 'detail', params: {id: ticket_id}})
            }
            if (resp.data.code == -1) {
              this.$message({message: resp.data.msg, type: 'error'})
            }
          }).catch(err => {
            console.log(err)
            this.$message({type: 'error', message: '创建失败 '})
          })
        } else {
          console.log("submit error")
          return false
        }
      })
    },
    reset(formName){
      this.$refs[formName].resetFields()
    },
  },
  
  computed: {
    fieldEmpty () {
      for (let i in this.init_data.field_list) {
        return false
      }
      return true
    },
    newFormRules () {
      let vali = {}
      let temp = this.init_data.field_list
      temp.map(item => {
        if (item.field_attribute === 2) {
          if ([5, 35, 45, 55, 60].includes(item.field_type_id)) {
            vali[item.field_key] = {validator: Validators.string, type: 'string', trigger: 'blur'}
          } else if ([25, 30].includes(item.field_type_id)) {
            vali[item.field_key] = {validator: Validators.datetime, type: 'date', trigger: 'blur'}
          } else if ([40, 50, 70].includes(item.field_type_id)) {
            vali[item.field_key] = {required: true, type: 'array', trigger: 'blur', message: '不能为空'}
          } else if ([10, 15].includes(item.field_type_id)) {
            vali[item.field_key] = {validator: Validators.number, type: 'number', trigger: 'blur'}
          } else if (item.field_type_id === 20) {
            vali[item.field_type_id] = {required: true, type: 'boolean', trigger: 'blur', message: '不能为空'}
          }
        }
      })
      return vali
    },
    newForm () {
      let data = {}
      let form = []
      let temp = this.init_data.field_list
      for (let i = 0; i < temp.length; i++) {
        if ([40, 50, 70].includes(temp[i].field_type_id)) {
          temp[i].field_value = []
          form.push(temp[i])
        } else if ([10, 15].includes(temp[i].field_type_id)) {
          temp[i].field_value = 0
          form.push(temp[i])
        } else {
          temp[i].field_value = ''
          form.push(temp[i])
        }
      }
      data['datas'] = form
      return data
    }
  },
  created () {
    this.init()
    
  }
}
</script>

<style scoped>
  .menu{
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #e6e6e6;
  }
  .title {
    margin-left: 30px;
    margin-right: 50px;
    font-size: 22px;
    font-weight: bold
  }
  .bottom {
    margin-left: 30px;
    margin-top: 20px; 
    height: 40px;
    line-height: 40px;
  }
  .bottom span{
    font-size: 22px;
    color: brown;
    margin: 0, auto;
  }
  .content {
    margin-left: 30px;
    margin-top: 20px;
  }

  .font-style{
    font-size: 12px;
    font-family: "微软雅黑"
  }
</style>
