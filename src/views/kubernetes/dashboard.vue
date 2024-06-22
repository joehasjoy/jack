<template>
  <div style="margin: 10px">
    <el-card>
      <div style="padding-bottom: 10px">集群
        <el-select v-model="$store.state.kube.env_id" filterable placeholder="集群" style="width: 160px" @change="ChangeKubeCluster">
          <el-option :label="item.name" :value="item.id" v-for="(item,index) in $store.state.kube.env_list" :key="index"></el-option>
        </el-select>
        命名空间
        <el-select v-model="$store.state.kube.ns_id" filterable placeholder="命名空间" style="width: 240px" @change="ChangeNS">
          <el-option :label="item.name" :value="item.id" v-for="(item,index) in $store.state.kube.ns_list" :key="index"></el-option>
        </el-select>
      </div>

      <el-row :gutter="10">
        <el-col :span="12"><div style="border: #ccd6e0 solid 1px;height: 266px">
          <div style="padding-left: 16px;min-width: 50px;">
            <h5 style="border-left: 2px solid #88B7E0;text-indent: 8px;font-size: 14px;margin: 8px 0">应用状态</h5>
          </div>
          <el-carousel :interval="5000" arrow="always" height="205px" :autoplay="false" indicator-position="outside">
            <el-carousel-item>
              <el-row :gutter="10" style="width: 90%;margin:0 auto;">
                <el-col :span="8"><div id="pod_pie" style="width:100%;height:227px;text-align: center"></div></el-col>
                <el-col :span="8"><div id="deployment_pie" style="width:100%;height:227px;text-align: center"></div></el-col>

                <el-col :span="8"><div id="ds_pie" style="width:100%;height:227px;text-align: center"></div></el-col>
              </el-row>
            </el-carousel-item>
            <el-carousel-item>
              <el-row :gutter="10" style="width: 90%;margin:0 auto;">
                <el-col :span="8"><div id="statefulset_pie" style="width:100%;height:227px;text-align: center"></div></el-col>
                <el-col :span="8"><div id="svc_pie" style="width:100%;height:227px;"></div></el-col>
<!--                <el-col :span="8"><div id="ingress_pie" style="width:100%;height:227px"></div></el-col>-->
                <el-col :span="8"><div id="pvc_pie" style="width:100%;height:227px"></div></el-col>
              </el-row>
            </el-carousel-item>
          </el-carousel>
        </div></el-col>

        <el-col :span="6"><div style="border: #ccd6e0 solid 1px;min-height: 266px">
          <div style="padding-left: 16px;min-width: 50px;">
            <h5 style="border-left: 2px solid #88B7E0;text-indent: 8px;font-size: 14px;margin: 8px 0">节点状态</h5>
          </div>
          <div style="margin:0 auto;width:100%;">
            <div id="node_pie" style="width:100%;height:227px;margin:0 auto;"></div>
          </div>

        </div></el-col>

<!---->
        <el-col :span="6">
          <div style="border: #ccd6e0 solid 1px;height: 266px">
            <div style="padding-left: 16px;min-width: 50px;">
              <h5 style="border-left: 2px solid #88B7E0;text-indent: 8px;font-size: 14px;margin: 8px 0">组件状态</h5>
            </div>
            <el-table :data="conditionsTable" :show-header="false" style="width: 95%;margin:0 auto;max-height: 220px;overflow: auto;" size="small">
              <el-table-column label="" prop="name" width="">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                  <el-tooltip effect="dark"  placement="right" style="float: right">
                    <div slot="content" v-html="statusInfo(scope.row)"></div>
                    <span style="float: right;margin-right: 10px" v-if="scope.row.status==='True'">
                        <span style="width: 14px;height: 16px;background-color: #33cb01;display: inline-block;border-radius: 50%; vertical-align:middle;"></span>
                        <span style="color: #33cb01;font-size: 12px">运行中</span>
                    </span>
                    <span style="float: right;margin-right: 10px" v-else>
                        <span style="width: 14px;height: 16px;background-color: red;display: inline-block;border-radius: 50%; vertical-align:middle;"></span>
                        <span style="color: red;font-size: 12px">错误</span>
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>

      </el-row>

      <div style="margin-top: 10px;border: #ccd6e0 solid 1px;height: 400px;">
        <div style="padding-left: 16px;min-width: 50px;">
          <h5 style="border-left: 2px solid #88B7E0;text-indent: 8px;font-size: 14px;margin: 8px 0">
            事件
