<template>
    <div class="app-container">
        <div class="filter-container">
            <!-- <el-button type="primary" size="mini" @click="openDialog">添加订阅</el-button> -->
        </div>
           <div>
            <el-row class="tac">
              <el-col :span="2">
              <el-menu
               default-active="1"
               @select="handleSelect"
               class="el-menu-vertical-demo"
              >
                <el-menu-item index="1">
                  <span slot="title">已订阅</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <span slot="title">订阅</span>
                </el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="22">
                <div v-if="select_index == 1">
                    <div>
                        <el-radio-group v-model="label_item" style="margin-left:20px;margin-bottom:10px;">
                          <el-radio label="namespace">namespace</el-radio>
                          <el-radio label="items">监控项</el-radio>
                        </el-radio-group>
                        <el-button type="primary" size="mini" style="float:right;" @click="openAlertDialog">修改告警渠道</el-button>
                        <el-table :data="item_table_data" v-if="label_item==='items'">
                            <el-table-column label="监控项" prop="name"></el-table-column>
                            <el-table-column label="邮件订阅" prop="is_email">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.is_email === true">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="钉钉订阅" prop="is_dingtalk">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.is_dingtalk=== true">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="openUpdateDialog(scope.row)">修改</el-button>
                                    <el-button type="text" @click="openDeleteDialog(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-table :data="namespace_table_data" v-if="label_item==='namespace'">
                            <el-table-column label="监控项" prop="name"></el-table-column>
                            <el-table-column label="邮件订阅" prop="is_email">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.is_email === true">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="钉钉订阅" prop="is_dingtalk">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.is_dingtalk=== true">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="openUpdateDialog(scope.row)">修改</el-button>
                                    <el-button type="text" @click="openDeleteDialog(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div v-if="select_index == 2" style="margin-left:20px;">
                  <span style="font-size:22px;color:black;margin-right:20px;">k8s集群:</span>
                  <el-select v-model="select_value" style="width:20%;" @change="changeValue" clearable>
                    <el-option v-for="(item, index) in select_options" :key="index" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                  <span style="font-size:22px;color:black;margin-right:20px;margin-left:20px;">Namespace:</span>
                  <el-select v-model="select_namespace" clearable filterable multiple collapse-tags @change="initItems">
                      <el-option v-for="(item, index) in namespace_data" :key="index" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                  <span style="font-size:22px;color:black;margin-right:20px;margin-left:20px;">监控项:</span>
                  <el-select v-model="select_items" clearable filterable multiple collapse-tags style="width:25%;">
                      <el-option v-for="(item, index) in item_options" :key="index" :value="item.value" :label="item.label"
                      ></el-option>
                  </el-select>
                  <el-button type="primary" size="mini" style="margin-left:20px;" @click="openCreateDialog">订阅</el-button>
                </div>
            </el-col>
            </el-row>
           </div>
            <!-- <el-tree
            :props="props"
            :load="loadNode"
            lazy
            show-checkbox
            ></el-tree> -->
        
        <el-dialog
         title="添加订阅"
         :visible.sync="open_dialog"
         width="30%"
         :before-close="handleClose">
         <div>
          <el-form  class="demo-table-expand" label-width="140px">
              <el-form-item label="选中的NameSpace">
                  <!-- <span v-for="(item, index) in select_namespace" :key="index" style="margin-left:5px;">{{item}}</span> -->
                  <ul v-if="select_namespace != 0">
                      <li v-for="(item, index) in select_namespace" :key="index">{{item}}</li>
                  </ul>
                  <span v-else >无</span>
              </el-form-item>
              <el-form-item label="选中的监控项">
                  <ul v-if="select_items.length != 0">
                      <li v-for="(item, index) in select_items" :key="index">{{item}}</li>
                  </ul>
                  <span v-else >无</span>
              </el-form-item>
              <el-form-item label="邮件订阅">
                  <el-radio-group v-model="is_email">
                      <el-radio :label="false">不开启</el-radio>
                      <el-radio :label="true">开启</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="钉钉订阅">
                  <el-radio-group v-model="is_dingtalk">
                      <el-radio :label="false">不开启</el-radio>
                      <el-radio :label="true">开启</el-radio>
                  </el-radio-group>
              </el-form-item>
          </el-form>
         </div>
         <span slot="footer" class="dialog-footer">
           <el-button @click="open_dialog = false">取 消</el-button>
           <el-button type="primary" @click="createSubscribe">确 定</el-button>
         </span>
        </el-dialog>
        <el-dialog
         title="修改订阅"
         :visible.sync="update_dialog"
         width="30%"
         :before-close="handleClose">
         <div>
             <el-form :model="update_form">
                 <el-form-item label="订阅项">
                     <span>{{update_form.name}}</span>
                 </el-form-item>
                 <el-form-item label="邮件订阅">
                     <el-radio-group v-model="update_form.is_email">
                         <el-radio :label="false">不开启</el-radio>
                         <el-radio :label="true">开启</el-radio>
                     </el-radio-group>
                 </el-form-item>
                 <el-form-item label="钉钉订阅">
                     <el-radio-group v-model="update_form.is_dingtalk">
                         <el-radio :label="false">不开启</el-radio>
                         <el-radio :label="true">开启</el-radio>
                     </el-radio-group>
                 </el-form-item>
             </el-form>
         </div>
         <span slot="footer" class="dialog-footer">
           <el-button @click="update_dialog = false">取 消</el-button>
           <el-button type="primary" @click="updateSubscribe">确 定</el-button>
         </span>
        </el-dialog>
        <el-dialog
         title="删除订阅"
         :visible.sync="delete_dialog"
         width="30%"
         :before-close="handleClose">
         <div>
             <span v-if="label_item==='items'">确定要删除监控项{{delete_form.name}}的订阅吗？</span>
             <span v-if="label_item==='namespace'">确定要删除namspace {{delete_form.name}}的告警订阅吗？</span>
         </div>
         <span slot="footer" class="dialog-footer">
           <el-button @click="delete_dialog = false">取 消</el-button>
           <el-button type="primary" @click="deleteSubscribe">确 定</el-button>
         </span>
        </el-dialog>
         <el-dialog
         title="修改告警消息渠道"
         :visible.sync="update_alert_dialog"
         width="30%"
         :before-close="handleClose">
         <div>
             <el-form >
                 <el-form-item label="邮件订阅">
                     <el-radio-group v-model="alert_is_email">
                         <el-radio :label="false">不开启</el-radio>
                         <el-radio :label="true">开启</el-radio>
                     </el-radio-group>
                 </el-form-item>
                 <el-form-item label="钉钉订阅">
                     <el-radio-group v-model="alert_is_dingtalk">
                         <el-radio :label="false">不开启</el-radio>
                         <el-radio :label="true">开启</el-radio>
                     </el-radio-group>
                 </el-form-item>
             </el-form>
         </div>
         <span slot="footer" class="dialog-footer">
           <el-button @click="update_alert_dialog = false">取 消</el-button>
           <el-button type="primary" @click="updateAlertChannel">确 定</el-button>
         </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'alert_subscrip',
    data() {
        return {
            props: {
                label: 'namespace_id',
                children: 'zones'
            },
            ca_props: {
              multiple: true,
              
            },
            namespace_data: [],
            open_dialog: false,
            select_index: 1,
            select_options: [],
            select_value: '',
            select_namespace: [],
            select_items: [],
            item_options: [],
            is_email: true,
            item_table_data: [],
            namespace_table_data: [],
            is_dingtalk: true,
            update_dialog: false,
            update_form: {},
            delete_dialog: false,
            delete_form: {},
            options: [
              {value: 'k8s',
              label: 'k8s',
              children: []
              }
            ],
            item_options: [],
            label_item: 'items',
            update_alert_dialog: false,
            alert_is_email: '',
            alert_is_dingtalk: ''
        }
    },
    methods: {
        init() {
        //    this.$store.dispatch('get_items', {pageNumber:1, pageSize:100}).then(resp => {
        //        resp.data.data.map(item =>{
        //            this.item_options.push({value: item.id, label: item.items})
        //        })
        //    })
        //   this.$store.dispatch('get_cluster').then(resp => {
        //       resp.data.data.map(item => {
        //           let sencode_children = []
        //           this.$store.dispatch('get_namespace', {clusterId: item.id, pageNumber:1, pageSize:1000}).then(res => {
        //               res.data.data.map(it => {
        //                   sencode_children.push({value: it.namespace_id, label: it.name, children: this.item_options})
        //               })

        //           })
        //           this.options[0].children.push({value: item.id, label: item.name, children: sencode_children})
        //       })
        //   })
          if(this.$store.getters.name === ''){
            this.$message({message: '用户名为空,请重新登录', type: 'error'})
          } else {
            this.$store.dispatch('get_subscribe', {email: this.$store.getters.name + '@oyohotels.cn'}).then(resp => {
              this.item_table_data = []
              this.namespace_table_data = []
              const data = resp.data.data
              data['subscribe_items'].forEach(item => {
                this.item_table_data.push({name: item, is_email: data.is_email, is_dingtalk: data.is_dingtalk})
              })
              data.subscribe_namespaces.forEach(it => {
                this.namespace_table_data.push({name: it, is_email: data.is_email, is_dingtalk: data.is_dingtalk})
              })
              
            }).catch(err => {
                this.$message({message: '获取监控数据失败 '+err, type: 'error'})
            })
          }
        },
        loadNode(node, resolve){
            
            if(node.level === 0) {
              this.$store.dispatch('get_namespace', {pageNumber:1, pageSize:200}).then(resp => { 
                return resolve(resp.data.data)
               })
              
            }
            if(node.level === 1) {
                return resolve([])
            }
        },
        openDialog(){
          this.open_dialog = true
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
        },
        handleSelect(key, keypath){
            this.select_index = key
            if(this.select_index === '2'){
              this.$store.dispatch('get_cluster').then(resp => {
                this.select_options = []
                resp.data.data.map(item => {
                  this.select_options.push({value: item.id, label: item.name})
                })
              }).catch(err => {
                  this.$message({message: '获取集群数据失败 ' + err, type: 'error'})
              })
            } else if(this.select_index === '1'){
                if(this.$store.getters.name === ''){
                  this.$message({message: '用户名为空,请重新登录', type: 'error'})
                } else {
                  this.$store.dispatch('get_subscribe', {email: this.$store.getters.name + '@oyohotels.cn'}).then(resp => {
                    this.item_table_data = []
                    this.namespace_table_data = []
                    const data = resp.data.data
                    data['subscribe_items'].forEach(item => {
                      this.item_table_data.push({name: item, is_email: data.is_email, is_dingtalk: data.is_dingtalk})
                    })
                    data.subscribe_namespaces.forEach(it => {
                      this.namespace_table_data.push({name: it, is_email: data.is_email, is_dingtalk: data.is_dingtalk})
                    })
                  }).catch(err => {
                    this.$message({message: '获取监控数据失败 '+err, type: 'error'})
                 })
               }
            }
        },
        changeValue(val){
            this.namespace_data = []
            this.$store.dispatch('get_namespace', {clusterId: val, pageNumber:1, pageSize:1000}).then(resp => {
                this.tableData = resp.data.data
                resp.data.data.map(item => {
                    this.namespace_data.push({value: item.namespace_id, label: item.name})
                })
            })

        },
        initItems(val) {
            if(val.length===0){
              this.item_options = []
            } else {
              this.item_options = []
              this.$store.dispatch('get_items', {pageNumber:1, pageSize:1000}).then(resp => {
                resp.data.data.map(item => {
                this.item_options.push({value: item.items, label: item.items})
                })
              })
            }
            
        },
        openCreateDialog(){
            this.open_dialog = true
        },
        createSubscribe(){
            if(this.$store.getters.name === '') {
                this.open_dialog = false
                this.$message({message: '邮箱为空, 请重新登录', type: 'error'})
            } else {
                const data = {}
                data['email'] = this.$store.getters.name + '@oyohotels.cn'
                data['is_email'] = this.is_email
                data['is_dingtalk'] = this.is_dingtalk
                if(this.select_namespace.length != 0){
                  data['namespaces_list'] = this.select_namespace
                }
                if(this.select_items.length != 0){
                  data['items_list'] = this.select_items
                }
                this.$store.dispatch('create_subscribe', data).then(resp => {
                    this.open_dialog = false
                    if(resp.data.code === 200 || resp.data.code === 201) {
                        this.$message({message: '添加成功', type: 'success'})
                    } else {
                        this.$message({message: '添加失败 ' + resp.data.msg, type: 'error'})
                    }
                }).catch(err => {
                    this.open_dialog =false
                    this.$message({message: '添加失败 '+err, type: 'error'})
                })
                
            }
        },
        openUpdateDialog(row) {
          this.update_form = row
          this.update_dialog = true
        },
        openDeleteDialog(row) {
          this.delete_form = row
          this.delete_dialog = true
        },
        updateSubscribe(){
          if(this.$store.getters.name === '') {
                this.update_dialog = false
                this.$message({message: '邮箱为空, 请重新登录', type: 'error'})
            } else {
              this.update_form['email'] = this.$store.getters.name + '@oyohotels.cn'
              this.$store.dispatch('put_subscribe', this.update_form).then(resp => {
                  this.update_dialog = false
                  if(resp.data.code === 200 || resp.data.code === 201) {
                    this.$message({message: '修改成功', type: 'success'})
                    this.init()
                  } else {
                      this.$message({message: '修改失败 ' + resp.data.msg, type: 'error'})
                  }
              }).catch(err => {
                  this.update_dialog = false
                  this.$message({message: '修改失败 ' + err, type: 'error'})
              })
            }
        },
        deleteSubscribe(){
          if(this.$store.getters.name === '') {
                this.delete_dialog = false
                this.$message({message: '邮箱为空, 请重新登录', type: 'error'})
            } else {
              this.delete_form['email'] = this.$store.getters.name + '@oyohotels.cn'
              delete this.delete_form.is_email
              delete this.delete_form.is_dingtalk
              if (this.label_item === 'namespace') {
                this.delete_form['namespaces_list'] = []
                this.delete_form.namespaces_list.push(this.delete_form.name)
                delete this.delete_form.name
              }
              if(this.label_item === 'items'){
                this.delete_form['items_list'] = []
                this.delete_form.items_list.push(this.delete_form.name)
                delete this.delete_form.name
              }
              this.$store.dispatch('delete_subscribe', this.delete_form).then(resp => {
                this.delete_dialog = false
                if(resp.data.code === 200 || resp.data.code === 201) {
                  this.$message({message: '删除成功', type: 'success'})
                  this.init()
                } else {
                  this.$message({message: '删除失败 ' + resp.data.msg, type: 'error'})
                }
              }).catch(err => {
                this.delete_dialog = false
                this.$message({message: '删除失败 ' + err, type: 'error'})
              })
            }
        },
        openAlertDialog(){
          this.alert_is_email = this.item_table_data[0].is_email
          this.alert_is_dingtalk = this.item_table_data[0].is_dingtalk
          this.update_alert_dialog = true
        },
        updateAlertChannel() {
          if(this.$store.getters.name === '') {
                this.delete_dialog = false
                this.$message({message: '邮箱为空, 请重新登录', type: 'error'})
            } else {
              this.$store.dispatch('put_subscribe', {is_email: this.alert_is_email, is_dingtalk: this.alert_is_dingtalk, email: this.$store.getters.name + '@oyohotels.cn'}).then(resp => {
                this.update_alert_dialog = false
                if(resp.data.code === 200||resp.data.code === 201){
                  this.$message({message: '修改成功', type: 'success'})
                  this.init()
                } else {
                  this.$message({message: '修改失败 '+ resp.data.msg, type: 'error'})
                }
              }).catch(err => {
                this.update_alert_dialog = false
                this.$message({message: '修改失败 ' +err, type: 'error'})
              })
            }
          
        }
    },
    mounted(){
        this.init()
    }
}
</script>

<style scoped>
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

</style>