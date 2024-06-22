<template>
    <div class="app-container">
        <div class="filter-container">
          <div class="head">
              <span>域名:</span>
              <span>{{domainname}}</span>
          </div>
          <div class="style: margin-bottom:20px;">
              <el-select v-model="select_val" placeholder="请选择记录类型" size="medium" clearable>
                  <el-option v-for="item in type_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
              <el-select v-model="search_type" size="medium" clearable style="margin-left:20px;">
                  <el-option label="精确搜索" value="accurate"></el-option>
                  <el-option label="模糊搜索" value="vague"></el-option>
              </el-select>
              <el-input v-model.trim="search_content" style="width: 300px;margin-left:20px;" size="medium" @keyup.enter.native="handleFilter" clearable></el-input>
              <el-button size="medium" type="primary" style="margin-left:20px;" @click="handleFilter">搜索</el-button>
              <el-button type="primary" size="mini" style="float:right;" @click="createOpenDialog">添加解析</el-button>
          </div>
        </div>
        <div>
            <el-table
            :data="tableData"
            style="width:100%;"
            :cell-class-name="cellSelfStyle">
            <!-- <el-table-column
             type="selection"
             width="55">
            </el-table-column> -->
            <el-table-column label="记录类型" prop="type"></el-table-column>
            <el-table-column label="主机记录" prop="rr"></el-table-column>
            <el-table-column label="记录值" prop="value"></el-table-column>
            <el-table-column label="TTL" prop="ttl"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="备注" prop="remasks"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateOpenDialog(scope.row)" :disabled="disable">修改</el-button>
                    <el-button type="text" v-if="scope.row.status.toUpperCase() ==='ENABLE'" @click="pauseOpenDialog(scope.row)" :disabled="disable">暂停</el-button>
                    <el-button type="text" v-if="scope.row.status.toUpperCase() === 'DISABLE'" @click="pauseOpenDialog(scope.row)" :disabled="disable">启用</el-button>
                    <el-button type="text" @click="deleteOpenDialog(scope.row)" :disabled="disable">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
            
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  
             @pagination="getList" />
        <!-- <div style="margin-top:20px;">
         <el-button size="mini">暂停</el-button>
         <el-button size="mini">启用</el-button>
         <el-button size="mini">删除</el-button>
         <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  
             @pagination="getList" style="width:500px;float:right;margin-right:200px;"/>
        </div> -->
        <el-dialog
         title="⚠️"
         :visible.sync="pause_dialog"
         width="30%"
         :before-close="handleClose">
          <span v-if="pause_data.status === 'ENABLE' || pause_data.status === 'Enable'">确定暂停 {{pause_data.rr}}.{{domainname}} 此解析记录吗？</span>
          <span v-if="pause_data.status === 'DISABLE' || pause_data.status === 'Disable'">确定开启 {{pause_data.rr}}.{{domainname}} 此解析记录吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="pause_dialog = false">取 消</el-button>
            <el-button type="primary" @click="pauseRRSubmit">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
         title="⚠️"
         :visible.sync="delete_dialog"
         width="30%"
         :before-close="handleClose">
          <span>确定删除 {{delete_data.rr}}.{{domainname}} => {{delete_data.value}} 此条解析记录吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delete_dialog = false">取 消</el-button>
            <el-button type="primary" @click="deleteRRSubmit">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
         title="修改记录"
         :visible.sync="update_dialog"
         width="55%"
         :before-close="handleClose">
          <el-form :model="update_form" ref="update_form" :rules="rules" label-width="80px">
              <el-form-item label="记录类型" prop="recode_type">
                  <el-select v-model="update_form.recode_type" style="width:50%;">
                      <el-option v-for="item in type_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="生产域名" prop="is_online">
                <el-radio-group v-model="update_form.is_online">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用途" prop="purpose">
                <el-radio-group v-model="update_form.purpose">
                  <el-radio label="database" v-if="dba_permission===true">数据库</el-radio>
                  <el-radio label="backend" v-if="devops_permission===true">后端</el-radio>
                  <el-radio label="frontend" v-if="devops_permission===true">前端</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="主机记录" v-if="update_form.purpose === 'database'" prop="recode_rr">
                  <el-input v-model.trim="select_db" style="width:20%;" clearable></el-input>
                  <span>-</span>
                  <el-input v-model.trim="db_slave" placeholder="slave1" style="width:10%;"></el-input>
                  <span>.</span>
                  <el-select v-model="db_type" style="width:15%;" clearable>
                      <el-option v-for="item in db_type_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                  <span>.</span>
                  <el-select
                    v-model="select_env"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width:15%;"
                    >
                    <el-option
                      v-for="item in env_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                   </el-select>
                   <span>.</span>
                   <el-select v-model="select_area" style="width:15%" clearable>
                       <el-option v-for="item in area_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                   </el-select>
                   <span>.{{this.domainname}}</span>
              </el-form-item>
              <el-form-item label="主机记录" v-if="update_form.purpose === 'backend'" prop="recode_rr">
                  <el-input v-if="update_form.is_inside === true" v-model.trim="select_backend" placeholder="ali" style="width:10%;"></el-input>
                  <el-input v-if="update_form.is_inside === false" v-model.trim="select_backend" placeholder="aliapi" style="width:10%;"></el-input>
                  <span v-if="update_form.is_online === false">-</span>
                  <el-select
                    v-model="select_env"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width:15%;"
                    v-if="update_form.is_online === false"
                    >
                    <el-option
                      v-for="item in env_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                   </el-select>
                   <span>.{{domainname}}</span>
              </el-form-item>
              <el-form-item label="主机记录" v-if="update_form.purpose === 'frontend'" prop="recode_rr">
                  <div>
                    <el-input v-model="select_frontend" style="width:10%;"></el-input>
                    <span v-if="update_form.is_online === false">-</span>
                    <el-select
                    v-model="select_env"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width:15%;"
                    v-if="update_form.is_online === false"
                    >
                    <el-option
                      v-for="item in env_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                   </el-select>
                   <span>.{{domainname}}</span>
                  </div>
                  
              </el-form-item>
              <el-form-item label="记录值" prop="recode_value">
                  <el-input v-model="update_form.recode_value" style="width:50%;"></el-input>
              </el-form-item>
              <el-form-item label="优先级" v-if="update_form.recode_type === 'MX'" >
                  <el-select v-model="update_form.recode_priority" style="width:50%;">
                      <el-option v-for="item in priority_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="解析线路" v-if="zone_type === 'PublicZone'">
                  <el-select v-model="update_form.recode_line" style="width:50%;">
                      <el-option v-for="item in line_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="TTL" v-if="zone_type === 'PublicZone'">
                  <el-select v-model="update_form.recode_ttl" style="width:50%;">
                      <el-option v-for="item in ttl_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="理由" prop="remasks">
                <el-input type="textarea" v-model="update_form.remasks" style="width:50%;"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="update_dialog = false">取 消</el-button>
            <el-button type="primary" @click="updateRRSubmit('update_form')">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
         title="增加记录"
         :visible.sync="create_dialog"
         width="55%"
         :before-close="handleClose">
          <el-form :model="create_form" ref="create_form" :rules="rules" label-width="80px">
              <el-form-item label="记录类型" prop="recode_type">
                  <el-select v-model="create_form.recode_type" style="width:50%;">
                      <el-option v-for="item in type_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="生产域名" prop="is_online">
                <el-radio-group v-model="create_form.is_online">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用途" prop="purpose">
                <el-radio-group v-model="create_form.purpose">
                  <el-radio label="database" v-if="dba_permission===true">数据库</el-radio>
                  <el-radio label="backend" v-if="devops_permission===true">后端</el-radio>
                  <el-radio label="frontend" v-if="devops_permission===true">前端</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="主机记录" v-if="create_form.purpose === 'database'" prop="recode_rr">
                  <el-input v-model.trim="select_db" style="width:20%;" clearable></el-input>
                  <span>-</span>
                  <el-input v-model.trim="db_slave" placeholder="slave1" style="width:10%;"></el-input>
                  <span>.</span>
                  <el-select v-model="db_type" style="width:15%;" clearable>
                      <el-option v-for="item in db_type_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                  <span>.</span>
                  <el-select
                    v-model="select_env"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width:15%;"
                    >
                    <el-option
                      v-for="item in env_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                   </el-select>
                   <span>.</span>
                   <el-select v-model="select_area" style="width:15%" clearable>
                       <el-option v-for="item in area_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                   </el-select>
                   <span>.{{this.domainname}}</span>
              </el-form-item>
              <el-form-item label="主机记录" v-if="create_form.purpose === 'backend'" >
                  <el-input v-if="create_form.is_inside === true" v-model.trim="select_backend" placeholder="ali" style="width:10%;"></el-input>
                  <el-input v-if="create_form.is_inside === false" v-model.trim="select_backend" placeholder="aliapi" style="width:10%;"></el-input>
                  <span v-if="create_form.is_online === false">-</span>
                  <el-select
                    v-model="select_env"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width:15%;"
                    v-if="create_form.is_online === false"
                    >
                    <el-option
                      v-for="item in env_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                   </el-select>
                   <span>.{{domainname}}</span>
              </el-form-item>
              <el-form-item label="主机记录" v-if="create_form.purpose === 'frontend'">
                  <div>
                    <el-input v-model="select_frontend" style="width:10%;"></el-input>
                    <span v-if="create_form.is_online === false">-</span>
                    <el-select
                    v-model="select_env"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width:15%;"
                    v-if="create_form.is_online === false"
                    >
                    <el-option
                      v-for="item in env_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                   </el-select>
                   <span>.{{domainname}}</span>
                  </div>
                  
              </el-form-item>
              <el-form-item label="记录值" prop="recode_value">
                  <el-input v-model="create_form.recode_value" style="width:50%;"></el-input>
              </el-form-item>
              <el-form-item label="优先级" v-if="create_form.recode_type === 'MX'" >
                  <el-select v-model="create_form.recode_priority" style="width:50%;">
                      <el-option v-for="item in priority_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="解析线路" v-if="zone_type === 'PublicZone'">
                  <el-select v-model="create_form.recode_line" style="width:50%;">
                      <el-option v-for="item in line_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="TTL" v-if="zone_type === 'PublicZone'">
                  <el-select v-model="create_form.recode_ttl" style="width:50%;">
                      <el-option v-for="item in ttl_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="理由" prop="remasks">
                <el-input type="textarea" v-model="create_form.remasks" style="width:50%;"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="create_dialog = false">取 消</el-button>
            <el-button type="primary" @click="createRRSubmit('create_form')">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import pagination from '@/components/Pagination/pagination'
