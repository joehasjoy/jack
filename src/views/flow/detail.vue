<template>
    <div class="app-container">
      <ul class="detail">
        <li class="detail-header"></li>
        <li class="detail-content">
            <div class="detail-content-header">
              <i class="el-icon-document"></i>
              <span >审批内容</span>
            </div>
            <div class="detail-content-content">
              <el-form :model="newForm"  ref="newForm" :rules="newFormRule" label-width="150px" size="small" style="margin-top:20px;">
                <el-row >
                  <el-col :span="22">
                    <el-form-item label="标题" >
                      <el-input v-model="flow_title" readonly></el-input>
                    </el-form-item> 
                  </el-col>
                  <el-col :md="{span: item.field_type === 'textarea' ? 22 : 11}" v-for="(item, index) in newForm.datas" :key="index">
                    <el-form-item :label="item.field_label"  :prop="'datas.' + index+'.field_value'" :rules="newFormRule[item.field_key]">
                      
                      <el-input v-model="item.field_value" v-if="item.field_rule === 0 && item.field_type === 'input'"></el-input>
                      <el-input v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'input'" readonly></el-input>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_proLine'"
                      style="width:100%;">
                        <el-option v-for="(obj, i) in product_line_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_proLine'"
                      style="width:100%;" disabled>
                        <el-option v-for="(obj, i) in product_line_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_platform'"
                      style="width:100%;">
                        <el-option v-for="(obj, i) in platform_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_platform'"
                      style="width:100%;" disabled>
                        <el-option v-for="(obj, i) in platform_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_appType'"
                      style="width:100%;">
                        <el-option v-for="(obj, i) in app_type_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_appType'"
                      style="width:100%;" disabled>
                        <el-option v-for="(obj, i) in app_type_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-cascader v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_department'"
                      :options="org_options" style="width:100%;" clearable></el-cascader>
                      <el-cascader v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_department'"
                      :options="org_options" style="width:100%;" clearable disabled></el-cascader>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_ownerName'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_ownerName'"
                      filterable clearable style="width:100%;" disabled>
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_operator'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_operator'"
                      filterable clearable style="width:100%;" disabled>
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-cascader v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_domain'"
                      :options="framework_options" style="width:100%;" clearable></el-cascader>
                      <el-cascader v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_domain'"
                      :options="framework_options" style="width:100%;" clearable disabled></el-cascader>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_ownerLeader'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_ownerLeader'"
                      filterable clearable style="width:100%;" disabled>
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                       <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_devopsOwner'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_devopsOwner'"
                      filterable clearable style="width:100%;" disabled>
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_esuLeader'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                       <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_esuLeader'"
                      filterable clearable style="width:100%;" disabled>
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_esuOwner'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_esuOwner'"
                      filterable clearable style="width:100%;" disabled>
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_testLeader'"
                      filterable clearable style="width:100%;" >
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_testLeader'"
                      filterable clearable style="width:100%;" disabled >
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_testOwner'"
                      filterable clearable style="width:100%;" >
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio' && item.field_key === 'BIZ_testOwner'"
                      filterable clearable style="width:100%;" disabled>
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio'" style="width:100%;">
                        <el-option v-for="(obj, i) in item.field_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'radio'" style="width:100%;" disabled>
                        <el-option v-for="(obj, i) in item.field_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select >
                      <el-input v-else-if="item.field_rule ===0 && item.field_type === 'textarea'" v-model="item.field_value" type="textarea"
                      :autosize="{minRows: 4, maxRows: 10}" style="width:50%;">
                      </el-input>
                      <el-input v-else-if="item.field_rule ===1 && item.field_type === 'textarea'" v-model="item.field_value" type="textarea" readonly
                      :autosize="{minRows: 4, maxRows: 10}" style="width:50%;">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item v-if="active_name === 'my-audit'">
                     <el-button type="primary" @click="handleButton('newForm')">同意</el-button>
                     <el-button type="warning" @click="refuseTicket('newForm')">拒绝</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                 
              </el-form>
            </div>
        </li>
        <li class="detail-footer">
             <div class="detail-content-header">
              <i class="el-icon-document"></i>
              <span >流程处理</span>
            </div>
            <div class="detail-footer-content">
              <el-form>
                  <el-form-item>
                      <el-input style="width:20%;" readonly v-model="flow_name">
                          <template slot="prepend">流程说明</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-input style="width:20%;" readonly v-model="ticket_status">
                          <template slot="prepend">状态</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-input style="width:20%;" readonly v-model="current_node_name"> 
                          <template slot="prepend">当前节点</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item > 
                      <el-input style="width:20%;" readonly v-model="current_approval_user" >
                          <template slot="prepend">当前处理人</template>
                      </el-input>
                  </el-form-item>
              </el-form>
            </div>
        </li>
      </ul>
  </div>  
