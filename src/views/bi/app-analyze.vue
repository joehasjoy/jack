<template>
  <div style="margin: 20px">
    <el-card class="box-card">
      <div id="cpuChart" style="width: 50%;height: 400px;float: left"></div>
      <div id="memChart" style="width: 50%;height: 400px;float: left"></div>
      <div id="diskChart" style="width: 50%;height: 400px;float: left"></div>
      <div id="countChart" style="width: 50%;height: 400px;float: left"></div>
    </el-card>

    <el-card class="box-card" style="margin-top: 10px">
      <el-date-picker
        v-model="time_range"
        type="datetimerange"
        value-format="timestamp"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="changeTime"
      >
      </el-date-picker>

      <el-input v-model="search" placeholder="请输入搜索内容" style="width: 300px;float: right"></el-input>
      <el-table border
                :data="tables.slice((page-1)*limit,page*limit)"
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <!--            <div>expand</div>-->
            <el-table border
                      :data="props.row.detail"
                      style="width: 100%;border: #1a1a1a">
              <el-table-column prop="host" label="主机"></el-table-column>
              <el-table-column sortable prop="cpu" label="cpuCore"></el-table-column>
              <el-table-column sortable prop="cpu_min" label="cpu_min"></el-table-column>
              <el-table-column sortable prop="cpu_max" label="cpu_max"></el-table-column>
              <el-table-column sortable prop="cpu_avg" label="cpu_avg"></el-table-column>
              <el-table-column sortable prop="ram_min" label="ram_min"></el-table-column>
              <el-table-column sortable prop="ram_max" label="ram_max"></el-table-column>
              <el-table-column sortable prop="ram_avg" label="ram_avg"></el-table-column>
              <el-table-column sortable prop="mem" label="ram_total"></el-table-column>
              <el-table-column sortable prop="ram_avg_percent" label="ram_avg_percent"></el-table-column>
            </el-table>

          </template>
        </el-table-column>
        <el-table-column
          label="AppCode"
          prop="appCode">
        </el-table-column>
        <el-table-column sortable label="cpuCore" prop="cpu"></el-table-column>
        <el-table-column sortable label="cpu最小使用率" prop="cpu_min"></el-table-column>
        <el-table-column
          sortable
          label="cpu最大使用率"
          prop="cpu_max">
        </el-table-column>
        <el-table-column
          sortable
          label="cpu平均使用率"
          prop="cpu_avg">
        </el-table-column>
        <el-table-column sortable
                         label="内存最小GB"
                         prop="ram_min">
        </el-table-column>
        <el-table-column  sortable
                          label="内存最大GB"
                          prop="ram_max">
        </el-table-column>
        <el-table-column sortable
                         label="内存平均GB"
                         prop="ram_avg">
        </el-table-column>
        <el-table-column sortable
                         label="内存平均使用率"
                         prop="ram_avg_per">
        </el-table-column>
        <el-table-column sortable
                         label="内存总计GB"
                         prop="mem">
        </el-table-column>
        <el-table-column sortable :label="total_count" prop="count"></el-table-column>
        <el-table-column sortable :label="total_zbx_count" prop="zbx_count"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 50, 100, 500]"
          :page-size="limit"
          layout="prev, pager, next, jumper, sizes, total"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>