import {isIp} from '@/utils/validate'
export default {
    name: 'dns_detail',
    components: {
      pagination,
      isIp
    },
    data() {
        return {
          tableData: [],
          total: 0,
          page:1,
          limit: 10,
          type_options: [
              {value: 'A', label: 'A'},
              {value: 'CNAME', label: 'CNAME'},
              {value: 'TXT', label: 'TXT'},
              {value: 'AAAA', label: 'AAAA'},
              {value: 'NS', label: 'NS'},
              {value: 'MX', label: 'MX'},
              {value: 'SRV', label: 'SRV'},
              {value: 'CAA', label: 'CAA'}
          ],
          db_type_options: [
            {value: 'mysql', label: 'mysql'},
            {value: 'redis', label: 'redis'},
            {value: 'mongodb', label: 'mongodb'},
            {value: 'oracle', label: 'oracle'},
            {value: 'adb', label: 'adb'},
            {value: 'sqlserver', label: 'sqlserver'},
            {value: 'drds', label: 'drds'}
          ],
          area_options: [
            {value: 'hz', label: '杭州'},
            {value: 'sh', label: '上海'},
            {value: 'qd', label: '青岛'},
            {value: 'bj', label: '北京'},
            {value: 'zjk', label: '张家口'},
            {value: 'hhht', label: '呼和浩特'},
            {value: 'sz', label: '深圳'},
            {value: 'cd', label: '成都'},
            {value: 'hk', label: '香港'},
            {value: 'sgp', label: '新加坡'},
            {value: 'sdn', label: '悉尼'},
            {value: 'klp', label: '吉隆坡'},
            {value: 'tk', label: '东京'},
            {value: 'fkf', label: '法兰克福'},
            {value: 'ld', label: '伦敦'},
            {value: 'sv', label: '硅谷'},
            {value: 'vgn', label: '佛吉尼亚'},
            {value: 'jkt', label: '雅加达'},
            {value: 'mb', label: '孟买'},
            {value: 'db', label: '迪拜'}
          ],
          priority_options: [
            {value:1,label:1},
            {value:2,label:2},
            {value:3,label:3},
            {value:4,label:4},
            {value:5, label:5},
            {value:6, label:6},
            {value:7, label:7},
            {value:8, label:8},
            {value:9, label:9},
            {value:10, label:10} 
          ],
          ttl_options: [
            {value: 600, label: '10m'},
            {value: 1800, label: '30m'},
            {value: 3600, label: '1h'},
            {value: 43200, label: '12h'},
            {value: 86400, label: '24h'}
          ],
          line_options: [
            {value: 'default', label: '默认'},
            {value: 'telecom', label: '电信'},
            {value: 'unicom', label:'联通'},
            {value: 'mobile', label: '移动'},
            {value: 'oversea', label: '海外'},
            {value: 'edu', label: '教育网'}
          ],
          select_val: 'A',
          search_type: 'accurate',
          search_content: '',
          pause_dialog: false,
          pause_data: '',
          delete_dialog: false,
          delete_data: '',
          update_dialog: false,
          create_dialog: false,
          create_form: {
            ZoneId: '',
            recode_rr: '',
            recode_type: '',
            recode_value: '',
            recode_priority: 1,
            recode_ttl: 60,
            is_inside: false,
            purpose: 'backend',
            is_online: false,
            domain_name: '',
            recode_line: '',
            remasks: ''
          },
          update_form: {
              recode_id: '',
              recode_rr: '',
              recode_type: '',
              recode_value: '',
              recode_priority: 1,
              recode_ttl: 0,
              is_inside: false,
              purpose: 'backend',
              is_online: false,
              domain_name: '',
              recode_line: '',
              remasks: ''
          },
          select_db: '',
          db_slave: '',
          db_type: 'mysql',
          env_options: [],
          select_env: 'dev',
          select_area: 'bj',
          select_backend: '',
          select_frontend: '',
          rules:{
              recode_rr: [
                  {required: true, message: '此为必选项', trigger: blur}
              ],
              recode_type: [
                  {required: true, message: '此为必选项', trigger: blur}
              ],
              recode_value: [
                  {required: true, message: '此为必选项', trigger: blur}
              ],
              purpose: [
                  {required: true, message: '此为必选项', trigger: blur}
              ],
              is_online: [
                  {required: true, message: '此为必选项', trigger: blur}
              ],
              remasks: [
                {required: true, message: '此为必填项', trigger: blur}
              ]
          }
        
        }
    },
    methods: {
        init() {
          this.$store.dispatch('get_dns', {type: this.zone_type, domainName: this.domainname}).then(resp => {
            this.tableData = resp.data.data
            this.total = resp.data.total
          }).catch(err => {
              this.$message({message: '获取数据失败 ' + err, type: 'error'})
          })
          this.$store.dispatch('get_env').then(res => {
                this.env_options = res.data.data.map(item => {
                    return {value: item.code, label: item.code}
                })
            }).catch(err => {
                this.$message({message:'获取数据失败' + err, type: 'error'})
            })
          
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
        },
        updateOpenDialog(row){
          if (this.domainname === undefined || this.zone_type === undefined||this.domainname === '' || this.zone_type === ''){
            this.$message({message: '域名为空或者zone类型为空，请重新请求该网页', type: 'error'})
          } else {
           this.update_dialog = true
           if(this.zone_type === 'PrivateZone'){
             this.update_form['recode_id'] = row.recordid
             this.update_form['recode_rr'] = row.rr
             this.update_form['recode_type'] = row.type
             this.update_form['recode_value'] = row.value
             this.update_form['recode_priority'] = 1
             this.update_form['recode_ttl'] = row.ttl
             this.update_form['is_inside'] = true
             this.update_form['purpose'] = 'backend'
             this.update_form['is_online'] = false
             this.update_form['domain_name'] = this.domainname
           }
           if(this.zone_type === 'PublicZone'){
             this.update_form['recode_id'] = row.recordid
             this.update_form['recode_rr'] = row.rr
             this.update_form['recode_type'] = row.type
             this.update_form['recode_value'] = row.value
             this.update_form['recode_priority'] = 1
             this.update_form['recode_ttl'] = row.ttl
             this.update_form['is_inside'] = false
             this.update_form['purpose'] = 'backend'
             this.update_form['is_online'] = false
             this.update_form['domain_name'] = this.domainname
             this.update_form['recode_line'] = 'default'
           }
          }
        },
        pauseOpenDialog(row) {
          if (this.domainname === undefined || this.zone_type === undefined||this.domainname === '' || this.zone_type === ''){
            this.$message({message: '域名为空或者zone类型为空，请重新请求该网页', type: 'error'})
          } else {
            this.pause_dialog = true
            this.pause_data = row
          }
            
        },
        pauseRRSubmit() {
          if(this.zone_type ==='PrivateZone') {
            this.$store.dispatch('pause_private_record', {recode_id: this.pause_data.recordid, recode_status: this.pause_data.status === 'DISABLE'?'ENABLE':'DISABLE', ZoneId: this.zone_id}).then(resp => {
              this.pause_dialog = false
              if(resp.data.code === 200 || resp.data.code === 201){
                this.$message({message: this.pause_data.status === 'DISABLE'?'开启成功':'暂停成功', type: 'success'})
                this.handleFilter()
              } else {
                this.$message({message: this.pause_data.status === 'DISABLE'?'开启失败':'暂停失败' + resp.data.msg, type: 'error'})
              }
            }).catch(err => {
                this.pause_dialog = false
                this.$message({message: '操作失败 ' + err, type: 'error'})
            })
          } 
          if(this.zone_type ==='PublicZone') {
            this.$store.dispatch('pause_public_record', {recode_id: this.pause_data.recordid, recode_status: this.pause_data.status.toUpperCase() === 'DISABLE'?'ENABLE':'DISABLE', ZoneId: this.zone_id}).then(resp => {
              this.pause_dialog = false
              if(resp.data.code === 200 || resp.data.code === 201){
                this.$message({message: this.pause_data.status.toUpperCase() === 'DISABLE'?'开启成功':'暂停成功', type: 'success'})
                this.handleFilter()
              } else {
                this.$message({message: this.pause_data.status.toUpperCase() === 'DISABLE'?'开启失败':'暂停失败' + resp.data.msg, type: 'error'})
              }
            }).catch(err => {
                this.pause_dialog = false
                this.$message({message: '操作失败 ' + err, type: 'error'})
            })
          } 

        },
        deleteRRSubmit(){
          if(this.zone_type === 'PrivateZone'){
            this.$store.dispatch('delete_private_record', {recode_id: this.delete_data.recordid}).then(resp => {
                this.delete_dialog = false
                if(resp.data.code === 200 || resp.data.code === 201){
                  this.$message({message: '删除成功', type: 'success'})
                  this.handleFilter()
                } else {
                    this.$message({message: '删除失败 ' + resp.data.data, type: 'error' })
                }
            }).catch(err => {
                this.delete_dialog = false
                this.$message({message: '删除失败 ' + err, type: 'error'})
            })
          } 
          if(this.zone_type === 'PublicZone'){
            this.$store.dispatch('delete_public_record', {recode_id: this.delete_data.recordid}).then(resp => {
                this.delete_dialog = false
                if(resp.data.code === 200 || resp.data.code === 201){
                  this.$message({message: '删除成功', type: 'success'})
                  this.handleFilter()
                } else {
                    this.$message({message: '删除失败 ' + resp.data.data, type: 'error' })
                }
            }).catch(err => {
                this.delete_dialog = false
                this.$message({message: '删除失败 ' + err, type: 'error'})
            })
          }
        },
        updateRRSubmit(formName){
          this.$refs[formName].validate((valid) => {
              if(valid) {
                  if(this.update_form.purpose === 'database') {
                      if(this.select_db === ''){
                        this.$message({message: 'dbname不能为空', type: 'error'})
                        this.update_dialog = false
                      }
                      if(this.db_slave != ''){
                          this.update_form.recode_rr = this.select_db + '-' + this.db_slave+ '.'+this.db_type + '.' +this.select_env + '.' + this.select_area 
                      } else {
                          this.update_form.recode_rr = this.select_db + '.'+this.db_type + '.' +this.select_env + '.' + this.select_area
                      }
                  } else if (this.update_form.purpose === 'backend') {
                      if(this.select_backend==='') {
                          this.$message({message: '解析记录不能为空', type: 'error'})
                          this.update_dialog = false
                      } else {
                        if(this.update_form.is_online === false) {
                          this.update_form.recode_rr = this.select_backend + '-'+ this.select_env
                        } else {
                          this.update_form.recode_rr = this.select_backend
                        }
                      }
                  } else if(this.update_form.purpose === 'frontend'){
                    if(this.select_frontend === ''){
                        this.$message({message: '解析记录不能为空', type: 'error'})
                        this.update_dialog = false
                    }  else {
                      if(this.update_form.is_online === false) {
                          this.update_form.recode_rr = this.select_frontend + '-'+ this.select_env
                      } else {
                          this.update_form.recode_rr = this.select_frontend
                      }
                    }
                  }
                  const s = 0
                  if(this.update_form.recode_type === 'A'){
                    if(!isIp(this.update_form.recode_value)){
                      this.$message({message: '记录类型和记录值不匹配', type: 'error'}) 
                      this.update_dialog = false
                      this.s = 0
                    } else {
                      this.s = 1
                    }
                  } else if(this.update_form.recode_type === 'CNAME') {
                    if(isIp(this.update_form.recode_value)){
                      this.$message({message: '记录类型和记录值不匹配', type: 'error'}) 
                      this.update_dialog = false
                      this.s = 0
                    } else {
                      this.s = 1
                    }
                  }
                  if(this.zone_type === 'PrivateZone' && this.s==1){
                    delete this.update_form.recode_line
                    this.$store.dispatch('update_private_record', this.update_form).then(resp => {
                      this.update_dialog = false
                      if(resp.data.code === 201 || resp.data.code === 200) {
                        this.init()
                        this.$message({message: '修改成功', type: 'success'})
                      } else {
                        this.$message({message: '修改失败 ' + resp.data.data, type: 'error'})
                      }
                    }).catch(err => {
                      this.update_dialog = false
                      this.$message({message: '修改失败 ' + err, type: 'error'})
                    })
                  }
                  if(this.zone_type === 'PublicZone' && this.s==1){
                    this.$store.dispatch('update_public_record', this.update_form).then(resp => {
                      this.update_dialog = false
                      if(resp.data.code === 201 || resp.data.code === 200) {
                        this.init()
                        this.$message({message: '修改成功', type: 'success'})
                      } else {
                        this.$message({message: '修改失败 ' + resp.data.data, type: 'error'})
                      }
                    }).catch(err => {
                      this.update_dialog = false
                      this.$message({message: '修改失败 ' + err, type: 'error'})
                    })
                  }
                  
              } else {
                this.update_dialog = false
                this.$message({message: '数据非法', type: 'error'})
              }
          })
        },
        createRRSubmit(formName){
          
          this.$refs[formName].validate((valid) => {
              if(valid) {
                  if(this.create_form.purpose === 'database') {
                      if(this.select_db === ''){
                        this.$message({message: 'dbname不能为空', type: 'error'})
                        this.create_dialog = false
                      }
                      if(this.db_slave != ''){
                          this.create_form.recode_rr = this.select_db + '-' + this.db_slave+ '.'+this.db_type + '.' +this.select_env + '.' + this.select_area 
                      } else {
                          this.create_form.recode_rr = this.select_db + '.'+this.db_type + '.' +this.select_env + '.' + this.select_area
                      }
                  } else if (this.create_form.purpose === 'backend') {
                      if(this.select_backend==='') {
                          this.$message({message: '解析记录不能为空', type: 'error'})
                          this.create_dialog = false
                      } else {
                        if(this.create_form.is_online === false) {
                          this.create_form.recode_rr = this.select_backend + '-'+ this.select_env
                        } else {
                          this.create_form.recode_rr = this.select_backend
                        }
                      }
                  } else if(this.create_form.purpose === 'frontend'){
                    if(this.select_frontend === ''){
                        this.$message({message: '解析记录不能为空', type: 'error'})
                        this.create_dialog = false
                    }  else {
                      if(this.create_form.is_online === false) {
                          this.create_form.recode_rr = this.select_frontend + '-'+ this.select_env
                      } else {
                          this.create_form.recode_rr = this.select_frontend
                      }
                    }
                  }
                  const s = 0
                  if(this.create_form.recode_type === 'A'){
                    if(!isIp(this.create_form.recode_value)){
                      this.$message({message: '记录类型和记录值不匹配', type: 'error'}) 
                      this.create_dialog = false
                      this.s = 0
                    } else {
                      this.s = 1
                    }
                  } else if(this.create_form.recode_type === 'CNAME') {
                    if(isIp(this.create_form.recode_value)){
                      this.$message({message: '记录类型和记录值不匹配', type: 'error'}) 
                      this.create_dialog = false
                      this.s = 0
                    } else {
                      this.s = 1
                    }
                  }
                  if(this.zone_type === 'PrivateZone' && this.s==1){
                    delete this.create_form.recode_line
                    this.$store.dispatch('create_private_record', this.create_form).then(resp => {
                      this.create_dialog = false
                      if(resp.data.code === 201 || resp.data.code === 200) {
                        this.init()
                        this.$message({message: '修改成功', type: 'success'})
                      } else {
                        this.$message({message: '修改失败 ' + resp.data.data, type: 'error'})
                      }
                    }).catch(err => {
                      this.create_dialog = false
                      this.$message({message: '修改失败 ' + err, type: 'error'})
                    })
                  }
                  if(this.zone_type === 'PublicZone' && this.s==1){
                    this.$store.dispatch('create_public_record', this.create_form).then(resp => {
                      this.create_dialog = false
                      if(resp.data.code === 201 || resp.data.code === 200) {
                        this.init()
                        this.$message({message: '修改成功', type: 'success'})
                      } else {
                        this.$message({message: '修改失败 ' + resp.data.data, type: 'error'})
                      }
                    }).catch(err => {
                      this.create_dialog = false
                      this.$message({message: '修改失败 ' + err, type: 'error'})
                    })
                  }
                  
              } else {
                this.create_dialog = false
                this.$message({message: '数据非法', type: 'error'})
              }
          })
        },
        createOpenDialog() {
          this.create_dialog = true
          if(this.zone_type === 'PrivateZone'){
             this.create_form['ZoneId'] = this.zone_id
             this.create_form['recode_priority'] = 1
             this.create_form['is_inside'] = true
             this.create_form['purpose'] = 'backend'
             this.create_form['is_online'] = false
             this.create_form['domain_name'] = this.domainname
           }
           if(this.zone_type === 'PublicZone'){
             this.create_form['ZoneId'] = this.zone_id
             this.create_form['recode_priority'] = 1
             this.create_form['is_inside'] = false
             this.create_form['purpose'] = 'backend'
             this.create_form['is_online'] = false
             this.create_form['recode_line'] = 'default'
             this.create_form['domain_name'] = this.domainname
             this.create_form['recode_ttl'] = 600
           }
        },
        deleteOpenDialog(row){
          if (this.domainname === undefined || this.zone_type === undefined||this.domainname === '' || this.zone_type === ''){
            this.$message({message: '域名为空或者zone类型为空，请重新请求该网页', type: 'error'})
          } else {
            this.delete_dialog = true
            this.delete_data = row
          }
        },
        cellSelfStyle(row, column, rowIndex, columnIndex){
          if(row.columnIndex == 4) {
              
              if(row.row.status.toUpperCase() == 'ENABLE'){
                  return 'normal_status'
              } else {
                  return 'error_status'
              }
           }
        },
        getList() {
          let data = {}
          if (this.domainname === undefined || this.zone_type === undefined||this.domainname === '' || this.zone_type === ''){
            this.$message({message: '域名为空或者zone类型为空，请重新请求该网页', type: 'error'})
          } else {
            data['domainName'] = this.domainname
            data['type'] = this.zone_type
            if(this.select_val != ''){
              data['recodeType'] = this.select_val 
            }
            if(this.search_type != ''){
              data['searchType'] = this.search_type
            }
            data['pageSize'] = this.limit
            data['pageNumber'] = this.page
            this.$store.dispatch('get_dns', data).then(resp => {
                this.tableData =resp.data.data
                this.total = resp.data.total
            })
          }

        },
        handleFilter() {
          let data = {}
          if (this.domainname === undefined || this.zone_type === undefined||this.domainname === '' || this.zone_type === ''){
            this.$message({message: '域名为空或者zone类型为空，请重新请求该网页', type: 'error'})
          } else {
            data['domainName'] = this.domainname
            data['type'] = this.zone_type
            if(this.select_val != ''){
              data['recodeType'] = this.select_val 
            }
            if(this.search_type != ''){
              data['searchType'] = this.search_type
            }
            if(this.search_content != '') {
              data['rr'] = this.search_content
              this.$store.dispatch('get_dns', data).then(resp => {
                  if(resp.data.total==0) {
                      delete data.rr
                      data['value'] = this.search_content
                      this.$store.dispatch('get_dns', data).then(res => {
                          this.tableData = res.data.data
                          this.total = res.data.total
                      }).catch(err => {
                          this.$message({message: '获取数据失败 ' + err, type: 'error'})
                      })
                  } else {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                  }
              }).catch(err => {
                  this.$message({message: '获取数据失败 '+ err, type: 'error'})
              })
            } else {
              this.$store.dispatch('get_dns', data).then(resp => {
                  this.tableData = resp.data.data
                  this.total = resp.data.total
              }).catch(err => {
                  this.$message({message: '获取数据失败 ' +err, type: 'error'})
              })
            }
          }
        }
    },
    mounted(){
      this.init()
    },
    computed: {
         zone_type() {
             return this.$route.params.zone_type
         },
         domainname() {
             if(this.$route.params.zone_type === 'PrivateZone'){
               return this.$route.params.rowData.zonename
             } else if (this.$route.params.zone_type === 'PublicZone') {
                 return this.$route.params.rowData.domainname
             }
         },
         zone_id() {
             if(this.$route.params.zone_type === 'PrivateZone'){
               return this.$route.params.rowData.zoneid
             } else if (this.$route.params.zone_type === 'PublicZone') {
                 return this.$route.params.rowData.domainid
             }
         },
         disable() {
             if (localStorage.roles.includes('devops') || localStorage.roles.includes('dba')) {
               return false
             } else {
                 return true
             }
         },
         devops_permission() {
           if (localStorage.roles.includes('devops')) {
               return true
             } else {
                 return false
             }
         },
         dba_permission() {
           if (localStorage.roles.includes('dba')) {
               return true
             } else {
                 return false
             }
         }
    }

}
</script>

<style scoped>
  .head {
    font-family: "微软雅黑";
    font-size: 22px;
    color: black;
    margin-bottom: 20px;
   }
  .normal_status {
      color: #009900;
  }
  .error_status {
      color: #ff9900;
  }
</style>