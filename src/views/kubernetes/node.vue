<template>

    <el-card style="margin: 10px">
      集群
      <el-select v-model="$store.state.kube.env_id" filterable placeholder="集群" style="width: 160px" @change="ChangeKubeCluster">
        <el-option :label="item.name" :value="item.id" v-for="(item,index) in $store.state.kube.env_list" :key="index"></el-option>
      </el-select>
      <el-select v-model="select_label" multiple clearable filterable placeholder="标签过滤" @change="getKubeCluster">
        <el-option :label="item" :value="item" v-for="(item,index) in labels_list" :key="index"></el-option>
      </el-select>
      <el-checkbox v-model="label_sys_hide">隐藏系统定义标签</el-checkbox>

      <el-input v-model="search" placeholder="请输入搜索内容" style="width: 300px;float: right" @input="waitTableChange"></el-input>
      <el-button style="float: right;margin-right: 5px" @click="getKubeCluster">刷新</el-button>

      <el-table id="out-table" v-loading="$store.state.kube.loading"
        :data="tables.slice((page-1)*limit,page*limit)"
        style="width: 100%;margin-top: 10px;border: 1px solid #EBEEF5">
        <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" width="">
          <template slot-scope="scope">
            <div style="font-size: 12px">{{scope.row.name}}</div>
            <el-link :underline="false" type="primary" style="display: block;font-size: 12px" @click="goToDetail(scope.row)">{{scope.row.hostname}}</el-link>
            <div style="font-size: 12px">{{scope.row.ip}}</div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="90" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark"  placement="right" >
              <div slot="content" v-html="statusInfo(scope.row.detail)"></div>
              <div v-if="node_running(scope.row.detail)">
                <span style="width: 14px;height: 14px;background-color: #33cb01;display: inline-block;border-radius: 50%; vertical-align:middle;"></span>
                <span style="color: #33cb01;font-size: 12px">运行中</span>
              </div>
              <div v-else-if="node_running(scope.row.detail)===false">
                <span style="width: 14px;height: 14px;background-color: red;display: inline-block;border-radius: 50%; vertical-align:middle;"></span>
                <span style="color: red;font-size: 12px">异常</span></div>
              <div v-else>
                <span style="width: 14px;height: 14px;background-color: #fd9801;display: inline-block;border-radius: 50%; vertical-align:middle;"></span>
                <span style="color: #fd9801;font-size: 12px">等待中</span></div>
            </el-tooltip >
            <span style="font-size: 12px" v-if="scope.row.unschedulable===false">可调度</span>
            <span style="font-size: 12px;color: #fd9801" v-else>不可调度</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="" width="" align="">
          <template slot-scope="scope">
            <div v-if="label_sys_hide"><el-tag size="mini" type="info" v-for="(item, key) in scope.row.detail.metadata.labels" :key="key" style="margin-right: 5px" v-if="!key.includes('kubernetes')">{{key}}:{{item}}</el-tag></div>
            <div v-else><el-tag size="mini" type="info" v-for="(item, key) in scope.row.detail.metadata.labels" :key="key" style="margin-right: 5px">{{key}}:{{item}}</el-tag></div>
          </template>
        </el-table-column>
        <el-table-column label="Pod数量" prop="" width="80" align="center">
          <template slot-scope="scope">
            <div style="font-size: 12px">{{node_pods[scope.row.name]}} / {{scope.row.detail.status.capacity.pods}} </div>
          </template>
        </el-table-column>
        <el-table-column label="CPU Memory requests / limits / total" prop="" min-width="130"  align="center">
          <template slot="header" slot-scope="scope">
            <span style="display: block;line-height: 23px">CPU 内存</span>
            <span style="display: block;line-height: 23px">请求 / 限制</span>
          </template>
          <template slot-scope="scope">
            <div style="font-size: 12px">{{cpu_requests[scope.row.name]}}c / {{cpu_limits[scope.row.name]}}c </div>
            <div style="font-size: 12px">{{(mem_requests[scope.row.name]/1024/1024/1024).toFixed(1)}}GB /
              {{(mem_limits[scope.row.name]/1024/1024/1024).toFixed(1)}}GB</div>
          </template>
        </el-table-column>
        <el-table-column label="CPU / 内存" prop="" min-width="130" align="center">
          <template slot-scope="scope">
            <span style="font-size: 12px">{{scope.row.cpu}}c / {{scope.row.memory}}GB</span>
          </template>
        </el-table-column>
        <el-table-column label="CPU" prop="" align="" width="150" class-name="show_tooltip">
          <template slot-scope="scope">
            <div class="echart">
              <div :id="'cpuChart_'+scope.row.ip" style="width: 80px;height: 20px;display: inline;float: left"></div>
              <div style="float: right" :id="'last_cpu_'+scope.row.ip"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="内存" prop="" align="" width="170" class-name="show_tooltip">
          <template slot-scope="scope">
            <div class="echart">
              <div :id="'memChart_'+scope.row.ip" style="width: 80px;height: 20px;display: inline;float: left"></div>
              <div style="float: right" :id="'last_mem_'+scope.row.ip"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Kubelet 版本" prop="version" width="120"></el-table-column>

        <el-table-column label="操作" prop="" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="GetTgtData(url,scope.row)" type="warning" :plain="true">查看</el-button>
            <el-button size="mini" @click="goToDetail(scope.row)" type="default" :plain="true">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" >
        <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="GetUsage"></pagination>
      </div>

      <!-- 编辑目标 -->
      <el-dialog title="编辑" :visible.sync="dialognTgt" top="30px" width="798px" :close-on-click-modal="false">
        <editor v-model="content" @init="common.editorInit" lang="yaml" theme="merbivore"  width="100%" height="500"></editor>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="common.saveShareContent(content, tempTgtData.metadata.name+'.yaml')">下 载</el-button>