</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'host-matrix',
    data () {
      return {
        // 矩形图变量
        data_count: [],
        data_cpu: [],
        data_mem: [],
        data_disk: [],
        cpus: 0,
        mems: 0,
        disks: 0,
        counts: 0,
        matrix_url: this.GLOBAL.service_tag+'/api/bi/host-matrix/',

        // app-code 变量
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        time_range: [new Date(new Date() - 3600 * 1000 * 24 * 7).getTime(), new Date().getTime()],
        tableData: [],
        url: this.GLOBAL.service_tag+'/api/zabbix/collect/',
        limit: 10,
        page: 1,
        total: 0,
        search: '',
        total_count: 'Count',
        total_zbx_count: "Zabbix",
      }
    },
    mounted(){
      this.InitGetData(this.matrix_url);
      this.InitGetTableData(this.url, this.limit, this.page)
    },
    methods: {
      // cpu, mem, 数量 绘制矩阵图
      CpuMemCount(){
        // 基于准备好的dom，初始化echarts实例
        let cpuChart = echarts.init(document.getElementById('cpuChart'))
        let memChart = echarts.init(document.getElementById('memChart'))
        let diskChart = echarts.init(document.getElementById('diskChart'))
        let countChart = echarts.init(document.getElementById('countChart'))

        function colorMappingChange(value) {
          var levelOption = getLevelOption(value);
          chart.setOption({
            series: [{
              levels: levelOption
            }]
          });
        }

        var formatUtil = echarts.format;

        function getLevelOption() {
          return [
            {
              itemStyle: {
                normal: {
                  borderColor: '#777',
                  borderWidth: 0,
                  gapWidth: 1
                }
              },
              upperLabel: {
                normal: {
                  show: false
                }
              }
            },
            {
              itemStyle: {
                normal: {
                  borderColor: '#555',
                  borderWidth: 5,
                  gapWidth: 1
                },
                emphasis: {
                  borderColor: '#ddd'
                }
              }
            },
            {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                normal: {
                  borderWidth: 5,
                  gapWidth: 1,
                  borderColorSaturation: 0.6
                }
              }
            }
          ];
        }

        const cpu_option = {
          title: {text: '主机CPU统计图 共：'+this.cpus+' Cores', left: 'center'},
          tooltip: {
            formatter: function (info) {
              // return info.name + ': ' +info.value + " cores";
              var value = info.value;
              var treePathInfo = info.treePathInfo;
              var treePath = [];

              for (var i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              return [
                '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                'CPU: ' + formatUtil.addCommas(value) + ' Cores',
              ].join('');
            }
          },

          series: [{type: 'treemap', data: this.data_cpu,
            visibleMin: 300,
            label: { show: true, formatter: '{b}' },
            upperLabel: { normal: { show: true, height: 30 } },
            itemStyle: { normal: { borderColor: '#fff' } },
            levels: getLevelOption(),
          }]
        }
        const mem_option = {
          title: {text: '主机Memory统计图 共：'+this.mems+' GB', left: 'center'},
          tooltip: {
            formatter: function (info) {
              // return info.name + ': ' +info.value + " GB";
              var value = info.value;
              var treePathInfo = info.treePathInfo;
              var treePath = [];

              for (var i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              return [
                '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                '主机内存: ' + formatUtil.addCommas(value) + ' GB',
              ].join('');
            }
          },
          series: [{type: 'treemap', data: this.data_mem,
            visibleMin: 300,
            label: { show: true, formatter: '{b}' },
            upperLabel: { normal: { show: true, height: 30 } },
            itemStyle: { normal: { borderColor: '#fff' } },
            levels: getLevelOption(),
          }]
        }

        const count_option = {
          title: {text: '主机数量统计图 共：'+this.counts+' 台', left: 'center'},
          tooltip: {
            formatter: function (info) {
              // return info.name + ': ' +info.value + " Count";
              var value = info.value;
              var treePathInfo = info.treePathInfo;
              var treePath = [];

              for (var i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              return [
                '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                '主机数量: ' + formatUtil.addCommas(value),
              ].join('');
            }
          },
          series: [{type: 'treemap', data: this.data_count,
            visibleMin: 300,
            label: { show: true, formatter: '{b}' },
            upperLabel: { normal: { show: true, height: 30 } },
            itemStyle: { normal: { borderColor: '#fff' } },
            levels: getLevelOption(),
          }]
        }

        const disk_option = {
          title: {text: '主机硬盘容量统计图 共：'+this.disks+' GB', left: 'center'},
          tooltip: {
            formatter: function (info) {
              // return info.name + ': ' +info.value + " Count";
              var value = info.value;
              var treePathInfo = info.treePathInfo;
              var treePath = [];

              for (var i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              return [
                '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                '磁盘容量: ' + formatUtil.addCommas(value) + ' GB',
              ].join('');
            }
          },
          series: [{type: 'treemap', data: this.data_disk,
            visibleMin: 300,
            label: { show: true, formatter: '{b}' },
            upperLabel: { normal: { show: true, height: 30 } },
            itemStyle: { normal: { borderColor: '#fff' } },
            levels: getLevelOption(),
          }]
        }
        // 绘制图表
        cpuChart.setOption(cpu_option);
        memChart.setOption(mem_option);
        diskChart.setOption(disk_option);
        countChart.setOption(count_option);
      },

      //获取矩形图的初始数据
      InitGetData: function(url) {
        this.NProgress.start()
        //const parms = {"time_range": JSON.stringify(this.time_range)}
        this.axios({
          method: 'GET',
          url: url,
          // params: parms,
        }).then((response)=>{
          if(response.data.status){
            // console.log('response:',response.data)
            let data_list = response.data.data
            for(let x=0;x<data_list.length;x++){
              let temp_child_cpu = []
              let temp_child_mem = []
              let temp_child_disk = []
              let temp_child_count = []
              for(let i=0;i<data_list[x]['app_list'].length;i++){
                temp_child_mem.push({'name': data_list[x]['app_list'][i]['app'], 'value': data_list[x]['app_list'][i]['hardware']['mem']})
                temp_child_cpu.push({'name': data_list[x]['app_list'][i]['app'], 'value': data_list[x]['app_list'][i]['hardware']['cpu']})
                temp_child_disk.push({'name': data_list[x]['app_list'][i]['app'], 'value': data_list[x]['app_list'][i]['hardware']['disk']})
                temp_child_count.push({'name': data_list[x]['app_list'][i]['app'], 'value': data_list[x]['app_list'][i]['hardware']['count']})
              }
              this.data_cpu.push({'name': data_list[x]['level_domain'], 'value': data_list[x]['cpu'], children: temp_child_cpu})    // level_domain , appCode
              this.data_mem.push({'name': data_list[x]['level_domain'], 'value': data_list[x]['mem'], children: temp_child_mem})
              this.data_disk.push({'name': data_list[x]['level_domain'], 'value': data_list[x]['disk'], children: temp_child_disk})
              this.data_count.push({'name': data_list[x]['level_domain'], 'value': data_list[x]['count'], children: temp_child_count})
              this.cpus = this.cpus + data_list[x]['cpu'];
              this.mems = this.mems + data_list[x]['mem'];
              this.disks = this.disks + data_list[x]['disk'];
              this.counts = this.counts + data_list[x]['count'];
            }
            this.CpuMemCount();
            // console.log('response1:',this.data_cpu)
          }else {this.$notify.error({message: response.data.error})}
          this.NProgress.done();
        }).catch((response) => {
          this.$notify.error({message: JSON.stringify(response)});
          this.NProgress.done();
        });
      },

      // 获取表格数据；
      InitGetTableData: function(url,page_size, page_index, conn) {
        // console.log("url:", this.baseURI)
        // console.log("ChangePage:", this.pageSize, this.currentPage)
        this.NProgress.start()
        // if(conn==undefined){
        //   conn={}
        //   if(this.formSearch.title){conn['title__icontains']=[this.formSearch.title]}
        // if(this.formSearch.user_type_id){conn['user_type_id']=[this.formSearch.user_type_id]}
        // }
        const parms = {"time_range": JSON.stringify(this.time_range)}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('aaa:',response.data.condition_config);
          if(response.data.status){
            this.tableData = response.data.data.rows
            this.total = response.data.data.total
            this.total_count = 'Count 共:'+response.data.data.count
            this.total_zbx_count = 'Zabbix 共: '+response.data.data.zbx_count
          }else {this.$notify.error({message: response.data.error})}
          this.NProgress.done();
        }).catch((response) => {
          this.$notify.error({message: 'GetTableData Error: '+ JSON.stringify(response)});
          this.NProgress.done();
        });

      },

      handleSizeChange: function(val) {
        this.limit = val
      },

      handleCurrentChange: function(val) {
        this.page = val
      },
      changeTime: function() {
        this.InitGetTableData(this.url, this.limit, this.page)
      }
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

<style>
  /*.app-main{background-color: #ebf5f5*/
  /*}*/
</style>
