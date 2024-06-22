<template>
    <div class="app-container">
        <div v-if="tag === 0" class="container">
            <el-form :model="formData">
               <!-- <el-col :span="10">
                    <el-form-item label="appCode:">
                        <span>{{ formData.code }}</span>
                    </el-form-item>
                </el-col> -->
                 <el-form-item label="appCode:">
                        <span>{{ formData.code }}</span>
                    </el-form-item>
                <el-col :span="10">
                    <el-form-item label="git地址:">
                        <span>{{ formData.git }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="应用名称:">
                        <span>{{ formData.name }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="开发语言:">
                        <span>{{ formData.language }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="父域:">
                        <span>{{ formData.parent_domain }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="应用状态:">
                        <span v-if="formData.enable === 0">使用中</span>
                        <span v-else>已下线</span>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="10">
                    <el-form-item label="产物路径:">
                        <span>{{ formData.buildpath }}</span>
                    </el-form-item>
                </el-col> -->
                <el-col :span="10">
                    <el-form-item label="开发负责人:">
                        <span>{{ formData.owner }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="开发 Leader:">
                        <span>{{ formData.owner_leader }}</span>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="10">
                    <el-form-item label="QA负责人:">
                        <span>{{ formData.qa_owner }}</span>
                    </el-form-item>
                </el-col> -->
                <el-col :span="10">
                    <el-form-item label="测试负责人:">
                        <span>{{ formData.test_owner }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="测试 Leader:">
                        <span>{{ formData.test_leader }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="ESU负责人:">
                        <span>{{ formData.esu_owner }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="esu Leader:">
                        <span>{{ formData.esu_leader }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="运维负责人:">
                        <span>{{ formData.devops_owner }}</span>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div v-else-if="tag == 1">
            <el-form :model="formData" ref="formData" label-width="100px" >
                  <el-form-item label="appCode" prop="code" >
                      <el-col :span="11">
                        <el-input v-model="formData.code" disabled></el-input>
                      </el-col>
                  </el-form-item>
                  <el-form-item label="应用名称" prop="name" >
                      <el-col :span="11">
                        <el-input v-model="formData.name" v-if="user_roles.includes('test_w')" disabled></el-input>
                        <el-input v-model="formData.name" v-else></el-input>
                      </el-col>
                  </el-form-item>
                  <el-form-item label="git地址" prop="git" >
                      <el-col :span="11">
                        <el-input v-model="formData.git" v-if="user_roles.includes('test_w')" disabled></el-input>
                        <el-input v-model="formData.git" v-else></el-input>
                      </el-col>
                  </el-form-item>
                  <el-form-item label="开发语言" prop="language" style="width: 100%">
                      <el-col :span="11">
                        <el-input v-model="formData.language" v-if="user_roles.includes('test_w')" disabled></el-input>
                        <el-select v-model="formData.language" clearable style="width: 100%" v-else>
                            <el-option v-for="item in language_options" 
                            :key="item.langtype" 
                            :value="item.langtype" 
                            :label="item.langtype"
                            ></el-option>
                        </el-select>
                      </el-col>
                  </el-form-item>
                  <el-form-item label="上游服务" prop="upper_service">
                        <el-col :span="11">
                          <el-input v-if="user_roles.includes('test_w')" v-model="formData.upper_service" disabled></el-input>
                          <el-select 
                           v-else
                           v-model="formData.upper_service"
                           filterable
                           remote
                           placeholder="请输入关键字搜索添加"
                           :loading="loading"
                           :remote-method="searchApp"
                           clearable
                           multiple
                           style="width: 100%"
                          >
                            <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                             </el-option>
                        </el-select>
                        </el-col>
                  </el-form-item>
                  <el-form-item label="下游服务" prop="down_service">
                        <el-col :span="11">
                          <el-input v-if="user_roles.includes('test_w')" v-model="formData.down_service" disabled></el-input>
                          <el-select 
                           v-else
                           v-model="formData.down_service"
                           filterable
                           remote
                           placeholder="请输入关键字搜索添加"
                           :loading="loading"
                           :remote-method="searchApp"
                           clearable
                           multiple
                           style="width: 100%"
                          >
                            <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                             </el-option>
                        </el-select>
                        </el-col>
                  </el-form-item>
                  <el-form-item label="父级域" prop="parent_domain">
                        <el-col :span="11">
                          <el-input v-model="formData.parent_domain" disabled></el-input>
                        </el-col>
                  </el-form-item>
                  <el-form-item label="应用状态" prop="enable">
                    <el-col :span="11">
                      <el-select v-model="formData.enable" style="width:100%;">
                        <el-option v-for="(item, index) in app_status_options" :key="index" :label="item.label" 
                        :value="item.value"></el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                  <!-- <el-form-item label="发布健康检测" prop="ignoreverifyresult">
                        <el-col :span="11">
                            <el-radio-group v-model="formData.ignoreverifyresult">
                             <el-radio :label="true">是</el-radio>
                             <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </el-col>
                  </el-form-item>
                  <el-form-item label="产物路径" prop="buildpath">
                        <el-col :span="11">
                          <el-input v-model="formData.buildpath"></el-input>
                        </el-col>
                  </el-form-item>
                  <el-form-item label="编译参数" prop="make_args">
                        <el-col :span="11">
                          <el-input v-model="formData.make_args"></el-input>
                        </el-col>
                  </el-form-item>
                  <el-form-item label="版本号" prop="version">
                        <el-col :span="11">
                          <el-input v-model="formData.version" disabled></el-input>
                        </el-col>
                  </el-form-item> -->
                  <el-form-item label="开发负责人" prop="owner">
                    <el-col :span="11">
                      <!--<el-select v-model="formData.owner" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable v-if="user_roles.includes('test_w')" disabled>
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <el-select v-model="formData.owner" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable v-else>
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <el-input v-model="formData.owner" v-if="user_roles.includes('test_w')" disabled></el-input>
                      <el-input v-else v-model="formData.owner"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="开发 Leader" prop="owner_leader">
                    <el-col :span="11">
                      <!--<el-select v-model="formData.owner_leader" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable v-if="user_roles.includes('test_w')" disabled>
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <el-select v-model="formData.owner_leader" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable v-else>
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <el-input v-model="formData.owner_leader" v-if="user_roles.includes('test_w')" disabled></el-input>
                      <el-input v-else v-model="formData.owner_leader"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="运维负责人" prop="devops_owner">
                    <el-col :span="11">
                      <!--<el-select v-model="formData.devops_owner" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable v-if="user_roles.includes('test_w')" disabled>
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <el-select v-model="formData.devops_owner" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable v-else>
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <el-input v-model="formData.devops_owner" v-if="user_roles.includes('test_w')" disabled></el-input>
                      <el-input v-else v-model="formData.devops_owner"></el-input>
                    </el-col>
                  </el-form-item>
                  <!-- <el-form-item label="QA负责人" prop="qa_owner">
                    <el-col :span="11">
                      <el-select v-model="formData.qa_owner" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable >
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-col>
                  </el-form-item> -->
                  <el-form-item label="ESU负责人" prop="esu_owner">
                    <el-col :span="11">
                      <!--<el-select v-model="formData.esu_owner" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable >
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <el-input v-model="formData.esu_owner"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="ESU Leader" prop="esu_leader">
                    <el-col :span="11">
                      <!--<el-select v-model="formData.esu_leader" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable >
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <el-input v-model="formData.esu_leader"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="测试负责人" prop="test_owner">
                    <el-col :span="11">
                      <!--<el-select v-model="formData.test_owner" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable >
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <el-input v-model="formData.test_owner"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="测试 Leader" prop="test_leader">
                    <el-col :span="11">
                      <!--<el-select v-model="formData.test_leader" filterable placeholder="输入姓名搜索" 
                        style="width:100%;" clearable >
                        <el-option v-for="(item, index) in ldap_user"  :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <el-input v-model="formData.test_leader"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="updateApp">更新</el-button>
                    <el-button type="warning" @click="returnApp">返回</el-button>
                  </el-form-item>
            </el-form>
            <el-dialog
              title="⚠️更新应用信息"
              :visible.sync="dialogVisible"
              width="30%"
              >
             <span>  确定修改{{ formData.code }}的信息</span>
             <span slot="footer" class="dialog-footer">
               <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitApp">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app_detail',
    data(){
      return {
          tag: 0,
          formData: {},
          language_options: [],
          loading: false,
          options: [],
          radio: true,
          dialogVisible: false,
          ldap_user: [],
          app_status_options: [
            {label: '启用', value: 0},
            {label: '停用', value: 1}
          ]
          
      }
    },
    methods: {
        init() {
            this.$store.dispatch('search_app', {appId: this.appId}).then(resp => {
                this.formData = resp.data.data[0]
                
                
            }).catch(err => {
              console.log(err)
              this.$message({message: '获取应用数据失败 '+err, type: 'error'})
            })
            // this.$store.dispatch('get_ad_user', {pageSize:0, pageNumber:1, user_type_id:2}).then(resp => {
            //   this.ldap_user = []
            //   if(resp.data.status === false){
            //     this.$message({message: '获取用户数据失败 '+ resp.data.error, type: 'error'})
            //   } else {
            //     const data = resp.data.rows
            //     data.forEach(obj => {
            //       this.ldap_user.push({label: obj.displayname, value: obj.displayname})
            //     });
            //   }
              
              
            // }).catch(err => {
            //   console.log(err)
            //   this.$message({message: '获取用户数据失败 '+err, type: 'error'})
            // })
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
                console.log(err)
                this.$message({message: err, type: 'error'})
              })
            }
            
        },
        updateApp(){
          
          this.dialogVisible = true
        },
        submitApp() {
            this.$store.dispatch('put_app', this.formData).then(resp => {
                this.dialogVisible = false
                if(resp.data.code === 200 ||resp.data.code ===201){
                  this.$store.dispatch('search_app', {appId: this.appId}).then(resp => {
                    this.formData = resp.data.data[0]
                    this.$message({message: '更新成功', type: 'success'})
                
                  }).catch(err => {
                    this.$message({message: '获取应用数据失败 '+err, type: 'error'})
                  })
                  
                } else {
                  this.$message({message: '更新失败 '+ resp.data.msg, type: 'error'})
                }
            }).catch(err => {
              this.dialogVisible = false
              this.$message({message: '更新失败: ' + err, type: 'error'})
            })

        },
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      returnApp(){
            this.$router.push({
                name: 'app_list',
            })
        }
    },
    computed: {
        appId (){
            return this.$route.params.appId
        },
        user_roles(){
          return this.$store.getters.roles
        },
        
    },
    
    created(){
        this.init()
        if(this.user_roles.includes('devops') || this.user_roles.includes('administrators')|| 
        this.user_roles.includes('cmdb_rw') || this.user_roles.includes('test_w') || 
        this.user_roles.includes('cmdb_application_w')){
          this.tag = 1
          this.$store.dispatch('get_language').then(resp => {
              this.language_options = resp.data.data
          })
          
        }
    }
    
}
</script>
