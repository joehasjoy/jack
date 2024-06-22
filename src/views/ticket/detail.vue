<template>
  <div v-if="status === 0">
    <el-steps :active="active" align-center class="top">
      <el-step v-for="(step, index) in setps" :key="index" :title="step.state_name" description=""></el-step>
    </el-steps>
    <p class="con">工单详情</p>
    <div >
      <el-form :model="detailForm"  ref="detailForm" label-width="150px" size="small">
        <el-row >
          <el-col :md="{span: item.field_type_id === 55 ? 22 : 11}" v-for="(item, index) in detailForm.datas" :key="index">
            <template v-if="item.field_attribute === 2">
              <el-form-item :label="item.field_name" :prop="'datas.' + index + '.field_value'" :rules="detailFormRules[item.field_key]">
                <el-input v-if="item.field_type_id === 5" v-model.trim="item.field_value"></el-input>
              <el-input-number v-if="item.field_type_id === 15" v-model="item.field_value" :step="0.5" :min="0" >
              </el-input-number>
              <el-date-picker v-if="item.field_type_id === 30" v-model="item.field_value" type="datetime" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              <el-date-picker v-if="item.field_type_id === 25" v-model="item.field_value" type="date" format="yyyy-MM-dd"></el-date-picker>
              <el-radio-group v-if="item.field_type_id === 35" v-model="item.field_value">
                <el-radio v-for="(choice, i) in Object.keys(item.field_choice)" :key="i" :label="choice">{{item.field_choice[choice]}}</el-radio>
              </el-radio-group>
              <el-select v-if="item.field_type_id === 40" v-model="item.field_value" multiple placeholder="请选择" style="width: 100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </el-option>
              </el-select>
              <el-select v-if="item.field_type_id === 45" v-model="item.field_value" filterable clearable style="width:100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice"></el-option>
              </el-select>
              <el-select v-if="item.field_type_id === 50" v-model="item.field_value" multiple style="width:100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice"></el-option>
              </el-select>
              <el-input v-if="item.field_type_id === 55" v-model="item.field_value" type="textarea"></el-input>
            </el-form-item>
          </template>
          <template v-else-if="item.field_attribute === 3">
            <el-form-item :label="item.field_name">
              <el-input v-if="item.field_type_id === 5" v-model.trim="item.field_value"></el-input> 
              <el-input-number v-else-if="item.field_type_id === 15" v-model="item.field_value"></el-input-number>
              <el-date-picker v-else-if="item.field_type_id === 25" v-model="item.field_value" type="date" format="yyyy-MM-dd"></el-date-picker>
              <el-date-picker v-else-if="item.field_type_id === 30" v-model="item.field_value" type="datetime" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              <el-radio-group v-else-if="item.field_type_id === 35" v-model="item.field_value">
                <el-radio v-for="(choice, i) in Object.keys(item.field_choice)" :key="i" :label="choice">{{item.field_choice[choice]}}</el-radio>
              </el-radio-group>
              <el-select v-if="item.field_type_id === 40" v-model="item.field_value" multiple placeholder="请选择" style="width: 100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice">
                </el-option>
              </el-select>
              <el-select v-else-if="item.field_type_id === 45" v-model="item.field_value" filterable clearable style="width:100%">
                <el-option v-for="k in Object.keys(item.field_choice)" :key="k" :label="item.field_choice[k]" :value="k"></el-option>
              </el-select>
              <el-select v-else-if="item.field_type_id === 50" v-model="item.field_value" multiple>
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice"></el-option>
              </el-select>
              <el-input v-else-if="item.field_type_id === 55" v-model="item.field_value" type="textarea"></el-input>
            </el-form-item>
            
          </template>
          <template v-else-if="item.field_attribute === 1">
            <el-form-item :label="item.field_name">
              <el-input v-if="item.field_type_id === 5" v-model.trim="item.field_value" :disabled="true"></el-input>
              <el-input-number v-else-if="item.field_type_id === 15" v-model="item.field_value" :disabled="true"></el-input-number>
              <div class="disabled_field" v-else-if="item.field_type_id === 35">
                <span>{{item.field_choice[item.field_value]}}</span>
              </div>
              <div class="disabled_field" v-else-if="item.field_type_id === 50">
                <span v-for="(k, i) in item.field_value" :key="i" v-html="item.field_choice[k]" style="padding-left:10px"></span>
              </div>
              <el-select v-else-if="item.field_type_id === 45" :disabled="true" v-model="item.field_value" style="width: 100%">
                <el-option v-for="choice in Object.keys(item.field_choice)" :key="choice" :label="item.field_choice[choice]" :value="choice"></el-option>
              </el-select>
              <div class="disabled_field" v-else-if="item.field_type_id === 40">
                <span v-for="(val, index) in item.field_value || item.value" :key="index">{{item.field_choice[val]}}</span>
              </div>
              <el-input v-else-if="item.field_type_id === 55" v-model="item.field_value" type="textarea" :disabled="true"></el-input>
              <el-input v-else v-model="item.field_value" :disabled="true"></el-input>
            </el-form-item>
          </template>
          </el-col>
          <el-col :md="{span: 22}" v-if="transitions.length > 0">
            <el-form-item label="处理建议">
              <el-input type="textarea" v-model.trim="suggestion" placeholder="处理意见"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="{span: 22, offset: 2}">
            <el-button v-for="(btn, i) in transitions" :key="i" type="primary" style="margin: 10px 10px;" size="small" @click="handleTicketTransition('detailForm', btn)">
              {{btn.transition_name}}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    
    <div class="block" style="width: 400px;">
      <p class="con">工单流转记录</p>
      <el-timeline  style="margin: 40px 60px;">
        <el-timeline-item
          v-for="(k, index) in logtable"
         :key="index"
         :timestamp="k.gmt_created"
         placement="top">
         
          <el-card>
            <h3>{{k.state.state_name}}</h3>
            <p>
              <span>由</span>
              <span>{{k.participant_alias}}</span>
              <span>在{{k.gmt_created}}</span>
              <span>{{k.transition.transition_name}}</span>
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
  <div v-else-if="status === -1" class="bottom">
    <span>此工单数据可能已损坏，请联系管理员</span>
  </div>
