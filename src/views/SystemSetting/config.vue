<template>
    <div style="margin: 10px">
      <el-card>
        <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="LDAP配置" name="ldap">
            <el-form ref="ldap" :model="ldap_data" label-width="120px" label-position="right" @submit.native.prevent>
              <el-form-item label="管理用户" prop="account" :rules="[{required:true,message:'请输入信息，例：devops', trigger: 'blur'}]">
                <el-input v-model="ldap_data.account" style="width: 350px"></el-input>
              </el-form-item>
              <el-form-item label="密码"  prop="password" :rules="[{required:true,message:'请输入密码', trigger: 'blur'}]">
                <el-input v-model="ldap_data.password" style="width: 350px" :type="pwdType">
                  <i class="el-icon-view" slot="append" @click="showPwd" style="cursor: pointer"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="用户DN" prop="user_dn" :rules="[{required:true,message:'请输入信息，例：cn=Users,dc=example,dc=com', trigger: 'blur'}]">
                <el-input v-model="ldap_data.user_dn" style="width: 350px"></el-input>
              </el-form-item>
              <el-form-item label="基础DN" prop="base_path" :rules="[{required:true,message:'请输入信息，例：dc=example,dc=com', trigger: 'blur'}]">
                <el-input v-model="ldap_data.base_path" style="width: 350px"></el-input>
              </el-form-item>
              <el-form-item label="地址"  prop="ip" :rules="[{required:true,message:'请输入IP', trigger: 'blur'}]">
                <el-input v-model="ldap_data.ip" style="width: auto"></el-input>
              </el-form-item>
              <el-form-item label="端口"  prop="port" :rules="[{required:true,message:'请输入端口', trigger: 'blur'}]">
                <el-input v-model="ldap_data.port" style="width: auto" type="number"></el-input>
              </el-form-item>
              <el-form-item label="域名"  prop="domain" :rules="[{required:true,message:'请输入域名', trigger: 'blur'}]">
                <el-input v-model="ldap_data.domain" style="width: auto"></el-input>
              </el-form-item>
              <el-form-item label="SSL启用">
                <el-select v-model="ldap_data.use_ssl" placeholder="SSL">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
<!--              <el-form-item label="LDAP过滤"  prop="domain" :rules="[{required:true,message:'请输入域名', trigger: 'blur'}]">-->
<!--                <el-input v-model="ldap_data.filter" style="width: 350px"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="组过滤">-->
<!--                <el-input v-model="ldap_data.group_filter" style="width: 350px"></el-input>-->
<!--              </el-form-item>-->

              <!--
              <el-divider content-position="left">测试连接</el-divider>
              <el-form ref="conn_check" :model="conn_check" label-width="auto" label-position="right" @submit.native.prevent>
                <el-form-item label="测试用户"  prop="username" :rules="[{required:true,message:'请输入用户名', trigger: 'blur'}]">
                  <el-input v-model="conn_check.username" style="width: auto"></el-input>
                </el-form-item>
                <el-form-item label="密码"  prop="password" :rules="[{required:true,message:'请输入密码', trigger: 'blur'}]">
                  <el-input v-model="conn_check.password" type="password" style="width: auto"></el-input>
                </el-form-item>
              </el-form>
              -->


              <el-form-item>
                <el-button type="primary" @click="LDAPSaveOrCheck('save')" plain :loading="ldap_loading">保存</el-button>
                <el-button @click="LDAPSaveOrCheck('check')" :loading="ldap_loading_check">测试连接</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>

          <el-tab-pane label="Email配置" name="email">
            <el-form ref="email" :model="email_data" label-width="120px" label-position="right" @submit.native.prevent>
              <el-form-item label="用户名" prop="username" :rules="[{required:true,message:'请输入信息', trigger: 'blur'}]">
                <el-input v-model="email_data.username" style="width: 350px"></el-input>
              </el-form-item>
              <el-form-item label="密码"  prop="password" :rules="[{required:true,message:'请输入密码', trigger: 'blur'}]">
                <el-input v-model="email_data.password" style="width: 350px" :type="pwdType">
                  <i class="el-icon-view" slot="append" @click="showPwd" style="cursor: pointer"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="SMTP端口" prop="smtpPort" :rules="[{required:true,message:'请输入信息', trigger: 'blur'}]">
                <el-input v-model="email_data.smtpPort" style="width: 350px" type="number"></el-input>
              </el-form-item>
              <el-form-item label="SMTP地址" prop="smtpPort" :rules="[{required:true,message:'请输入信息', trigger: 'blur'}]">
                <el-input v-model="email_data.smtpServer" style="width: 350px"></el-input>
              </el-form-item>
              <el-divider content-position="left">测试</el-divider>
              <el-form-item label="测试地址">
                <el-input v-model="check_email" style="width: 350px"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="EmailSaveOrCheck('save')" plain :loading="loading">保存</el-button>
                <el-button @click="EmailSaveOrCheck('check')" :loading="check_loading">发送测试邮件</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="属性" name="property">
            <el-table :data="property_data" v-loading="property_loading">
              <el-table-column label="ID" prop="id" width="80"></el-table-column>
              <el-table-column label="Name" prop="name"></el-table-column>
              <el-table-column label="键" prop="k"></el-table-column>
              <el-table-column label="值" prop="v"></el-table-column>
            </el-table>
            <div class="block">
              <pagination :total="property_total" :page.sync="property_page" :limit.sync="property_limit" @pagination="GetPropertyData"></pagination>
            </div>
          </el-tab-pane>

        </el-tabs>



      </el-card>

    </div>
