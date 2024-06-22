<template>
  <div>
      <div>
        <div class="detail-header"></div>
        <div class="detail-content">
            <div class="detail-content-header">
              <i class="el-icon-document"></i>
              <span >审批内容</span>
            </div>
            <div class="detail-content-content">
              <el-form :model="newForm"  ref="newForm" label-width="150px" size="small" style="margin-top:20px;">
                <el-row >
                  <el-col :span="22">
                    <!-- <el-form-item label="标题" :rules="{ required: true, message: '必填项', trigger: 'blur' }">
                      <el-input v-model="flow_title"></el-input>
                    </el-form-item>  -->
                  </el-col>
                  <el-col :md="{span: item.field_type === 'textarea' ? 22 : 11}" v-for="(item, index) in newForm.datas" :key="index">
                    <el-form-item :label="item.field_label"  :prop="'datas.' + index+'.field_value'" :rules="newFormRule[item.field_key]" >
                      <div v-if="item.field_rule === 0 && item.field_type === 'input' && item.field_key === 'BIZ_code'">
                        <el-input v-model="item.field_value" placeholder="[系统|平台]-{模块}-{app|h5|mobile-h5|job|mp}{-node} 如:utp-order" ></el-input>
                        <el-link type="primary" href="https://shimo.im/docs/V5qeWO0MjKtbF8AJ" target="_blank">参考规范</el-link>
                        
                      </div>
                      <el-input v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'input'"></el-input>
                      <el-input v-model="item.field_value" v-else-if="item.field_rule === 1 && item.field_type === 'input'" readonly></el-input>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_proLine'"
                      style="width:100%;">
                        <el-option v-for="(obj, i) in product_line_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_platform'"
                      style="width:100%;">
                        <el-option v-for="(obj, i) in platform_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_appType'"
                      style="width:100%;">
                        <el-option v-for="(obj, i) in app_type_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-cascader v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_department'"
                      :options="org_options" style="width:100%;" clearable></el-cascader>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_ownerName'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_operator'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                       <el-cascader v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_domain'"
                      :options="framework_options" style="width:100%;" clearable></el-cascader>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio' && item.field_key === 'BIZ_ownerLeader'"
                      filterable clearable style="width:100%;">
                        <el-option v-for="(obj, j) in user_options" :key="j" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <el-select v-model="item.field_value" v-else-if="item.field_rule === 0 && item.field_type === 'radio'" style="width:100%;">
                        <el-option v-for="(obj, i) in item.field_options" :key="i" :label="obj.label" :value="obj.value"></el-option>
                      </el-select>
                      <div v-else-if="item.field_rule ===0 && item.field_type === 'textarea'" >
                      <el-input  type="textarea" v-model="item.field_value"
                      :autosize="{minRows: 4, maxRows: 10}" style="width:50%;">
                      </el-input>
                      
                      </div>
                    </el-form-item>
                    
                  </el-col>
                 
                </el-row>
                 <el-form-item>
                   <el-button type="primary" @click="handleButton('newForm')">提交</el-button>
                   <el-button type="warning" @click="reset('newForm')">取消</el-button>
                 </el-form-item>
                 
              </el-form>
            </div>
        </div>
        <div class="detail-footer"></div>
      </div>
  </div>  
</template>


