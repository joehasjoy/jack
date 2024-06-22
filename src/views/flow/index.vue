<template>
  <div class="app-container">
    <div>
      <div class="my-header">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="我启动的" name="my-start">
            <div>
              <!-- <el-input placeholder="请输入标题" style="width:20%;" suffix-icon="el-icon-search"></el-input> -->
              <el-select v-model="proc_def_key" @change="handleSelect">
                <el-option v-for="(item, index) in flow_options" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="my-content">
              <div>
                <div style="height:10px;background:#f0f0f0c9;"></div>
                <el-row type="flex" justify="end" class="my-middle">
                    <el-col :span="1"> 
                        <el-button  size="mini" @click="openNewTicket">新建</el-button>
                    </el-col>
                  
                </el-row>
              </div>
              <el-table :header-cell-style="headerCellClassName" :data="mystart_table">
                <el-table-column label="序号" prop="procInstId"></el-table-column>
                <el-table-column label="标题" prop="procInstName"></el-table-column>
                <el-table-column label="流程" prop="procDefName"></el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="scope">
                    <span>{{scope.row.startTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleDetail(scope.row)" size="mini" type="primary">查询详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
               <pagination v-show="start_total>0" :total="start_total" :page.sync="start_page" :limit.sync="start_limit"  
                 @pagination="getList" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="已办理的" name="my-todo">
            <div>
              <!-- <el-input placeholder="请输入标题" style="width:20%;" suffix-icon="el-icon-search"></el-input> -->
              <el-select v-model="proc_def_key" @change="handleSelect">
                <el-option v-for="(item, index) in flow_options" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="my-content">
              <div>
                <div style="height:10px;background:#f0f0f0c9;"></div>
                <el-row type="flex" justify="end" class="my-middle">
                    <el-col :span="1"> 
                        <el-button  size="mini" @click="openNewTicket">新建</el-button>
                    </el-col>
                  
                </el-row>
              </div>
              <el-table :header-cell-style="headerCellClassName" :data="todo_table">
                <el-table-column label="序号" prop="procInstId"></el-table-column>
                <el-table-column label="标题" prop="procInstName"></el-table-column>
                <el-table-column label="流程" prop="procDefName"></el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="scope">
                    <span>{{scope.row.startTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleDetail(scope.row)" size="mini" type="primary">查询详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
               <pagination v-show="todo_total>0" :total="todo_total" :page.sync="todo_page" :limit.sync="todo_limit"  
                 @pagination="getList" />
            </div>
           
          </el-tab-pane>
          <el-tab-pane label="我的待办" name="my-audit">
            <div>
              <!-- <el-input placeholder="请输入标题" style="width:20%;" suffix-icon="el-icon-search"></el-input> -->
              <el-select v-model="proc_def_key" @change="handleSelect">
                <el-option v-for="(item, index) in flow_options" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="my-content">
              <div>
                <div style="height:10px;background:#f0f0f0c9;"></div>
                <el-row type="flex" justify="end" class="my-middle">
                    <el-col :span="1"> 
                        <el-button  size="mini" @click="openNewTicket">新建</el-button>
                    </el-col>
                  
                </el-row>
              </div>
              <el-table :header-cell-style="headerCellClassName" :data="audit_table">
                <el-table-column label="序号" prop="procInstId"></el-table-column>
                <el-table-column label="标题" prop="procInstName"></el-table-column>
                <el-table-column label="流程" prop="procDefName"></el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="scope">
                    <span>{{scope.row.startTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleDetail(scope.row)" size="mini" type="primary">查询详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
               <pagination v-show="audit_total>0" :total="audit_total" :page.sync="audit_page" :limit.sync="audit_limit"  
                 @pagination="getList" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
     title="选择模版"
     :visible.sync="newDialog"
     width="30%">
     <div>
      <el-select v-model="selectFlow">
        <el-option v-for="(item, index) in flow_options" 
        :key="index" :label="item.label" 
        :value="item.value"></el-option>
      </el-select>
     </div>
     <span slot="footer" class="dialog-footer">
      <el-button @click="submitNewTicket" type="primary">确定</el-button>
      <el-button  @click="newDialog = false">取消</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/pagination'
//import {Date} from '@/utils/datetime'
export default {
    name: 'myself-flow',
    components: {
      pagination
    },
    data(){
        return {
          activeName: 'my-start',
          start_total: 0,
          start_page: 0,
          start_limit: 10,
          todo_total: 0,
          todo_page: 0,
          todo_limit: 10,
          audit_total:0,
          audit_page: 0,
          audit_limit: 10,
          newDialog: false,
          selectFlow: '',
          flow_options: [],
          proc_def_key: 'application_apply_approve',
          mystart_table: [],
          todo_table: [],
          audit_table: []
        }
    },
    methods: {
        init(){
          //初始化
          this.$store.dispatch('get_flow_list', {pageNumber: 0, pageSize: 100, email: localStorage.username}).then(resp => {
            this.flow_options = []
            const data = resp.data.data
            data.map(item => {
              this.flow_options.push({label: item.describe, value: item.proc_def_key})
            })
          }).catch(err => {
            this.newDialog = false
            this.$message({message: '获取流程信息失败 '+ err, type: 'error'})
          })

          if(this.proc_def_key != ''){
            this.get_tasks()
          }
        },
        handleTabClick(tab, event){
          this.activeName = tab.name
          this.get_tasks()
          
        },
        headerCellClassName(row, column, rowIndex, columnIndex){
          
          return 'color:#303133;'
        },
        getList(){
          this.get_tasks()
        },
        openNewTicket(){
          //新建按钮打开事件
          this.newDialog = true
          // this.$store.dispatch('get_flow_list', {pageNumber: 0, pageSize: 100}).then(resp => {
          //   this.flow_options = []
          //   const data = resp.data.data
          //   data.map(item => {
          //     this.flow_options.push({label: item.describe, value: item.proc_def_key})
          //   })
          // }).catch(err => {
          //   this.newDialog = false
          //   this.$message({message: '获取流程信息失败 '+ err, type: 'error'})
          // })
        },
        submitNewTicket(){
          //发起一个流程事件
          if(this.selectFlow === ''){
            this.$message({message: '请选择流程', type: 'error'})
          } else {
            this.$router.push({
              name: 'new_flow',
              params:  {
                key: this.selectFlow
              }
            })
            this.newDialog = false
          }
          
        },
        formatDate(d,fmt) {
          var o = { 
            "M+" : d.getMonth()+1,                 //月份 
            "d+" : d.getDate(),                    //日 
            "h+" : d.getHours(),                   //小时 
            "m+" : d.getMinutes(),                 //分 
            "s+" : d.getSeconds(),                 //秒 
            "q+" : Math.floor((d.getMonth()+3)/3), //季度 
            "S"  : d.getMilliseconds()             //毫秒 
          }
          if(/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length)) 
          }
          for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))
            }
          }
          return fmt
        },
        get_tasks(){
          //发起查询任务请求
          if(this.activeName === 'my-start') {
            this.$store.dispatch('get_myself_task', {pageSize: this.start_limit, pageNum: this.start_page - 1,
            proc_def_key: this.proc_def_key, ticket_id: localStorage.ticket, email: localStorage.username}).then(resp => {
              this.mystart_table = []
              const temp = resp.data.data.data
              temp.map(item => {
                item.startTime = this.formatDate(new Date(item.startTime), 'yyyy-MM-dd hh:mm:ss')
              })
              this.mystart_table = temp
              this.start_total = resp.data.data.total
            })
          } else if(this.activeName === 'my-todo'){
            this.$store.dispatch('get_todo_task', {pageSize: this.todo_limit, pageNum: this.todo_page - 1,
              proc_def_key: this.proc_def_key, ticket_id: localStorage.ticket, email: localStorage.username}).then(resp => {
                this.todo_table = []
                const temp = resp.data.data.data
                temp.map(item => {
                  item.startTime = this.formatDate(new Date(item.startTime), 'yyyy-MM-dd hh:mm:ss')
                })
              this.todo_table = temp
              this.todo_total = resp.data.data.total
              })
          } else if(this.activeName === 'my-audit') {
            this.$store.dispatch('get_audit_task', {pageSize: this.audit_limit, pageNum: this.audit_page - 1,
              proc_def_key: this.proc_def_key, ticket_id: localStorage.ticket}).then(resp => {
                
                this.audit_table = []
                const temp = resp.data.data.data
                temp.map(item => {
                  item.startTime = this.formatDate(new Date(item.startTime), 'yyyy-MM-dd hh:mm:ss')
                })
              this.audit_table = temp
              this.audit_total = resp.data.data.total
            
              })
          }
          
      
        },
        handleSelect(val){
          //监听select改变事件
          this.proc_def_key = val
          this.get_tasks()
        },

        handleDetail(row){
          //查询详情事件
          if(this.activeName === 'my-start'){
            const tasks = row.tasks
            this.$router.push({
              name: 'detail_flow',
              params:  {
                proc_inst_id: row.procInstId,
                business_key: row.businessKey,
                proc_def_key: row.procDefKey,
                task_def_key: tasks[tasks.length - 1].taskDefKey,
                active_name: this.activeName,
              }
            })
          } else {
            this.$router.push({
              name: 'detail_flow',
              params:  {
                proc_inst_id: row.procInstId,
                business_key: row.businessKey,
                proc_def_key: row.procDefKey,
                task_def_key: row.taskDefKey,
                active_name: this.activeName,
              }
            })
          }
          
        }
    },
    mounted() {
      this.init()
    }
}
</script>

<style scoped>
  .my-header {
      margin:  20px;
  }
  .my-content{
      border-top: 1px #e6e6e6 solid;
      margin-top: 10px;
  }
  .my-middle {
    border-bottom:1px #e6e6e6 solid;
    height: 50px;
    line-height: 50px;
  }
  .my-middle-button {
      float: right;
  }
  .table-header-cell {
      color: rgba(37, 35, 35, 0);
  }
</style>