</template>

<script>
  import pagination from '@/components/Pagination/pagination'
  export default {
    name: 'config',
    data(){return{
      activeName: 'ldap',

      // LDAP
      ldap_loading: false,
      ldap_loading_check: false,
      ldap_url: this.GLOBAL.service_tag+'/api/system-setting/ldap/',
      ldap_data: {use_ssl: false, account: ''},
      conn_check: {username: '', password: ''},

      // Email
      email_loading: false,
      email_loading_check: false,
      email_url: this.GLOBAL.service_tag+'/api/system-setting/email/',
      email_data: {email_password: '', email_username: '', smtpPort: '', smtpServer: ''},
      check_email: '',

      // Property
      property_loading: false,
      property_url: this.GLOBAL.service_tag+'/api/system-setting/property/',
      property_data: [],
      property_total: 0,
      property_page: 1,
      property_limit: 10,

      pwdType: 'password',
      tableData: [],
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      check_loading: false,
      form: {},

    }},
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = 'text'
        } else {
          this.pwdType = 'password'
        }
      },

      tabClick: function(tab, event){
        if(tab.name==='ldap'){
          this.GetLDAPData()
        } else if(tab.name==='email'){
          this.GetEmailData()
        } else if(tab.name==='property'){
          // this.GetPropertyData()
        }
      },

      /* LDAP */
      GetLDAPData: function() {
        this.axios({
          method: 'GET',
          url: this.ldap_url,
          params: {},
        }).then((response)=>{
          // console.log('ldap_data:',response.data);
          if(response.data.status){
            this.ldap_data = response.data.data
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      LDAPSaveOrCheck: function(action) {
        this.$refs.ldap.validate(valid =>{
          if(valid){
            let params = {'row': this.ldap_data}
            if(action==='check'){params['check']=true; this.ldap_loading_check=true}else {this.ldap_loading=true}
            this.axios({
              method: 'POST',
              url: this.ldap_url,
              data: params,
            }).then((response)=>{
              // console.log('LDAPSaveOrCheck:',response.data);
              if(response.data.status){
                this.$message.success(response.data.message)
              }else {this.$message.error(response.data.error)}
              if(action==='check'){this.ldap_loading_check=false}else {this.ldap_loading=false}
            }).catch((response) => {
              if(action==='check'){this.ldap_loading_check=false}else {this.ldap_loading=false}
              this.$message.error(String(response));
            });
          } else {this.$message.warning('请输入完整数据')}
        })

      },

      /* email */
      GetEmailData: function() {
        this.axios({
          method: 'GET',
          url: this.email_url,
          params: {},
        }).then((response)=>{
          // console.log('GetEmailData:',response.data);
          if(response.data.status){
            this.email_data = response.data.data.row
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      EmailSaveOrCheck: function(action) {
        this.$refs.email.validate(valid =>{
          if(valid){
            let params = {'row': this.email_data, 'check_email': this.check_email}
            if(action==='check'){
              if(!this.check_email){this.$message.error('请输入测试接收地址');return}
              params['check']=true; this.check_loading=true
            }else {this.loading=true}
            this.axios({
              method: 'POST',
              url: this.email_url,
              data: params,
            }).then((response)=>{
              // console.log('EmailSaveOrCheck:',response.data);
              if(response.data.status){
                this.$message.success(response.data.message)
              }else {this.$message.error(response.data.error)}
              if(action==='check'){this.check_loading=false}else {this.loading=false}
            }).catch((response) => {
              if(action==='check'){this.check_loading=false}else {this.loading=false}
              this.$message.error(String(response));
            });
          } else {this.$message.warning('请输入完整数据')}
        })

      },

      /* property */
      GetPropertyData: function() {
        this.property_loading=true
        this.axios({
          method: 'GET',
          url: this.property_url,
          params: {"pageSize": this.property_limit, "pageNumber": this.property_page},
        }).then((response)=>{
          // console.log('GetPropertyData:',response.data);
          if(response.data.status){
            this.property_data = response.data.data
            this.property_total= response.data.total
          }else {this.$message.error(response.data.error)}
          this.property_loading=false
        }).catch((response) => {
          this.property_loading=false
          this.$message.error(String(response));
        });
      },
    },

    mounted () {
      this.GetLDAPData()
    },
    components: {
      pagination: pagination,
    }
  }
</script>

<style scoped>

</style>
