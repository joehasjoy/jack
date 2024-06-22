<template>
  <div style="margin: 10px">
    <div id="cpuChart" style="width: 50%;height: 400px;float: left"></div>
    <div id="memChart" style="width: 50%;height: 400px;float: left"></div>
    <div id="diskChart" style="width: 50%;height: 400px;float: left"></div>
    <div id="countChart" style="width: 50%;height: 400px;float: left"></div>
  </div>

</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'host-matrix',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        data_count: [],
        data_cpu: [],
        data_mem: [],
        data_disk: [],
        cpus: 0,
        mems: 0,
        disks: 0,
        counts: 0,
        url: this.GLOBAL.service_tag+'/api/bi/host-matrix/',
      }
    },
    mounted(){
      this.InitGetData(this.url);
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
    }
  }
</script>

<style scoped>

</style>
