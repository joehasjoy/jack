<template>
    <div style="margin: 10px">
      <el-page-header @back="goback" :content="name"></el-page-header>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <div slot="header" class="clearfix"><span style="font-size: 16px">CPU 使用率</span></div>
            <div id="cpu_usage" style="height: 160px;width: 100%"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div slot="header" class="clearfix"><span style="font-size: 16px">内存使用率</span></div>
            <div id="mem_usage" style="height: 160px;width: 100%"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix"><span style="font-size: 16px">详情</span></div>
        <div style="font-size: 14px">
          <div style="border-bottom: 8px" class="detail-row">
            <span>名称:</span>
            <span>{{node_data.metadata.name}}</span>
          </div>
          <div class="detail-row">
            <span>标签:</span>
            <span style="max-width: 98%;left: 162px">
              <el-tag size="small" type="info" v-for="(item, key) in node_data.metadata.labels" :key="key" style="margin: 0 5px 3px 0">{{key}}:{{item}}</el-tag>
            </span>

          </div>
          <div class="detail-row">
            <span>注释:</span>
            <span style="max-width: 98%;left: 162px">
              <el-tag size="small" type="info" v-for="(item, key) in node_data.metadata.annotations" :key="key" style="margin: 0 5px 3px 0">{{key}}:{{item}}</el-tag>
            </span>
          </div>
          <div class="detail-row">
            <span>创建时间:</span>
            <span>{{node_data.metadata.creationTimestamp}}</span>
          </div>
          <div class="detail-row">
            <span>地址:</span>
            <el-tag size="small" type="info" effect="light" v-for="(item, key) in node_data.status.addresses"
                    :key="key" style="margin: 0 5px 3px 0">{{item.type}}:{{item.address}}</el-tag>

          </div>
          <div class="detail-row">
            <span>污点:</span>
            <el-tag size="small" type="info" effect="light" v-for="(item, key) in node_data.spec.taints"
                    :key="key" style="margin: 0 5px 3px 0">{{item.key}}:{{item.effect}}</el-tag>
          </div>
          <div class="detail-row">
            <span>容器组 CIDR:</span>
            <span>{{node_data.spec.podCIDR}}</span>
          </div>
          <div class="detail-row">
            <span>提供者 ID:</span>
            <span>{{node_data.spec.providerID}}</span>
          </div>
          <div class="detail-row">
            <span>无法调度:</span>
            <span v-if="node_data.spec.unschedulable">是</span>
            <span v-else>否</span>
          </div>
          <div class="detail-row">
            <span>系统信息</span>
          </div>
          <div class="detail-row">
            <span>机器 ID:</span>
            <span>{{node_data.status.nodeInfo.machineID}}</span>
          </div>
          <div class="detail-row">
            <span>系统 UUID:</span>
            <span>{{node_data.status.nodeInfo.systemUUID}}</span>
          </div>
          <div class="detail-row">
            <span>启动 ID:</span>
            <span>{{node_data.status.nodeInfo.bootID}}</span>
          </div>
          <div class="detail-row">
            <span>内核版本:</span>
            <span>{{node_data.status.nodeInfo.kernelVersion}}</span>
          </div>
          <div class="detail-row">
            <span>操作系统镜像:</span>
            <span>{{node_data.status.nodeInfo.operatingSystem}}</span>
          </div>
          <div class="detail-row">
            <span>容器运行时版本:</span>
            <span>{{node_data.status.nodeInfo.containerRuntimeVersion}}</span>
          </div>
          <div class="detail-row">
            <span>Kubelet 版本:</span>
            <span>{{node_data.status.nodeInfo.kubeletVersion}}</span>
          </div>
          <div class="detail-row">
            <span>Kube-Proxy 版本:</span>
            <span>{{node_data.status.nodeInfo.kubeProxyVersion}}</span>
          </div>
          <div class="detail-row">
            <span>操作系统:</span>
            <span>{{node_data.status.nodeInfo.operatingSystem}}</span>
          </div>
          <div class="detail-row">
            <span>架构:</span>
            <span>{{node_data.status.nodeInfo.architecture}}</span>
          </div>
        </div>
      </el-card>

      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix"><span style="font-size: 16px">已分配资源</span></div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div>
              <div id="cpu_all" style="height: 280px;width: 100%"></div>
              <div style="padding:0;margin: 0;text-align: center;">
                <div style="font-size:18px;padding-bottom:8px">CPU allocation (cores)</div>
              </div>
              <div style="border-bottom: solid 1px rgba(0,0,0,.12);padding:10px 0 10px 0;margin: 0 15% 0 15%;text-align: left;">
                <div style="width: 12px;height: 12px;background-color: #00c752;display: inline-block;vertical-align:middle;"></div>
                请求值
                <span class="cpu_req" style="float: right">{{limit_req_resource.req_cpu}}</span>
              </div>
              <div style="border-bottom: solid 1px rgba(0,0,0,.12);padding:10px 0 10px 0;margin: 0 15% 0 15%;text-align: left;">
                <div style="width: 12px;height: 12px;background-color: #326de6;display: inline-block;vertical-align:middle;"></div>
                限制值
                <span class="cpu_limit" style="float: right">{{limit_req_resource.limit_cpu}}</span>
              </div>
              <div style="padding:10px 0 10px 0;margin: 0 15% 0 15%;text-align: left;">
                <span style="padding-left: 20px">总量</span>
                <span class="cpu_c" style="float: right">{{node_data.status.capacity.cpu}}</span>
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div id="mem_all" style="height: 280px;width: 100%"></div>
            <div style="padding:0;margin: 0;text-align: center;">
              <div style="font-size:18px;padding-bottom:8px">Memory allocation (bytes)</div>
            </div>
            <div style="border-bottom: solid 1px rgba(0,0,0,.12);padding:10px 0 10px 0;margin: 0 15% 0 15%;text-align: left;">
              <div style="width: 12px;height: 12px;background-color: #00c752;display: inline-block;vertical-align:middle;"></div>
              请求值
              <span class="mem_req" style="float: right">{{limit_req_resource.req_mem}} Gi</span>
            </div>
            <div style="border-bottom: solid 1px rgba(0,0,0,.12);padding:10px 0 10px 0;margin: 0 15% 0 15%;text-align: left;">
              <div style="width: 12px;height: 12px;background-color: #326de6;display: inline-block;vertical-align:middle;"></div>
              限制值
              <span class="mem_limit" style="float: right">{{limit_req_resource.limit_mem}} Gi</span>
            </div>
            <div style="padding:10px 0 10px 0;margin: 0 15% 0 15%;text-align: left;">
              <span style="padding-left: 20px">总量</span>
              <span class="mem_c" style="float: right">{{(node_data.status.capacity.memory.replace('Ki', '')/1024/1024).toFixed(2)}} Gi</span>
            </div>
          </el-col>

          <el-col :span="8">
            <div style="text-align: center;">
              <div id="pod_all" style="height: 280px;width: 100%;"></div>
            </div>
            <div style="padding:0;margin: 0;text-align: center;">
              <div style="font-size:18px;padding-bottom:8px">Pods allocation</div>
            </div>
            <div style="border-bottom: solid 1px rgba(0,0,0,.12);padding:10px 0 10px 0;margin: 0 15% 0 15%;text-align: left;">
              <div style="width: 12px;height: 12px;background-color: #00c752;display: inline-block;vertical-align:middle;"></div>
              已分配
              <span class="pod_u" style="float: right">{{total}}</span>
            </div>
            <div style="padding:10px 0 10px 0;margin: 0 15% 0 15%;text-align: left;">
              <span style="padding-left: 20px">总量</span>
              <span class="pod_c" style="float: right">{{node_data.status.capacity.pods}}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix"><span style="font-size: 16px">现状</span></div>
        <el-table :data="node_data.status.conditions" size="mini">
          <el-table-column label="类型" prop="type" width="180"></el-table-column>
          <el-table-column label="状态" prop="status" width="100"></el-table-column>
          <el-table-column label="最近心跳" prop="lastHeartbeatTime" width="160"></el-table-column>
          <el-table-column label="最近更改" prop="lastTransitionTime" width="160"></el-table-column>
          <el-table-column label="原因" prop="reason" width=""></el-table-column>
          <el-table-column label="消息" prop="message" width=""></el-table-column>
        </el-table>
      </el-card>

      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix"><span style="font-size: 16px">容器组</span></div>
        <el-table :data="podsTable.slice((page-1)*limit,page*limit)" size="mini">
          <el-table-column label="名称" prop="name" :show-overflow-tooltip="false">
            <template slot-scope="scope">
              <a @click="colClick(scope.row, 'event')">{{scope.row.name}}</a>
            </template>
          </el-table-column>
          <el-table-column label="Ready" prop="" align="center" width="70">
            <template slot-scope="scope">
              <template v-if="scope.row.container_count ===scope.row.container_run">
                <span style="cursor: pointer;color: #33cb01"  @click="">{{scope.row.container_run}}/{{scope.row.container_count}}</span>
              </template>
              <template v-else>
                <span style="cursor: pointer;color: red" @click="">{{scope.row.container_run}}/{{scope.row.container_count}}</span>
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
          <el-table-column sortable label="创建时间" prop="start_time" align="center" class-name="show_tooltip" width=""></el-table-column>

        </el-table>
        <div class="block" >
          <pagination :total="total" :page.sync="page" :limit.sync="limit"></pagination>
        </div>
      </el-card>

      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix"><span style="font-size: 16px">事件</span></div>
        <el-table :data="eventTableData" height="400" size="small">
          <el-table-column label="类型" prop="type" align="" width="100"></el-table-column>
          <el-table-column label="对象" prop="involvedObject" align="" width="260" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div style="font-size: 12px">{{scope.row.detail.involvedObject.kind}}</div>
              <div style="font-size: 12px;color: #999">{{scope.row.detail.involvedObject.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="信息" prop="message" align="" width=""></el-table-column>
          <el-table-column label="原因" prop="reason" align="" width="150"></el-table-column>
          <el-table-column label="时间" prop="creation_timestamp" align="" width="200"></el-table-column>
        </el-table>
      </el-card>


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
    </div>
</template>

<script>
  import pagination from '@/components/Pagination/pagination'
  import echarts from 'echarts'
  import  'echarts/theme/macarons.js'
  export default {
    name: 'node-detail',
    data(){return{
      podsTable: [],
      tableData: [],
      eventTableData: [],
      pod_url: this.GLOBAL.service_tag+'/api/kubernetes/pod/',
      url: this.GLOBAL.service_tag+'/api/kubernetes/node/',
      event_url: this.GLOBAL.service_tag+'/api/kubernetes/event/',
      usage_url: this.GLOBAL.service_tag+'/api/kubernetes/node-usage/',

      limit: 10,
      page: 1,
      total: 0,
      search: '',
      env: '',
      name: '',
      ip: '',
      node_data: {
        metadata:{ name: '', labels: {},annotations:{},creationTimestamp: ''},
        spec: {taints:[], podCIDR: '',providerID: ''},
        status: {
          addresses:[],
          nodeInfo: {
            architecture: "",
            bootID: "",
            containerRuntimeVersion: "",
            kernelVersion: "",
            kubeProxyVersion: "",
            kubeletVersion: "",
            machineID: "",
            operatingSystem: "",
            osImage: "",
            systemUUID: "",
          },
          conditions: [],
          capacity: {cpu: 0, memory:'', pods: 0}
        },
      },
      limit_req_resource: {
        limit_cpu: 0,
        limit_mem: 0,
        req_cpu: 0,
        req_mem: 0,
      },

      tableDataEvents: [],
      dialognTgtEvent: false,
    }},
    components: {
      pagination: pagination,
    },

    methods:{
      barResource: function(){
        let labelBottom = {
          normal : {
            color: '#e6e6e6',
            label : { show : true, position : 'center' },
            labelLine : { show : false }
          },
          emphasis: { color: 'rgba(0,0,0,0.17)' }
        };
        let labelGreen = {
          normal : {
            color: '#4cd785',
            label : {
              show : true,
              //position : 'left',
              formatter : function (params) {
                return (params.percent - 0).toFixed(0) + '%'
              }
            },
            labelLine : {
              show : false
            }
          },
          emphasis: {
            color: 'rgba(66,187,116,0.78)'
          }
        };
        let labelBlue = {
          normal : {
            color: '#326de6',
            label : {
              show : true,
              //position : 'center',
              formatter : function (params) {
                return (params.percent - 0).toFixed(0) + '%'
              }
            },
            labelLine : {
              show : false
            }
          },
          emphasis: {
            // shadowBlur: 10,
            // shadowOffsetX: 0,
            shadowColor: 'rgba(30, 144, 255，0.5)'
          }
        };
        // Pod饼图
        this.Bar("pod_all",['已用','总计'], '', 'Pods',[],
          [{value:this.total, name:'已分配', itemStyle: labelGreen}, {value:this.node_data.status.capacity.pods - this.total, name:'未使用', itemStyle : labelBottom}]
        );

        // CPU饼图
        this.Bar("cpu_all",[], '限制', '请求值',
          [{value:this.limit_req_resource.limit_cpu, name:'限制',itemStyle: labelBlue}, {value:this.node_data.status.capacity.cpu-this.limit_req_resource.limit_cpu, name:'未用',itemStyle: labelBottom}],
          [{value:this.limit_req_resource.req_cpu, name:'请求',itemStyle: labelGreen}, {value:this.node_data.status.capacity.cpu-this.limit_req_resource.req_cpu, name:'未用',itemStyle: labelBottom}]
        );
        // 内存饼图
        this.Bar("mem_all",[], '限制', '请求值',
          [{value:this.limit_req_resource.limit_mem, name:'限制',itemStyle: labelBlue}, {value:this.node_data.status.capacity.memory.replace('Ki', '')/1024/1024-this.limit_req_resource.limit_mem, name:'未用',itemStyle: labelBottom}],
          [{value:this.limit_req_resource.req_mem, name:'请求', itemStyle: labelGreen}, {value:this.node_data.status.capacity.memory.replace('Ki', '')/1024/1024-this.limit_req_resource.req_mem, name:'未用',itemStyle: labelBottom}]
        );
      },

      /* 饼图 */
      Bar: function(bar_id,bar_list,title_inner,title_outside,bar_inner, bar_outside) {
        let myChart = echarts.init(document.getElementById(bar_id));
        let option = {
          tooltip : { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)", },
          legend: {
            // orient : 'vertical',
            // x : 'top',
            // y: 'top',
            data:bar_list
          },
          toolbox: {
            show : false,
            orient: 'vertical',
            y: 'center',
            feature : {
              mark : {show: false},
              dataView : {show: false, readOnly: false},
              magicType : {show: false, type: ['line', 'bar']},
              restore : {show: false},
              saveAsImage : {show: false}
            }
          },
          calculable : false,

          series : [
            {
              name: title_inner,
              type:'pie',
              selectedMode: 'single',
              radius : [50, 86],
              // for funnel
              x: '20%',
              width: '40%',
              funnelAlign: 'right',
              center: ["50%", "45%"],
              // max: 1000,
              label:{            //饼图图形上的文本标签
                normal:{
                  show:true,
                  position:'inner', //标签的位置
                  textStyle : {
                    fontWeight : 200 ,
                    fontSize : 12,    //文字的字体大小
                    color: '#000000'
                  },
                  formatter:'{d}%'
                }
              },
              itemStyle : {
                normal : {
                  label : {
                    position : 'inner',
                    formatter : function (params) {
                      return (params.percent - 0).toFixed(0) + '%'
                    }
                  },
                  labelLine : {
                    show : false
                  }
                }
              },
              data:bar_inner
            },
            {
              name: title_outside,
              type:'pie',
              radius : [85, 120],
              label:{            //饼图图形上的文本标签
                normal:{
                  show:true,
                  position:'inner', //标签的位置
                  textStyle : {
                    fontWeight : 200 ,
                    fontSize : 12,    //文字的字体大小
                    color: '#000000'
                  },
                  formatter:'{d}%'
                }
              },
              x: '60%',
              width: '35%',
              funnelAlign: 'left',
              // max: 1048,
              center: ["50%", "45%"],
              data:bar_outside
            }
          ],
        };
        myChart.setOption(option);
      },


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

      // 返回
      goback: function(){
        // console.log('row, column, cell, event', row)
        this.$router.push('/kubernetes/node.html')
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

      // 查看相关联的Events
      GetTgtEvent: function(url, row) {
        let field_selector = "involvedObject.kind=Pod,involvedObject.name="+row.detail.metadata.name;
        this.axios({
          method: 'GET',
          url: url,
          params: {'env': this.env, "namespace": 'all',"field_selector":field_selector},
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

      // 获取node目标信息
      GetTgtData: function() {
        // console.log('row:', row)
        let parms = {"env": this.env, "name": this.name}
        this.axios({
          method: 'GET',
          url: this.url,
          params: parms,
        }).then((response)=>{
          // console.log('GetTgtData:',response.data,);
          if(response.data.status){
            this.node_data = response.data.data
            this.GetTgtPodsData()
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      // 获取pods list信息
      GetTgtPodsData: function() {
        let parms = {"env": this.env, "field_selector": 'spec.nodeName='+this.name, 'namespace': 'all'}
        this.axios({
          method: 'GET',
          url: this.pod_url,
          params: parms,
        }).then((response)=>{
          // console.log('GetTgtPodsData:',response.data,);
          if(response.data.status){
            this.podsTable=response.data.rows
            this.total=this.podsTable.length
            this.limit_req_resource=response.data.data
            this.barResource()
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      //获取Node 事件
      getEvents: function() {
        let field_selector="involvedObject.name="+this.name+",involvedObject.kind=Node"
        this.$store.state.kube.env_id=this.env
        this.$store.state.kube.ns_id='all'
        this.$store.dispatch('getKubeTable', { 'url': this.event_url, field_selector: field_selector}).then(response=>{
          this.eventTableData = response.data.rows
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },

      // 查看相关联的GetPodUsage
      GetUsage: function() {
        this.axios({
          method: 'GET',
          url: this.usage_url,
          params: {'env': this.env, 'instance': this.ip},
        }).then((response)=>{
          // console.log('GetPodPerformance:',response.data, response.data.data.cpu_usage[this.ip]);
          if(response.data.status){
            this.CpuMemChart(response.data.data.cpu_usage[this.ip].values,response.data.data.cpu_usage[this.ip].dates,
              response.data.data.memory_usage[this.ip].values,response.data.data.memory_usage[this.ip].dates,)
          }else {
            console.log('从Prometheus获取资源信息报错:',response.data.error)
          }
        }).catch((response) => {
          console.log('catch: 从Prometheus获取资源信息报错:',String(response))
          // this.$message.error({message: String(response)});
        });
      },

      // cpu 内存使用率
      CpuMemChart: function(cpu_data, cpu_date,mem_data, mem_date) {
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
              show: true,
              type : 'category',
              boundaryGap : false,
              // axisLine: {onZero: false},
              data : cpu_date
            }
          ],
          yAxis : [
            {
              show: true,
              name : 'Cores',
              type : 'value',
              // min : cpu_data.min,
              // max : cpu_data.max,
              axisLabel: {
                margin: 6,
                formatter: function (value, index) {

                  return value + ' c';
                }
              },
            },
          ],
          series : [
            {
              show: true,
              name:'CPU',
              type:'line',
              itemStyle: {normal: {areaStyle: {type: 'default'},color: 'rgb(0, 199, 82)' }},
              data:cpu_data
            }],
          grid:{ x:60, y:10, x2:20, y2:20, borderWidth:1 },
        }
        let mem_option = {
          title : {},
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
              show: true,
              type : 'category',
              boundaryGap : false,
              // axisLine: {onZero: false},
              data : mem_date
            }
          ],
          yAxis : [
            {
              show: true,
              name : 'Gi',
              type : 'value',
              // min : mem_data.min,
              // max : mem_data.max,
              axisLabel: {
                margin: 6,
                formatter: function (value, index) {
                  let temp= ''
                  if(value>1024*1024*1024){
                    temp = (value/1024/1024/1024).toFixed(3) + ' Gi'
                  }else {
                    temp = (value/1024/1024).toFixed(3) + ' Mi'
                  }
                  return temp;
                }
              },

            },
          ],
          series : [
            {
              show: true,
              name:'内存',
              type:'line',
              itemStyle: {normal: {areaStyle: {type: 'default'},color: 'rgb(50, 109, 230)'}},
              data:mem_data
            }],
          grid:{ x:70, y:10, x2:20, y2:20, borderWidth:1 },
        }
        let cpuChart = echarts.init(document.getElementById('cpu_usage'))
        let memChart = echarts.init(document.getElementById('mem_usage'))
        cpuChart.setOption(cpu_option);
        memChart.setOption(mem_option);
      },

    },

    mounted () {
      this.name = this.common.getUrlKey('name');
      this.env = this.common.getUrlKey('env');
      this.ip = this.common.getUrlKey('ip');
      this.GetTgtData()
      this.getEvents()
      this.GetUsage()
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
  /deep/ .detail-row{
    padding-bottom: 8px;
  }
  /deep/ .el-divider--horizontal{
   margin: 10px 0;
  }
</style>
