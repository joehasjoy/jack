<template>

    <el-card style="margin: 10px">
      集群
      <el-select v-model="$store.state.kube.env_id" filterable placeholder="集群" style="width: 160px" @change="ChangeKubeCluster">
        <el-option :label="item.name" :value="item.id" v-for="(item,index) in $store.state.kube.env_list" :key="index"></el-option>
      </el-select>
      命名空间
      <el-select v-model="$store.state.kube.ns_id" filterable placeholder="命名空间" style="width: 240px" @change="ChangeNS">
        <el-option :label="item.name" :value="item.id" v-for="(item,index) in $store.state.kube.ns_list" :key="index"></el-option>
      </el-select>

      <el-input v-model="search" placeholder="请输入搜索内容" style="width: 300px;float: right" @input="waitTableChange"></el-input>
      <el-button style="float: right" @click="ChangeNS()">刷新</el-button>

      <el-table id="out-table" v-loading="$store.state.kube.loading"
        :data="tables.slice((page-1)*limit,page*limit)" border
        style="width: 100%;margin-top: 10px;" size="mini" :fit="true">
        <el-table-column label="名称" prop="name" :show-overflow-tooltip="false">
          <template slot-scope="scope">
            <a @click="colClick(scope.row, 'event')">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column label="Ready" prop="" align="center" width="70">
          <template slot-scope="scope">
            <template v-if="scope.row.container_count ===scope.row.container_run">
              <span style="cursor: pointer;color: #33cb01"  @click="GetTgtEvent(event_url,scope.row)">{{scope.row.container_run}}/{{scope.row.container_count}}</span>
            </template>
            <template v-else>
              <span style="cursor: pointer;color: red" @click="GetTgtEvent(event_url,scope.row)">{{scope.row.container_run}}/{{scope.row.container_count}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state" align="center" width="90">
          <template slot-scope="scope">
            <el-tooltip effect="dark"  placement="right" >
              <div slot="content" v-html="statusInfo(scope.row.detail)"></div>
              <div v-if="scope.row.detail.status.conditions.length===4 && scope.row.detail.status.conditions[0]['status']==='True' && scope.row.detail.status.conditions[1]['status']==='True' &&
scope.row.detail.status.conditions[2]['status']==='True' && scope.row.detail.status.conditions[3]['status']==='True'">
                <span style="width: 16px;height: 16px;background-color: #33cb01;display: inline-block;border-radius: 50%; vertical-align:middle;"></span>
                <span style="color: #33cb01">运行中</span>
              </div>
              <div v-else-if="scope.row.detail.status.conditions.length===4 &&  scope.row.detail.status.conditions[0]['status']==='False' && scope.row.detail.status.conditions[1]['status']==='False' &&
scope.row.detail.status.conditions[2]['status']==='False' && scope.row.detail.status.conditions[3]['status']==='False'">
                <span style="width: 16px;height: 16px;background-color: red;display: inline-block;border-radius: 50%; vertical-align:middle;"></span>
                <span style="color: red">失败</span></div>
              <div v-else>
                <span style="width: 16px;height: 16px;background-color: #fd9801;display: inline-block;border-radius: 50%; vertical-align:middle;"></span>
                <span style="color: #fd9801">等待中</span></div>
            </el-tooltip >
          </template>
        </el-table-column>
        <el-table-column label="重启" prop="restart_count" align="center" width="50"></el-table-column>
        <el-table-column label="IP" prop="pod_ip" align="" width="">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" style="padding-left: 2px;display: block;font-size: 12px"> Pod: {{scope.row.pod_ip}}</el-link>
            <el-link :underline="false" style="padding: 0;margin-left: 0;color: #C0C4CC;font-size: 12px">节点: {{scope.row.host_ip}}</el-link>
          </template>
        </el-table-column>
<!--        <el-table-column label="节点" prop="host_ip"></el-table-column>-->
        <el-table-column sortable label="创建时间" prop="start_time" align="center" class-name="show_tooltip" width="140"></el-table-column>
        <el-table-column label="CPU" prop="" align="" width="150" class-name="show_tooltip">
          <template slot-scope="scope">
            <div class="echart">
              <div :id="'cpuChart_'+scope.row.name" style="width: 80px;height: 20px;display: inline;float: left"></div>
              <div style="float: right" :id="'last_cpu_'+scope.row.name"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="内存" prop="" align="" width="170" class-name="show_tooltip">
          <template slot-scope="scope">
            <div class="echart">
              <div :id="'memChart_'+scope.row.name" style="width: 80px;height: 20px;display: inline;float: left"></div>
              <div style="float: right" :id="'last_mem_'+scope.row.name"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable label="操作" prop="" align="center" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="colClick(scope.row, 'container')">详细</el-button>
            <el-dropdown size="small" trigger="click" @command="handleCommand">
              <el-button type="primary" size="mini" :plain="true">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{'action': 'edit', 'row': scope.row}">编辑</el-dropdown-item>
                <el-dropdown-item :command="{'action': 'terminal', 'row': scope.row}">终端</el-dropdown-item>
                <el-dropdown-item :command="{'action': 'log', 'row': scope.row}">日志</el-dropdown-item>
                <el-dropdown-item :command="{'action': 'delete', 'row': scope.row}" v-if="common.hasPermission($store.state.user.roles,['kube_admin',  'devops'])">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <pagination :total="total" :page.sync="page" :limit.sync="limit"></pagination>
      </div>
<!--      <div id="cpuChart" style="width: 80px;height: 20px;float: right"></div>-->

<!--      <editor v-model="content" @init="editorInit" lang="yaml" theme="monokai"  width="800" height="300px"></editor>-->
      <!-- 编辑目标 -->
      <el-dialog title="编辑" :visible.sync="dialognTgt" top="30px" width="798px" :close-on-click-modal="false">
        <editor v-model="content" @init="common.editorInit" lang="yaml" theme="merbivore"  width="100%" height="500"></editor>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="common.saveShareContent(content, tempTgtData.metadata.name+'.yaml')">下 载</el-button>
          <el-button type="warning" plain="plain" @click="UpdateTgt(url)" v-if="common.hasPermission($store.state.user.roles,['kube_admin',  'devops'])">更 新</el-button>
          <el-button @click="dialognTgt = false">取 消</el-button>
        </div>
      </el-dialog >



      <el-dialog title="事件" :visible.sync="dialognTgtEvent" top="60px" width="70%" :close-on-click-modal="false">
        <el-table :data="tableDataEvents" style="width: 100%" size="mini">
          <el-table-column prop="type" label="类型" width="120"></el-table-column>
          <el-table-column prop="reason" label="原因" width="140px"></el-table-column>
          <el-table-column prop="creation_timestamp" label="时间" width="180"></el-table-column>
          <el-table-column prop="from" label="来自" :show-overflow-tooltip="true" width="300px"></el-table-column>
          <!--              <el-table-column prop="involvedObject" label="对象" :show-overflow-tooltip="true" width="300px"></el-table-column>-->
          <el-table-column prop="message" label="信息"></el-table-column>
        </el-table>
      </el-dialog >

    </el-card>


</template>

<script>

  // import kube from '../../api/kubernetes.js'
  import pagination from '@/components/Pagination/pagination'
  import YAML from 'yaml'
  import echarts from 'echarts'
  import  'echarts/theme/macarons.js'

  export default {
    name: 'pod',
    data() {
      return {
        dialognTgt: false,
        tableData: [],
        url: this.GLOBAL.service_tag+'/api/kubernetes/pod/',
        usage_url: this.GLOBAL.service_tag+'/api/kubernetes/pod-usage/',
        event_url: this.GLOBAL.service_tag+'/api/kubernetes/event/',
        limit: 10,
        page: 1,
        total: 0,
        search: '',
        global_dict: {'mudule_list': []},
        // env_list: [],
        // ns_list: [],
        // env_id: '',
        // ns_id: '',
        content: '',
        tempTgtData: {},
        tableDataEvents: [],
        dialognTgtEvent: false,
        label_selector: '',
        ns_dict: {},
        cpu_usage: {},
        memory_usage:{},
        usage_timer: '',
    }
    },
    components: {
      editor: require('vue2-ace-editor'),
      pagination: pagination,
    },
    methods: {

      podUsageChart: function(pod_name,cpu_data, mem_data){
        // console.log('cpu_data:', cpu_data, pod_name, mem_data.min,)
        if(cpu_data && mem_data){
          let cpu_option = {
            tooltip : {
              trigger: 'axis',
              confine: false,
              extraCssText: {},
              formatter: function(params) {
                return params[0].name + '<br/>'
                  + params[0].seriesName + ' : ' + Math.floor(params[0].value * 10000) / 10000 + ' Core<br/>'
              }
            },
            xAxis : [
              {
                show: false,
                type : 'category',
                boundaryGap : false,
                // axisLine: {onZero: false},
                data : cpu_data['dates']
              }
            ],
            yAxis : [
              {
                show: false,
                name : 'Cores',
                type : 'value',
                min : cpu_data.min,
                // max : cpu_data.max,
              },
            ],
            series : [
              {
                show: false,
                name:'CPU',
                type:'line',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:cpu_data['values']
              }],
            grid:{ width: 80, height: 20, x:0, y:0, x2:0, y2:0, borderWidth:1 },
      }
          let mem_option = {
            title : {
              // text: 'aaa',
              // subtext: '纯属虚构'
            },
            tooltip : {
              // show: false,
              trigger: 'axis',
              confine: false,
              formatter: function(params) {
                let temp= ''
                if(params[0].value>1024*1024*1024){
                  temp = params[0].seriesName + ' : ' + (params[0].value/1024/1024/1024).toFixed(3) + ' Gi<br/>'
                }else {
                  temp = params[0].seriesName + ' : ' + (params[0].value/1024/1024).toFixed(3) + ' Mi<br/>'
                }
                return params[0].name + '<br/>' + temp
              }
            },
            xAxis : [
              {
                show: false,
                type : 'category',
                boundaryGap : false,
                // axisLine: {onZero: false},
                data : mem_data['dates']
              }
            ],
            yAxis : [
              {
                show: false,
                name : 'Gi',
                type : 'value',
                min : mem_data.min,
                // max : mem_data.max,
              },
            ],
            series : [
              {
                show: false,
                name:'内存',
                type:'line',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:mem_data['values']
              }],
            grid:{ width: 80, height: 20, x:0, y:0, x2:0, y2:0, borderWidth:1 },
          }
          let cpuChart = echarts.init(document.getElementById('cpuChart_'+pod_name), 'macarons')
          let memChart = echarts.init(document.getElementById('memChart_'+pod_name), 'macarons')
          let temp= ''
          if(mem_data.last_v>1024*1024*1024){
            temp = (mem_data.last_v/1024/1024/1024).toFixed(3) + ' Gi'
          }else {temp = (mem_data.last_v/1024/1024).toFixed(2) + ' Mi'}
          document.getElementById('last_mem_'+pod_name).innerText=temp
          document.getElementById('last_cpu_'+pod_name).innerText= Math.floor(cpu_data.last_v * 1000) / 1000
          cpuChart.setOption(cpu_option);
          memChart.setOption(mem_option);
        }
      },

      // 跳转详细
      colClick: function(row, activeName){
        // console.log('row, column, cell, event', row)
        this.$router.push('/kubernetes/pod-detail.html?name='+row.name+'&namespace='+row.namespace+'&env='+this.$store.state.kube.env_id+'&activeName='+activeName)
      },

      // 目标状态信息
      statusInfo: function(detail){
        //console.log("detail:", detail)
        let str_content = '';
        for(let i=0; i<detail.status.conditions.length;i++){
          str_content = str_content + '<div style="padding: 2px">'+detail.status.conditions[i]['type'] + ": " + detail.status.conditions[i]['status'] + '</div>'
        }
        str_content = str_content + '<div style="padding: 2px">Message: '+detail.status.message || "-"+'</div>'
        str_content = str_content + '<div style="padding: 2px">Reason: '+detail.status.reason || "-"+'</div>'
        return str_content
      },

      // 操作、更多动作
      handleCommand: function(command){
        // console.log('handleCommand:', command)
        if(command.action==='edit'){
          let parms = {"url": this.url,"env":this.$store.state.kube.env_id,"ns":command.row.namespace,"name":command.row.name}
          this.$store.dispatch('getKubeTgtData',parms).then(response=>{
            this.content = YAML.stringify(response.data.rows)
          }).catch(error => {this.$message.error({message: String(error)});})
          // this.GetTgtData(this.url,command.row)
          this.tempTgtData = command.row.detail
          // console.log("tempTgtData:", this.tempTgtData)
          this.dialognTgt = true
        }else if(command.action==='delete'){
          this.$confirm('将删除该目标, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            this.DelTgtData(this.url,command.row)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
          // let parms = {"url": this.url,"env":this.$store.state.kube.env_id,"row":command.row}
          // this.$store.dispatch('DelKubeTgt',parms).then(response=>{
          //   this.$message.success({message: response.data.message})
          //   // this.content = response.data.data
          //   this.$store.dispatch('getKubeTable', this.url).then(response=>{
          //     this.tableData = response.data.rows
          //   }).catch(error => {
          //     this.$message.error({message: String(error)});
          //   });
          // }).catch(error => {this.$message.error({message: String(error)});})
        }else if(command.action==='terminal'){
          let href = this.$router.resolve({ name:'Pod终端' })   // #/kubernetes/pod-terminal.html
          let url = window.location.protocol+ '//'+ window.location.host+'/'+href.href+'?name='+command.row.name+'&namespace='+command.row.namespace+'&env='+this.$store.state.kube.env_id
          window.open(url, '_blank');
        }else if(command.action==='log'){
          this.colClick(command.row, 'log')
        }

      },

      // 更新编辑目标
      UpdateTgt: function(url){

        let data_json;
        try {
          data_json =YAML.parse(this.content, {})
        }
        catch(err){
          this.$message.error({message: String(err)})
          // console.log('error:', err)
          return
        }
        let parms = {"env": this.$store.state.kube.env_id, "namespace": this.tempTgtData.metadata.namespace,
          "name": this.tempTgtData.metadata.name, "action": "replace", "body": data_json}
        // console.log('data_json:', parms)
        this.axios({
          method: 'PUT',
          url: url,
          data: this.qs.stringify({'row':JSON.stringify(parms)}),
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.ChangeNS()
            this.$message.success({message: response.data.message})
            this.dialognTgt = false
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
        // ;
      },

      // 删除目标
      DelTgtData: function(url,row) {

        let parms = {"env": this.$store.state.kube.env_id, "namespace": row.detail.metadata.namespace, "name": row.detail.metadata.name}
        this.axios({
          method: 'DELETE',
          url: url,
          data: this.qs.stringify({'match':JSON.stringify(parms)}),
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.$message.success({message: response.data.message})
            // this.content = response.data.data
            this.ChangeNS()
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
      },

      // 查看相关联的Events
      GetTgtEvent: function(url, row) {
        let field_selector = "involvedObject.kind=Pod,involvedObject.name="+row.detail.metadata.name;
        this.axios({
          method: 'GET',
          url: url,
          params: {'env': this.$store.state.kube.env_id, "namespace": row.detail.metadata.namespace,"field_selector":field_selector},
        }).then((response)=>{
          // console.log('GetTgtEvent:',response.data,);
          if(response.data.status){
            this.tableDataEvents = response.data.rows
            this.dialognTgtEvent = true
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
      },

      // 查看相关联的GetPodUsage
      GetPodUsage: function() {
        this.axios({
          method: 'GET',
          url: this.usage_url,
          params: {'env': this.$store.state.kube.env_id, "namespace": this.$store.state.kube.ns_id},
        }).then((response)=>{
          // console.log('GetPodPerformance:',response.data);
          let class_echart=document.getElementsByClassName("echart")
          if(response.data.status){
            // for(let i=0;i<class_echart.length;++i){class_echart[i].innerText=''}
            this.memory_usage = response.data.data.memory_usage
            this.cpu_usage = response.data.data.cpu_usage
            this.changeTableUpdateChart()
          }else {
            for(let i=0;i<class_echart.length;++i){class_echart[i].innerText=''}
            // this.$message.error({message: response.data.error})
            console.log('从Prometheus获取pod资源信息报错:',response.data.error)
          }
        }).catch((response) => {
          console.log('catch: 从Prometheus获取pod资源信息报错:',String(response))
          // this.$message.error({message: String(response)});
        });
      },
      // 当表格发生变化时更新性能使用图
      changeTableUpdateChart: function(){
        // console.log('list:', this.tableData.slice((this.page-1)*this.limit, this.page*this.limit), (this.page-1)*this.limit,this.page*this.limit)
        // let temp_table=this.tableData.slice((this.page-1)*this.limit, this.page*this.limit)
        let temp_table = this.tables.slice((this.page-1)*this.limit,this.page*this.limit)
        // console.log("this.temp_table:", temp_table)
        for(var i=0;i<temp_table.length;++i){
          // console.log("this.cpu mem:", this.cpu_usage[temp_table[i].name], this.memory_usage[temp_table[i].name])
          this.podUsageChart(temp_table[i].name, this.cpu_usage[temp_table[i].name], this.memory_usage[temp_table[i].name])
        }
      },

      waitTableChange: function(){
        setTimeout(this.GetPodUsage, 100)
      },

      // 修改集群
      ChangeKubeCluster: function(){
        this.$store.dispatch('getKubeNS', {'url': this.url, 'label_selector': this.label_selector}).then(response=>{
          this.tableData = response.data.rows
          this.usage_timer=setTimeout(this.GetPodUsage, 100)
        }).catch(error => {
          this.$message.error(String(error));
        });
      },

      // 修改命名空间
      ChangeNS: function(){
        this.$store.dispatch('getKubeTable', {'url': this.url, 'label_selector': this.label_selector}).then(response=>{
          this.tableData = response.data.rows
          this.usage_timer=setTimeout(this.GetPodUsage, 100)
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },
    },
    mounted () {
      // this.initGetEnv(this.ns_url)
      this.$store.dispatch('getKubeEnv', {'url': this.url, 'label_selector': this.label_selector}).then(response=>{
        this.tableData = response.data.rows
        // setTimeout(this.podUsageChart, 100)
        this.usage_timer=setTimeout(this.GetPodUsage, 100)
        // this.podUsageChart()
      }).catch(error => {
        this.$message.error(String(error));
      });

    },
    computed: {
      // 前端过滤
      tables () {
        // console.log("time_range:", this.time_range)
        const search = this.search
        if (search) {
          return this.tableData.filter(dataNews => {
            return Object.keys(dataNews).some(key => {
              // this.changeTableUpdateChart()
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }

        return this.tableData
      },

    },
    watch: {
      // 检测表格数据过滤变化，自动跳到第一页
      tables () {
        this.page = 1
        this.total = this.tables.length
      },
      'page': function() {
        this.usage_timer=setTimeout(this.changeTableUpdateChart, 100)
      },
      'limit': function() {
        this.usage_timer=setTimeout(this.changeTableUpdateChart, 100)
      }
    },

    destroyed: function() {
      window.clearInterval(this.usage_timer)
    }

  }
</script>

<style scoped>

  /deep/ .el-table__body-wrapper{
    overflow: visible;
  }
  /deep/ .show_tooltip>.cell{
    overflow: visible;
  }
</style>
