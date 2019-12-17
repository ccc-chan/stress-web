<template>
  <div>
    <div id="bar" class="container" style="width:100%;height:500px;margin: 0 auto;background: #222a41;"> </div>
  </div>
</template>
<script>
export default {
  props:{
    heateData: {
      type: Object,
      default: ()=>{}
    },
    min:{
      type: Number,
    },
    max:{
      type: Number,
    },
    methods: {
      init() {
        let option = {
          tooltip: {
            position: 'top'
          },
          animation: false,
          grid: {
            height: '50%',
            y: '10%'
          },
          xAxis: {
            type: 'category',
            data: limits,
            splitArea: {
              show: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              },
              // 让字体完全显示
              interval: 0
            }
          },
          yAxis: {
            type: 'category',
            data: limits,
            splitArea: {
              show: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              },
              // 让字体完全显示
              interval: 0
            }
          },
          visualMap: {
            min: min,
            max: max,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            precision: 3,
            bottom: '15%',
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            textStyle: {
              color: '#fff' //legend字体颜色 
            }
          },
          series: [{
            // name: 'Punch Card',
            type: 'heatmap',
            data: heatData,
            label: {
              normal: {
                show: true
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        const chartObj = this.$echarts.init(document.getElementById('heat'));
        chartObj.setOption(option, true);
      }
    },
    watch: {
      heateData:{
        handler (newVal, oldVal) {
          console.log(123123)
          this.init();
        },
        deep: true
      }
    },
  }
}
</script>