</template>

<script>

export default {
    name: 'detail_flow',
    data(){
        return {
          init_data: [],
          newForm: {datas: []},
          detail_data: {data: {}},
          product_line_options: [],
          platform_options: [],
          app_type_options: [],
          org_options: [],
          user_options: [],
          framework_options: [],
          flow_title: '',
          flow_name: '',
          current_node_name: '',
          current_approval_user: '',
          task_id: '',
          ticket_status: ''
        }
    },
    methods: {
      init(){
          this.$store.dispatch('get_detail_task', {ticket_id: this.ticket_id, proc_inst_id: this.proc_inst_id,
                               business_key: this.business_key, proc_def_key: this.proc_def_key, email: localStorage.username}).then(resp => {
                                   this.detail_data.data = resp.data.data
                                   this.flow_title = resp.data.data.procInstName
                                   this.flow_name = resp.data.data.procDefName
                                   const tasks = resp.data.data.tasks
                                   this.current_node_name = tasks[tasks.length - 1].taskName
                                   const temp = []
                                   if(this.detail_data.data.procStatus === 'doing'){
                                     this.ticket_status = '正在进行中'
                                   } else if(this.detail_data.data.procStatus === 'finish'){
                                     this.ticket_status = '已完成'
                                   } else if(this.detail_data.data.procStatus === 'deny'){
                                     this.ticket_status = '已拒绝'
                                   }
                                   tasks.map(item => {
                                       if(item.taskType === 'userTask' && item.taskStatus === 'doing'){
                                           temp.push(item.candiName)
                                       }
                                       if(item.taskType === 'userTask' && item.taskStatus === 'doing'&& item.candiEmail === localStorage.username + '@oyohotels.cn'){
                                         this.task_id = item.id
                                       }
                                   })
                                   this.current_approval_user = temp.join(',')
                                   this.get_detail_form()
                               }).catch(err => {
                                 this.$message({message: '获取数据失败 '+ resp.data.msg, type: 'error'})
                               })
        
          this.$store.dispatch('get_product_line', {pageSize: 100, pageNumber: 1}).then(resp => {
              resp.data.data.map(item => {
                this.product_line_options.push({label: item.cn_name, value: item.name})
              })
            }).catch(err => {
              this.$message({message: '获取数据失败 '+ resp.data.msg, type: 'error'})
            })

            this.$store.dispatch('get_platform_info', {pageSize: 100, pageNumber:1}).then(resp => {
              resp.data.data.map(item => {
                this.platform_options.push({ label: item.name, value: item.name})
              })
            }).catch(err => {
              this.$message({message: '获取数据失败 '+ resp.data.msg, type: 'error'})
            })

            this.$store.dispatch('get_language', {pageSize: 100, pageNumber: 1}).then(resp => {
              resp.data.data.map(item => {
                this.app_type_options.push({label: item.langtype, value: item.langtype})
              })
            }).catch(err => {
              this.$message({message: '获取数据失败 '+ resp.data.msg, type: 'error'})
            })

            this.$store.dispatch('get_muse_org').then(resp => {
              let data = {}
              let temp = resp.data.data
              data = this.generateOpt(temp[0])
              this.org_options.push(data)

            }).catch(err => {
              this.$message({message: '获取数据失败 '+ resp.data.msg, type: 'error'})
            })

            this.$store.dispatch('get_muse_user', {pageSize: 10000, pageNumber: 1}).then(resp => {
              let temp = []
              temp = resp.data.data
              temp.map(item => {
                this.user_options.push({label: item.name +'<'+item.staff_email+'>', value: item.staff_email})
              })
            }).catch(err => {
              this.$message({message: '获取数据失败 '+ resp.data.msg, type: 'error'})
            })

            this.$store.dispatch('get_frame_work').then(resp => {
              this.framework_options = resp.data.data
            }).catch(err => {
              this.$message({message: '获取数据失败 '+ resp.data.msg, type: 'error'})
            })
          
      },
      formatData(){
          //初始化表单
          let form = []
          const temp = this.init_data
          temp.map((item, index) => {
              //console.log(item.items[0])
              if(item.items[0].itemRule === 1){
                //只展示权限
                const temp_data = {}
                if(item.items[0].itemOptions.length > 0){
                  temp_data['field_options'] = []
                  item.items[0].itemOptions.map(obj => {
                    temp_data.field_options.push({label: obj.optionValue, value: obj.optionKey})
                  })
                } else {
                  temp_data.field_options = item.items[0].itemOptions
                }
                temp_data.field_key = item.items[0].itemKey
                temp_data.field_type = item.items[0].itemType
                temp_data.field_label = item.items[0].title
                temp_data.field_rule = item.items[0].itemRule
                if(item.items[0].itemValueType === 'string'){
                    temp_data.field_value = ''
                }
                form.push(temp_data)
              }

              if(item.items[0].itemRule === 0){
                  //可编辑权限
                const temp_data = {}
                if(item.items[0].itemOptions.length > 0){
                  temp_data['field_options'] = []
                  item.items[0].itemOptions.map(obj => {
                    temp_data.field_options.push({label: obj.optionValue, value: obj.optionKey})
                  })
                } else {
                  temp_data.field_options = item.items[0].itemOptions
                }
                if(item.items[0].itemValueType === 'string'){
                  temp_data.field_value = ''
                }
                if(item.items[0].itemKey === 'BIZ_department'){
                  temp_data.field_value = []
                }
                if(item.items[0].itemKey === 'BIZ_domain'){
                  temp_data.field_value = []
                }
              

                temp_data.field_key = item.items[0].itemKey
                temp_data.field_type = item.items[0].itemType
                temp_data.field_label = item.items[0].title
                temp_data.field_rule = item.items[0].itemRule
                form.push(temp_data)
              }
          })
          this.newForm.datas = form
      },
      get_detail_form(){
        this.$store.dispatch('get_detail_form', {ticket_id: this.ticket_id, proc_def_key: this.proc_def_key, task_def_key: this.task_def_key === null?'startNode': this.task_def_key,
                                                  process_id: this.proc_inst_id, email: localStorage.username}).then(resp => {
                                                      this.init_data = resp.data.data
                                                      this.formatData()
                                                      const temp = {}
                                                      Object.keys(this.detail_data).map(i => {
                                                       
                                                        temp[i] = this.detail_data[i]
                                                      })
                                                     
                                                      this.newForm.datas.map(item => {
                                                        item.field_value = temp.data.vars[item.field_key]
                                                      });
                                                       
                                                  }).catch(err => {
                                                    this.$message({message: '获取数据失败 '+ resp.data.msg, type: 'error'})
                                                  })
      },
      generateOpt(data){
          /*迭代生成级联所需要的数据 */
          const temp = {}
          if(JSON.stringify(data.sublevel) === '{}'){
            temp['value'] = data.name
            temp['label'] = data.name
          } else {
            const list = []
            data.sublevel.map(item => {
              list.push(this.generateOpt(item))
            })
            temp['value'] = data.name
            temp['label'] = data.name
            temp['children'] = list
          }
          return temp

        },
      handleButton(formName){
        //处理同意提交事件
        this.$refs[formName].validate(valid => {
          if(valid) {
            const temp = this.newForm.datas
            const data = {}
            temp.map(item => {
              if(item.field_key === 'BIZ_department' && item.field_rule === 0 ){
                data[item.field_key] = item.field_value[item.field_value.length - 1]
              } else if(item.field_key === 'BIZ_domain' && item.field_rule === 0) {
                data[item.field_key] = item.field_value[item.field_value.length - 1]
              } else {
                data[item.field_key] = item.field_value
              }
                  
          })
          this.$store.dispatch('agree_ticket', {ticket_id: this.ticket_id, email: localStorage.username, params: data,
                                  business_key: this.business_key,task_id: this.task_id}).then(resp => {
                                    if(resp.data.code === 201 || resp.data.code === 200){
                                      this.$router.push({
                                        name: 'myself_flow',
                                      })
                                    } else {
                                      this.$message({message: '后端错误 ' + resp.data.msg, type: 'error'})
                                    }
                                  })
          } else {
            this.$message({message: '数据非法', type: 'error'})
          }
        })

      },
      refuseTicket(formName){
        //处理拒绝提交事件
        this.$store.dispatch('refuse_ticket', {email: localStorage.username, ticket_id: this.ticket_id,process_id: this.proc_inst_id,
                             business_key: this.business_key}).then(resp => {
                               if(resp.data.code === 201 || resp.data.code === 200){
                                  this.$router.push({
                                    name: 'myself_flow',
                                  })
                                } else {
                                  this.$message({message: '后端错误 ' + resp.data.msg, type: 'error'})
                                }
                             })
      }
    },
    created(){
        this.init()
    },
    computed:{
        proc_inst_id() {
          return this.$route.params.proc_inst_id
        },
        business_key(){
            return this.$route.params.business_key
        },
        proc_def_key(){
            return this.$route.params.proc_def_key
        },
        ticket_id() {
          return localStorage.ticket
        },
        task_def_key(){
            return this.$route.params.task_def_key
        },
        active_name(){
          return this.$route.params.active_name
        },
        newFormRule(){
          let rule = {}
          const temp = this.init_data
          const data = []
          Object.keys(temp).map(item => {
            data.push(temp[item])
          })
          data.forEach(ele => {
            var temp_data = ele.items[0]
            if(temp_data.itemRule == 0){
              rule[temp_data.itemKey] = {}
              if(temp_data.itemKey === 'BIZ_department' || temp_data.itemKey === 'BIZ_domain'){
                rule[temp_data.itemKey].type = 'array'
              } else {
                rule[temp_data.itemKey].type = temp_data.itemValueType
              }
              rule[temp_data.itemKey].trigger = 'blur'
              temp_data.itemAttrs.map((item) => {
                if(item.attrKey === 'required'){
                  rule[temp_data.itemKey].required = item.attrValue
                }
              })
            }
          
          });
          return rule
        },
    }
}
</script>

<style scoped>

ul li {
    list-style-type:none;
}
.detail {
    width: 100%;
}
.detail-header {

  }
  .detail-content {
     
 
  }
  .detail-content-header {
      color: #409EFF;
      font-size: 18px;
      border-bottom: 1px solid #e0e0e0;
  }
  .detail-content-content {
     position: relative;;
     top: 20px; left: 0; right: 0;
     
     margin: 0 auto;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    width: 98%;
  }

  .detail-footer{
      margin-top: 40px;
  }
  .detail-footer-content {
      margin-top: 20px;
      margin-left: 20px;
  }
</style>