<!--            <el-input v-model="search" placeholder="请输入搜索内容" style="width: 260px;float: right;margin-right: 15px" size="mini"></el-input>-->
          </h5>
        </div>
        <el-table :data="tables" height="350" size="small">
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
      </div>


      <div style="margin-top: 10px;border: #ccd6e0 solid 1px;height: 400px;">
        <div style="padding-left: 16px;min-width: 50px;">
          <h5 style="border-left: 2px solid #88B7E0;text-indent: 8px;font-size: 14px;margin: 8px 0">资源监控</h5>
        </div>
        <el-table>
          <el-table-column label="类型" prop="" align="" width="100"></el-table-column>
          <el-table-column label="对象" prop="" align="" width="300"></el-table-column>
          <el-table-column label="信息" prop="" align="" width=""></el-table-column>
          <el-table-column label="原因" prop="" align="" width="200"></el-table-column>
          <el-table-column label="时间" prop="" align="" width="200"></el-table-column>
        </el-table>
      </div>
    </el-card>


  </div>
</template>

<script>
  import pagination from '@/components/Pagination/pagination'
  import echarts from 'echarts'
  import  'echarts/theme/macarons.js'
  export default {
    name: 'dashboard',
    data(){return{
      limit: 10,
      page: 1,
      total: 0,
      search: '',
      tableData: [],
      conditionsTable: [],

      node_count: 0,
      node_problem: 0,
      url: this.GLOBAL.service_tag+'/api/kubernetes/node/',
      event_url: this.GLOBAL.service_tag+'/api/kubernetes/event/',
      dashboard_url: this.GLOBAL.service_tag+'/api/kubernetes/dashboard/',
    }},
    components: {
      pagination: pagination,
    },
    methods:{
      ChangeKubeCluster: function(){
        this.$store.dispatch('getKubeNS', {'url': this.url}).then(response=>{
          this.$store.state.kube.ns_id='all'
          this.conditionsTable=response.data.data
          this.ChangeNS()
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },

      ChangeNS: function(){
        this.$store.dispatch('getKubeTable', {'url': this.event_url}).then(response=>{
          this.tableData = response.data.rows
          this.GetDashboard()
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },

      getKubeCluster: function(){
        this.$store.dispatch('getKubeEnv', {url:this.url, label_selector: ''}).then(response=>{
          // console.log('response:', response)
          this.conditionsTable=response.data.data
          this.$store.state.kube.ns_id='all'
          this.GetDashboard()
          this.ChangeNS()
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },

      // 查看相关联的GetPodUsage
      GetDashboard: function() {
        this.axios({
          method: 'GET',
          url: this.dashboard_url,
          params: {'env': this.$store.state.kube.env_id, 'namespace': this.$store.state.kube.ns_id},
        }).then((response)=>{
          // console.log('GetPodPerformance:',response.data);
          if(response.data.status){
            this.nodePIE(response.data.data.node_count, response.data.data.node_problem)
            this.pie(response.data.data.pods_running,response.data.data.pods_count - response.data.data.pods_running, 'pod_pie', '容器组')
            this.pie(response.data.data.deployment_count-response.data.data.deployment_problem, response.data.data.deployment_problem, 'deployment_pie', '无状态')
            this.pie(response.data.data.statefulset_count-response.data.data.statefulset_problem, response.data.data.statefulset_problem, 'statefulset_pie', '有状态')
            this.pie(response.data.data.svc_count-response.data.data.svc_problem, response.data.data.svc_problem, 'svc_pie', '服务')
            this.pie(response.data.data.pvc_count-response.data.data.pvc_problem, response.data.data.pvc_problem, 'pvc_pie', '存储声明')
            this.pie(response.data.data.ds_count-response.data.data.ds_problem, response.data.data.ds_problem, 'ds_pie', '守护进程')
          }else {
            // for(let i=0;i<class_echart.length;++i){class_echart[i].innerText=''}
            // this.$message.error({message: response.data.error})
            console.log('从Prometheus获取资源信息报错:',response.data.error)
          }
        }).catch((response) => {
          console.log('catch: 从Prometheus获取资源信息报错:',String(response))
          // this.$message.error({message: String(response)});
        });
      },

      // 目标状态信息
      statusInfo: function(row){
        //console.log("detail:", detail)
        let str_content = '';
        for(let i in row){
          str_content = str_content + '<div style="padding: 2px">'+i + ": " + row[i] + '</div>'
        }
        return str_content
      },

      // node 情况半圆饼图
      nodePIE: function(total, problem) {
        let data = [
          {
            value: total-problem,
            name: '正常',
            itemStyle: {
              normal: {
                color: '#3bbffd',
                label: {
                  show: true,
                  formatter: '{c}',
                  textStyle: {color: '#fff'}
                }
              }
            }
          },
          {
            value: problem,
            name: '异常',
            itemStyle: {
              normal: {
                color: '#f1ab38',
                label: {
                  show: true,
                  formatter: '{c}',
                  textStyle: {color: '#fff'}
                }
              }
            }
          },
          ]
        let a = 0
        for (let i = 0; i < data.length; i++) {a += data[i].value}
        data.push({value: a, name: '__other', itemStyle: {normal: {color: 'rgba(0,0,0,.0)'}}})
        let option = {
          legend: {
            bottom: 20,
            left: 'center',
            data: ['正常','异常'],
            formatter:  function(name){
              let total = 0;
              let target;
              for (let i = 0, l = data.length; i < l; i++) {
                total += data[i].value;
                if (data[i].name == name) {
                  target = data[i].value;
                }
              }
              let arr = [
                '{a|'+name+':}{b|'+target+'}'
              ]
              return arr.join('\n')
            },
            textStyle:{
              rich:{
                a:{},
                b:{}
              }
            },
          },
          series : [
            {
              name: '节点状态',
              type: 'pie',
              barWidth: '50',
              startAngle:-180,
              radius : ['90%', '60%'],
              center: ['50%', '70%'],
              data:data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: { normal: { show: true, position: 'center', formatter: function(params) {
                    let arr=['{value|'+total+'}', '{name|总计}']
                    return arr.join('\n')
                  },
                  rich: {
                    value: {
                      color: '#303133',
                      fontSize: 16,
                      fontWeight: 'bold',
                      lineHeight: 16,
                    },
                    name: {
                      color: '#909399',
                      lineHeight: 16
                    },
                  },
                } }
            }
          ]
        }
        let myChart = echarts.init(document.getElementById('node_pie'));
        myChart.setOption(option);
      },

      pie: function(ready_count, failed_count, id, title) {
        if(failed_count===0){failed_count=''}
        let data = [
          {
            value: ready_count,
            name: '正常',
            itemStyle: {
              normal: {
                color: 'rgb(0, 153, 0)',
                label: {
                  show: true,
                  formatter: '{c}',
                  textStyle: {color: '#fff'}
                }
              }
            }
          },
          {
            value: failed_count,
            name: '异常',
            itemStyle: {
              normal: {
                color: '#f1ab38',
                label: {
                  show: true,
                  formatter: '{c}',
                  textStyle: {color: '#fff'}
                }
              }
            }
          },
        ]
        // let a = 0
        // for (let i = 0; i < data.length; i++) {a += data[i].value}
        // data.push({value: a, name: '__other', itemStyle: {normal: {color: 'rgba(0,0,0,.0)'}}})
        let option = {
          title: {
            text: title,
            left: 'center',
            textStyle: {
              fontStyle:'normal',
              fontWeight:'normal',
              fontSize:14,
            },

          },
          legend: {
            bottom: 20, left: 'center', data: ['正常','异常'],
            formatter:  function(name){
              let total = 0;
              let target;
              for (let i = 0, l = data.length; i < l; i++) {
                total += data[i].value;
                if (data[i].name == name) {
                  target = data[i].value;
                }
              }
              let arr = [
                '{a|'+name+':}{b|'+target+'}'
              ]
              return arr.join('\n')
            },
            textStyle:{
              rich:{
                a:{},
                b:{}
              }
            },
          },
          series : [
            {
              name: '节点状态',
              type: 'pie',
              radius : ['65%', '58%'],
              center: ['50%', '42%'],
              data:data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: { normal: { show: true, position: 'center',
                  formatter: function(params) {
                    let arr=['{value|'+(ready_count+ failed_count)+'}', '{name|总计}']
                    return arr.join('\n')
                  },
                  rich: {
                    value: {
                      color: '#303133',
                      fontSize: 16,
                      fontWeight: 'bold',
                      lineHeight: 16,
                    },
                    name: {
                      color: '#909399',
                      lineHeight: 16
                    },
                  },
              } }
            }
          ]
        }
        let myChart = echarts.init(document.getElementById(id));
        myChart.setOption(option);
      },

    },
    mounted () {
      this.getKubeCluster()

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
      },

    }

  }
</script>

<style scoped>

  /deep/ .el-table td,
  .el-table th.is-leaf {
    border-bottom: 0px solid red;
    border-top: 0px solid red;
  }

  /deep/ .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-bottom: 0px solid red;
    /*border-top: 0px solid red;*/
  }

  /deep/ .el-table--border td,
  .el-table--border th {
    border: 0px solid red;
  }

  /deep/ .el-table::before {
    height: 0;
  }

</style>