<script>
export default {
    name: 'new_flow',
    data() {
      return {
        init_data: {
         field_list: []
        },
        newForm: {datas: []},
        product_line_options: [],
        platform_options: [],
        app_type_options: [],
        org_options: [],
        user_options: [],
        framework_options: [],
        flow_title: ''
        
      }
    },
    methods: {
        init(){
            //console.log(this.proc_key)
            this.$store.dispatch('get_flow_form', 
              {proc_def_key: this.proc_key, ticket_id: this.ticket_id}).then(resp => {
              
              this.init_data.field_list = []
              
              resp.data.data.map(item => {
                this.init_data.field_list.push(item)
              })
              this.formatData()    
            })
            this.$store.dispatch('get_product_line', {pageSize: 100, pageNumber: 1}).then(resp => {
              resp.data.data.map(item => {
                this.product_line_options.push({label: item.cn_name, value: item.name})
              })
            })

            this.$store.dispatch('get_platform_info', {pageSize: 100, pageNumber:1}).then(resp => {
              resp.data.data.map(item => {
                this.platform_options.push({ label: item.name, value: item.name})
              })
            })

            this.$store.dispatch('get_language', {pageSize: 100, pageNumber: 1}).then(resp => {
              resp.data.data.map(item => {
                this.app_type_options.push({label: item.langtype, value: item.langtype})
              })
            })

            this.$store.dispatch('get_muse_org').then(resp => {
              let data = {}
              let temp = resp.data.data
              data = this.generateOpt(temp[0])
              this.org_options.push(data)

            })

            this.$store.dispatch('get_muse_user', {pageSize: 10000, pageNumber: 1}).then(resp => {
              let temp = []
              temp = resp.data.data
              temp.map(item => {
                this.user_options.push({label: item.name +'<'+item.staff_email+'>', value: item.staff_email})
              })
            })

            this.$store.dispatch('get_frame_work').then(resp => {
              this.framework_options = resp.data.data
            })
        },

        formatData: function(){
          let form = []
          let temp = []
          temp = this.init_data.field_list
   
          temp.forEach((item, index) => {
            let temp_data = {}
            if(item.items[0].itemRule != 2){
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
          //提交申请
          // if(this.flow_title.trim() === '' || this.flow_title.trim() === null){
          //   this.$message({message: '标题为必填项', type: 'error'})
          // } else {
            this.$refs[formName].validate((valid) => {
              if(valid) {
                
                const temp = this.newForm.datas
                const data = {}
                temp.map(item => {
                  if(item.field_key === 'BIZ_department' || item.field_key === 'BIZ_domain'){
                    data[item.field_key] = item.field_value[item.field_value.length - 1]
                  } else {
                    data[item.field_key] = item.field_value
                  }
                  
                })
                
                this.$store.dispatch('create_ops_ticket', {ticket_id: this.ticket_id, 
                  params: data, email: localStorage.username, proc_def_key: this.proc_key }).then(resp => {
                    if(resp.data.code === 201){
                      this.$message({message: '提交成功', type: 'success'})
                        this.$router.push({
                          name: 'myself_flow',
                          
                        })
                    } else {
                      this.$message({message: '提交失败 ' +resp.data.msg, type: 'error'})
                    }
                  })
              } else {
                this.$message({message: '数据不合法', type: 'error'})
              }
            })
          //}
          
        },
        reset(formName){
          this.$refs[formName].resetFields()
        }
        
    },
    
    computed: {
      proc_key() {
        return this.$route.params.key
      },
      ticket_id() {
        return localStorage.ticket
      },
      // newForm() {
      //     let data = {}
      //     let form = []
      //     let temp = []
      //     temp = this.init_data.field_list
   
      //     temp.forEach((item, index) => {
      //       let temp_data = {}
      //       if(item.items[0].itemRule != 2){
      //         if(item.items[0].itemOptions.length > 0){
      //           temp_data['field_options'] = []
      //           item.items[0].itemOptions.map(obj => {
      //             temp_data.field_options.push({label: obj.optionValue, value: obj.optionKey})
      //           })
      //         } else {
      //           temp_data.field_options = item.items[0].itemOptions
      //         }
      //         if(item.items[0].itemValueType === 'string'){
      //           temp_data.field_value = ''
      //         }
      //         temp_data.field_key = item.items[0].itemKey
      //         temp_data.field_type = item.items[0].itemType
      //         temp_data.field_label = item.items[0].title
      //         temp_data.field_rule = item.items[0].itemRule
      //         form.push(temp_data)
      //       }
            
      //     })
        
      //   data.datas = form
      //   return data  
      // },
      newFormRule(){
        let rule = {}
        let temp = []
        temp = this.init_data.field_list
        temp.forEach(ele => {
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
      }
      
    },
    created() {
        this.init()
    },
}
</script>
<style scoped>
  .detail-header {

  }
  .detail-content {
     margin: 20px;
     position: relative;
 
  }
  .detail-content-header {
      color: #409EFF;
      font-size: 18px;
      border-bottom: 1px solid #e0e0e0;
  }
  .detail-content-content {
     position:absolute;
     top: 50px; left: 0; right: 0;
     
     margin: 0 auto;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    width: 98%;
  }

  
</style>