</template>

<script>
import Validators from '@/utils/validators'
import {Date} from '@/utils/datetime'
export default {
  name: 'detail',
  data(){
    return {
      setps: [],
      ticket: {},
      workflow: {},
      logtable: {},
      transitions: {},
      detailForm: {},
      detailFormRules: {},
      suggestion: '',
      status: 0
    }
  },
  methods: {
    init(){
      this.$store.dispatch('get_ticket_detail', this.ticket_id).then(resp => {
        this.ticket = resp.data.data.value
        if (resp.data.code === -1){
          this.status = -1
          this.$message({message: '服务端报错，请联系管理员', type: 'error'})
        }
        const workflow_id = this.ticket.workflow_id
        this.$store.dispatch('api_workflows').then(resp => {
          let workflows = resp.data.data.value
          this.workflow = workflows.filter(item => {
            if (item.id === workflow_id){
              return true
            }
          })[0]
        }).catch(err => {
          console.log(err)
          this.$message({message: '获取工作流数据失败', type: 'error'})
        })
  
        this.$store.dispatch('get_ticket_step_list', this.ticket_id).then(resp => {
        this.setps = resp.data.data.value
      }).catch(err => {
        this.$message({message: '获取工单节点失败', type: 'error'})
      })

      this.$store.dispatch('get_ticket_flowlog', this.ticket_id).then(resp => {
        this.logtable = resp.data.data.value
      }).catch(err => {
        this.$message({message: '获取工单日志失败', type: 'error'})
      })
      
      this.$store.dispatch('get_ticket_transitions', this.ticket_id).then(resp => {
        this.transitions = resp.data.data.value
      }).catch(err => {
        this.$message({message: '获取工单流转数据失败', type: 'error'})
      })
      
    }).catch(err => {
      console.log(err)
      this.$message({message: '获取工单详情失败', type: 'error'})
    })
    
    },

    handleTicketTransition(forName, btn) {
      this.$refs[forName].validate(valid => {
        if (valid) {
          let data = {
            id: this.ticket.id,
            data: {
              transition_id: btn.transition_id,
              suggestion: this.suggestion ? this.suggestion: btn.transition_name
            }
          }
          let formData = {}
          for (let i=0; i < this.detailForm.datas.length; i++){
            let k = this.detailForm.datas[i].field_key
            formData[k] = this.detailForm.datas[i].field_value
          }
          for (let i=0; i < this.detailForm.datas.length; i++){
            if (this.detailForm.datas[i].field_attribute === 2 || this.detailForm.datas[i].field_attribute === 3){
              let k = this.detailForm.datas[i].field_key
              if ([25,30].includes(this.detailForm.datas[i].field_type_id)){
                formData[k] = formData[k].format('yyyy-MM-dd hh:mm:ss')
              }
              if ([40,50,70].includes(this.detailForm.datas[i].field_type_id)){
                formData[k] = formData[k].join(',')
              }
            }
          }
          Object.assign(data.data, formData)
          this.$store.dispatch('handle_ticket_action', data).then(resp => {
            if (resp.data.code === 0){
              this.$message({message: '处理成功', type: 'success'})
              this.$router.push({name: 'todo'})
            }
            if (resp.data.code === -1) {
              this.$message({message: resp.data.msg, type: 'error'})
            }
          }).catch(err => {
            this.$message({message: err, type: 'error'})
          })
        } else {
          console.log('invalid form data')
          return false
        }
      })
      if (this.detailForm.datas.length === 0) {
        let data = {
            id: this.ticket.id,
            data: {
              transition_id: btn.transition_id,
              suggestion: this.suggestion ? this.suggestion: btn.transition_name
            }
          }
        this.$store.dispatch('handle_ticket_action', data).then(resp => {
          if (resp.data.code === 0){
              this.$message({message: '处理成功', type: 'success'})
              this.$router.push({name: 'todo'})
            }
            if (resp.data.code === -1) {
              this.$message({message: resp.data.msg, type: 'error'})
            }
        }).catch(err => {
            this.$message({message: err, type: 'error'})
        })  
      }
    }

  
  },
  computed: {
    ticket_id () {
      return this.$route.params.id
    },
    active(){
      let temp = 1
      for(let i=0; i < this.setps.length; i++){
        if(this.setps[i].state_id != this.ticket.state_id){
          temp += 1
        } else if(this.setps[i].state_id === this.ticket.state_id){
          return temp
        }      
      }
      return temp
    }
  },
  watch: {
    ticket () {
      let form = []
      let temp = this.ticket.field_list
      temp.map(item => {  
        if ([40,50,70].includes(item.field_type_id)){
          const t = item.field_value.split(',')
          item.field_value = t
          form.push(item)
        } else {
          form.push(item)
        }
      })
      this.detailForm['datas'] = form
      temp.map(item => {
        if (item.field_attribute === 2) {
          if ([5, 35, 45, 55, 60].includes(item.field_type_id)) {
            this.detailFormRules[item.field_key] = {validator: Validators.string, type: 'string', trigger: 'blur'}
          } else if ([25, 30].includes(item.field_type_id)) {
            this.detailFormRules[item.field_key] = {validator: Validators.datetime, type: 'date', trigger: 'blur'}
          } else if ([40, 50, 70].includes(item.field_type_id)) {
            this.detailFormRules[item.field_key] = {required: true, type: 'array', trigger: 'blur', message: '不能为空'}
          } else if ([10, 15].includes(item.field_type_id)) {
            this.detailFormRules[item.field_key] = {validator: Validators.number, type: 'number', trigger: 'blur'}
          } else if (item.field_type_id === 20) {
            this.detailFormRules[item.field_type_id] = {required: true, type: 'boolean', trigger: 'blur', message: '不能为空'}
          }
        }
      })
    }
  },
  created (){
      this.init()
  },  

}
</script>

<style scoped>
  .top{
    margin-top: 40px; 
  }
  .con{
    font-size: 22px;
    font-weight: bolder;
    margin-top: 30px;
    margin-left: 50px;
  }
  .disabled_field {
    overflow: hidden;
    display: inline-block;
    width: 100%;
    height: 100%;
    position: relative;
    line-height: 32px;
    color: rgba(0,0,0,0.4);
    
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
</style>
