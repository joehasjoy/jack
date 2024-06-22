<template>
    <div>
      <h1>test ------ test</h1>
      <div id="myChart" :style="{width: '500px', height: '500px'}"></div>
    </div>
</template>
<!--analyze-->
<script>
  import echarts from 'echarts'
  export default {
    name: 'test',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted(){
      this.drawLine();
    },
    methods: {
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        const option = {
          series: [{
            type: 'treemap',
            data: [{
              name: 'nodeA',            // First tree
              value: 10,
              children: [{
                name: 'nodeAa1',       // First leaf of first tree
                value: 4
              },
                {
                  name: 'nodeAa2',       // First leaf of first tree
                  value: 6
                }]
            },
              { name: 'nodeA1', value: 80, },
              { name: 'nodeA2', value: 90, },
              { name: 'nodeA3', value: 60, },
              { name: 'nodeA4', value: 50, },
              { name: 'nodeA5', value: 55, },
              { name: 'nodeA6', value: 75, },
              { name: 'nodeB', value: 20, }
              ]
          }]
        };
        // 绘制图表
        myChart.setOption(option);
      }
    }
  }
</script>

<style scoped>

</style>