<!--          <el-button type="warning" plain="plain" @click="UpdateTgt(url)">更 新</el-button>-->
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

      <el-dialog title="创建" :visible.sync="dialognTgtNew" top="60px" width="600px" :close-on-click-modal="false">
        <el-form ref="formNew" :model="formNew" label-width="80px" size="mini" :rules="formNewRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formNew.name"></el-input>
            <span style="color: #999;font-size: 12px">长度为 1-63 个字符，只能包含数字、小写字母、和“-”，且首尾只能是字母或数字</span>
          </el-form-item>
          <el-form-item label="标签">
            <el-button icon="el-icon-plus" @click="addLabel">添加</el-button>
            <table style="background: #FFF;font-size: 12px;border-top: 1px solid #E1E6EB;margin-top: 8px;border: 1px solid #E1E6EB;width: 100%;margin-bottom: 20px">
              <tbody>
              <tr>
                <td style="width: 30%;text-align: left">变量名称</td>
                <td style="text-align: left">变量值</td>
                <td style="width: 100px;text-align: center">操作</td>
              </tr>
              <tr v-for="(value,key) in label_list" :key="key">
                <td><el-input v-model="value.k" placeholder="名称"></el-input></td>
                <td><el-input v-model="value.v" placeholder="值"></el-input></td>
                <td style="text-align: center"><el-button type="danger" :plain="true" @click="delLabel(value.flag)">删除</el-button></td>
              </tr>
              </tbody>
            </table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="createTgt(url)">确 定</el-button>
          <el-button @click="dialognTgtNew = false">取 消</el-button>
        </div>
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
    name: 'Service',
    data() {
      return {
        formNewRules: {
          name: [
            {required: true,message: "请输入内容",trigger: "blur"},
            { pattern: /^[a-z0-9\-]+$/, message: "请输入有效格式" }
          ],
        },
        flag: 0,
        label_list: [{'k': '', 'v': '', "flag": 0}],
        formNew: {'name': '', labels: {}},
        dialognTgtNew: false,
        dialognTgt: false,
        tableData: [],
        url: this.GLOBAL.service_tag+'/api/kubernetes/node/',
        ns_url: this.GLOBAL.service_tag+'/api/kubernetes/namespace/',
        event_url: this.GLOBAL.service_tag+'/api/kubernetes/event/',
        usage_url: this.GLOBAL.service_tag+'/api/kubernetes/node-usage/',
        limit: 10,
        page: 1,
        total: 0,
        search: '',
        select_label: [],
        content: '',
        tableDataEvents: [],
        labels_list: [],
        dialognTgtEvent: false,
        label_sys_hide: true,
        node_pods: {},
        cpu_limits: {},
        cpu_requests: {},
        mem_limits: {},
        mem_requests: {},

        cpu_usage: {},
        memory_usage:{},

      }
    },
    components: {
      editor: require('vue2-ace-editor'),
      pagination: pagination,
    },
    methods: {
      UsageChart: function(name,cpu_data, mem_data){
        // console.log('cpu_data:', cpu_data, name, mem_data.min,)
        if(cpu_data && mem_data){
          let cpu_option = {
            tooltip : {
              trigger: 'axis',
              confine: false,
              extraCssText: {},
              formatter: function(params) {
                return params[0].name + '<br/>'
                  + params[0].seriesName + ' : ' + Math.floor(params[0].value * 1000) / 1000 + ' Core<br/>'
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
          let cpuChart = echarts.init(document.getElementById('cpuChart_'+name), 'macarons')
          let memChart = echarts.init(document.getElementById('memChart_'+name), 'macarons')
          let temp= ''
          if(mem_data.last_v>1024*1024*1024){
            temp = (mem_data.last_v/1024/1024/1024).toFixed(2) + ' Gi'
          }else {temp = (mem_data.last_v/1024/1024).toFixed(2) + ' Mi'}
          document.getElementById('last_mem_'+name).innerText=temp
          document.getElementById('last_cpu_'+name).innerText= Math.floor(cpu_data.last_v * 1000) / 1000
          cpuChart.setOption(cpu_option);
          memChart.setOption(mem_option);
        }
      },

      changeTableUpdateChart: function(){
        // console.log('list:', this.tableData.slice((this.page-1)*this.limit, this.page*this.limit), (this.page-1)*this.limit,this.page*this.limit)
        // let temp_table=this.tableData.slice((this.page-1)*this.limit, this.page*this.limit)
        let temp_table = this.tables.slice((this.page-1)*this.limit,this.page*this.limit)
        for(let i=0;i<temp_table.length;++i){
          // console.log('temp_table[i]',temp_table[i], this.cpu_usage)
          this.UsageChart(temp_table[i].ip, this.cpu_usage[temp_table[i].ip], this.memory_usage[temp_table[i].ip])
        }
      },

      waitTableChange: function(){
        setTimeout(this.GetUsage, 100)
      },

      // 查看相关联的GetPodUsage
      GetUsage: function() {
        this.axios({
          method: 'GET',
          url: this.usage_url,
          params: {'env': this.$store.state.kube.env_id},
        }).then((response)=>{
          // console.log('GetPodPerformance:',response.data);
          let class_echart=document.getElementsByClassName("echart")
          if(response.data.status){
            // for(let i=0;i<class_echart.length;++i){class_echart[i].innerText=''}
            this.memory_usage = response.data.data.memory_usage
            this.cpu_usage = response.data.data.cpu_usage
            this.node_pods = response.data.data.node_pods
            this.cpu_requests = response.data.data.cpu_requests
            this.cpu_limits = response.data.data.cpu_limits
            this.mem_requests = response.data.data.mem_requests
            this.mem_limits = response.data.data.mem_limits
            this.changeTableUpdateChart()
          }else {
            for(let i=0;i<class_echart.length;++i){class_echart[i].innerText=''}
            // this.$message.error({message: response.data.error})
            console.log('从Prometheus获取资源信息报错:',response.data.error)
          }
        }).catch((response) => {
          console.log('catch: 从Prometheus获取资源信息报错:',String(response))
          // this.$message.error({message: String(response)});
        });
      },

      addLabel: function(){
        this.label_list.push({"k": '', "v": "", "flag": ++this.flag})
      },

      delLabel: function(flag){
        for(let i=0;i<this.label_list.length;i++){
          if(flag===this.label_list[i]['flag']){
            delete this.label_list.splice(i,1)
          }
        }
      },

      // 创建目标
      createTgt: function(url){
        this.$refs.formNew.validate(valid =>{
          if(valid){
            let ls= this.label_list;
            for(let i=0;i<ls.length;i++){
              if(ls[i].k){
                this.formNew.labels[ls[i].k] =ls[i].v
              }else if(!ls[i].k && ls[i].v){this.$message.warning('当值存在时，变量名称不能为空！');return}
            }
            let parms = {"row": JSON.stringify({"metadata": this.formNew}), 'env': this.$store.state.kube.env_id}

            this.axios({
              method: 'POST',
              url: url,
              data: this.qs.stringify(parms),
            }).then((response)=>{
              // console.log('NewTgtData:',response.data, );
              if(response.data.status){
                this.dialognTgtNew = false
                this.$store.dispatch('getKubeTableNoNS', this.url).then(response=>{
                  this.tableData = response.data.rows
                }).catch(error => {this.$message.error({message: String(error)});});
                this.$message.success(response.data.message)
              }else {this.$message.error(response.data.error)}

            }).catch((response) => {
              this.$message.error(String(response));

            });
          }else {this.$message.warning('请输入合法数据')}
        })
      },

      // 获取目标信息
      GetTgtData: function(url,row) {
        // console.log('row:', row)

        let parms = {"env": this.$store.state.kube.env_id, "name": row.name}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.content = YAML.stringify(response.data.rows)
            // this.content = response.data.data
            this.dialognTgt = true
          }else {this.$message.error(response.data.error)}

        }).catch((response) => {
          this.$message.error(String(response));

        });
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
        let parms = {"env": this.$store.state.kube.env_id, "name": data_json.metadata.name, "action": "replace", "body": data_json}
        // console.log('data_json:', parms)
        this.axios({
          method: 'PUT',
          url: url,
          data: this.qs.stringify({'row':JSON.stringify(parms)}),
        }).then((response)=>{
          //console.log('GetTgtData:',response.data, name);
          if(response.data.status){
            this.$store.dispatch('getKubeTableNoNS', this.url).then(response=>{
              this.tableData = response.data.rows
            }).catch(error => {this.$message.error({message: String(error)});});
            this.$message.success({message: response.data.message})
            this.dialognTgt = false
          }else {this.$message.error({message: response.data.error})}

        }).catch((response) => {
          this.$message.error({message: String(response)});

        });
        //
      },

      // 编辑/获取目标信息
      DelTgtData: function(url,row) {

        let parms = {"env": this.$store.state.kube.env_id, "name": row.detail.metadata.name}
        this.$confirm('将删除该目标, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.axios({
            method: 'DELETE',
            url: url,
            data: this.qs.stringify({'match':JSON.stringify(parms)}),
          }).then((response)=>{
            //console.log('GetTgtData:',response.data, name);
            if(response.data.status){
              this.$message.success({message: response.data.message})
              this.$store.dispatch('getKubeTableNoNS', this.url).then(response=>{
                this.tableData = response.data.rows
              }).catch(error => {this.$message.error({message: String(error)});});
            }else {this.$message.error({message: response.data.error})}

          }).catch((response) => {
            this.$message.error({message: String(response)});

          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      // 目标状态信息
      statusInfo: function(detail){
        //console.log("detail:", detail)
        let str_content = '';
        for(let i=0; i<detail.status.conditions.length;i++){
          str_content = str_content + '<div style="padding: 2px">'+detail.status.conditions[i]['type'] + ": " + detail.status.conditions[i]['status'] + '</div>'
          if(detail.status.conditions[i]['type']==='Ready'){}
        }
        return str_content
      },
      node_running: function(detail){
        //console.log("detail:", detail)
        let flag = true;
        for(let i=0; i<detail.status.conditions.length;i++){
          if(detail.status.conditions[i]['type']==='Ready'){
            if(detail.status.conditions[i]['status']!=='True'){flag=false}
          }
        }
        return flag
      },

      // 跳转node详细页面
      goToDetail: function(row){
        //console.log('row, column, cell, event', row)
        this.$router.push('/kubernetes/node-detail.html?name='+row.name+'&ip='+row.ip+'&env='+this.$store.state.kube.env_id)
      },

      // 查看相关联的Events
      GetTgtEvent: function(url, row, kind) {

        let field_selector = "involvedObject.kind="+kind+",involvedObject.name="+row.detail.metadata.name;
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

      ChangeKubeCluster: function(){
        // console.log('select_label:', this.select_label, String(this.select_label))
        this.$store.dispatch('getKubeEnvNoNS', {url:this.url, label_selector: String(this.select_label)}).then(response=>{
          this.tableData = response.data.rows
          // console.log('this.tableData', this.tableData)
          // if(this.labels_list.length===0){this.labels_list = response.data.labels_list}
          this.labels_list = response.data.labels_list
          this.GetUsage()
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },

      getKubeCluster: function(){
        this.$store.dispatch('getKubeEnvNoNS', {url:this.url, label_selector: String(this.select_label)}).then(response=>{
          this.tableData = response.data.rows

          this.GetUsage()
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },
    },


    mounted () {
      this.ChangeKubeCluster()
    },
    computed: {
      // 前端过滤
      tables () {
        // console.log("time_range:", this.time_range)
        const search = this.search
        if (search) {
          return this.tableData.filter(dataNews => {
            return Object.keys(dataNews).some(key => {
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
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-table__body-wrapper{
    /*overflow: visible;*/
    /*overflow-y: visible;*/
    /*overflow-x: scroll;*/
  }
  /deep/ .show_tooltip>.cell{
    overflow: visible;
  }
</style>
