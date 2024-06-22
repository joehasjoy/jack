<template>
  <section ref="EcLine" style="width:100%;height:100%;"></section>
</template>
<script>
import echarts from "echarts";
export default {
  props: {
    ecData: { type: Array, default: () => [] }
  },
  mounted() {
    this.initOption();
  },
  methods: {
    initOption() {
      let myChart = echarts.init(this.$refs.EcLine);
      let option = {
        title: {
          text: "慢查询趋势"
        },
        color: ["#409EFF", "#67C23A"],
        tooltip: {
          trigger: "axis",
          formatter: "{b}<br />慢查询：{c}"
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 0,
          containLabel: true
        },
        xAxis: [
          {
            data: this.ecData.map((item, index) => {
              return item.dates;
            }),
            axisTick: { show: false },
            axisLabel: { color: "#999" },
            axisLine: { lineStyle: { color: "#ccc", width: 1 } }
          }
        ],
        yAxis: [
          {
            splitLine: { lineStyle: { type: "dashed" } },
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: "#999" },
            scale: { show: true }
          }
        ],
        series: [
          {
            type: "line",
            data: this.ecData.map((item, index) => {
              return item.value;
            }),
            lineStyle: { width: 3 }
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    }
  },
  watch: {
    ecData() {
      this.initOption();
    }
  }
};
</script>