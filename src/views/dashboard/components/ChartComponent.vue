<template>
  <div class="echart" ref="echartRef"></div>
</template>
<script>
export default {
  name: "myEchart",
  data() {
    return {
      echart: null,
    };
  },
  props: {
    title: {
      type: String,
      default: "CPU占用",
    },
    seriesList: {
      type: Array,
      default: [],
    },
    xData: {
      type: Array,
      default() {
        return [];
      },
    }, // X 轴数据
  },
  computed: {
    series() {
      let list = [];
      this.seriesList.map((item, index) => {
        let obj = {
          name: item.name,
          id: index,
          type: "bar",
          stack: "使用情况",
          data: item.data,
          barWidth: '12',
          itemStyle: {
            normal: { color: item.color },
          },
        };
        list.push(obj);
      });
      return list;
    },
  },
  watch: {
    seriesList: {
      handler(newVal, oldVal) {
        if (this.echart) {
          if (newVal) {
            this.seriesList = newVal;
          } else {
            this.seriesList = oldVal;
          }
          if (this.$refs.echartRef) {
            this.initChart();
          }
        } else {
          this.$nextTick(() => {
            if (this.$refs.echartRef) {
              this.initChart();
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initChart() {
      this.echart = this.$echarts.init(this.$refs.echartRef);

      let options = {
        title: {
          text: this.title,
          left: "20px",
          textStyle: {
            color: "#333",
            fontSize: 17,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          data: this.xData,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#BBBBBB",
            },
          },
          axisLabel: {
            show: true,
            color: "#BBBBBB",
            fontWeight: "bold",
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ededed",
              type: 'dashed'
            },
          },
          axisLine: {
            show: false,
            color: "#BBBBBB"
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            color: "#BBBBBB",
            fontWeight: "bold",
          },
        },
        legend: {
          show: true,
          icon: 'circle'
        },
        series: this.series,
      };
      // 使用刚指定的配置项和数据显示图表。
      this.echart.setOption(options);

      // this.echart.on("click", (params) => {
      //   let { type, id, name } = params.data;
      //   this.$emit("chartClick", { type, id, name });
      // });
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.echartRef) {
        this.initChart();
      }
    });
  },
};
</script>
<style  scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>

