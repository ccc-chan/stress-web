import HeatMap from '../../components/echart.vue'
export default {
  components: {
    "heat-map": HeatMap
  },
  data() {
    return {
      labelPosition: 'right',
      queryData: {
        ID: '19461157',
        contract_name: '000016.SH',
        volatility_bump: '1.0',
        price_bump: '1.0',
        timeShift: '2019-07-08',
        OM: '0.0229471',
        TM: '0.0250464',
        SM: '0.0254817',
        NM: '0.0255681',
        OY: '0.0258563',
        SY: '0.0263679',
        TY: '0.0270334',
        FY: '0.0279025',
        // HY: null,
        type:'Price'
      },
      options: [
        {
          value: 'Price',
          label: 'Price'
        }, {
          value: 'Delta',
          label: 'Delta'
        }, {
          value: 'Delta_Pct',
          label: 'Delta_Pct'
        }, {
          value: 'Gamma',
          label: 'Gamma'
        }, {
          value: 'Gamma_Pct',
          label: 'Gamma_Pct'
        }, {
          value: 'Theta',
          label: 'Theta'
        }, {
          value: 'Theta_Pct',
          label: 'Theta_Pct'
        }, {
          value: 'Vega',
          label: 'Vega'
        }, {
          value: 'Vega_Pct',
          label: 'Vega_Pct'
        },
        {
          value: 'PV',
          label: 'PV'
        }
      ],
      tableList: [],
      // history
      fileName: '',
      historyFiles: {},
      // sigma
      fileName1: '',
      sigmaFiles: {},
      loaddingClass: false,
      createTime: {},
      timeShift: '2019-07-08',
      sumList: [],
      fixedHeader: false,
      hLeft: 0,
      hHeight: 0,
      show: false,
      benchList: [],
      maxData: 0,
      minData: 0,
      heatData: [],
    }
  },
  methods: {
    selectChart(heatArr) {
      let self = this;
      let heatData = heatArr[0];
      let maxData = Math.round(heatArr[1] * 10000) / 10000;
      let minData = Math.round(heatArr[2] * 10000) / 10000;
      let ytitle = ['-5%', '-4%', '-3%', '-2%', '-1%', '波动率', '1%',
        '2%', '3%', '4%', '5%'];
      let xtitle = ['-5%', '-4%', '-3%', '-2%', '-1%', '标的价格', '1%',
        '2%', '3%', '4%', '5%'
      ];
      
      let chartTitle = ''
      if (self.queryData.type == 'Delta' || self.queryData.type == 'Gamma' || self.queryData.type == 'Theta'
        || self.queryData.type == 'Vega' || self.queryData.type == 'PV') {
        chartTitle = '单位（万）'
      }else{
        chartTitle = '单位（元）'
      }
      
      heatData.forEach(item => {
        if (item[2] == 0) {
          return item[2] = 0.000
        }

        return item[2] = Math.round(item[2] * 10000) / 10000;
      });

      let option = {
        title: {
          text: chartTitle,
          left: '3%',
          top: '2%',
          textStyle: {
            color: '#fff'
          },
        },
        tooltip: {
          position: 'top'
        },
        animation: false,
        grid: {
          height: '70%',
          y: '10%'
        },
        xAxis: {
          type: 'category',
          data: xtitle,
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
          data: ytitle,
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
          min: minData,
          max: maxData,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          precision: 3,
          bottom: '5%',
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#269f3c', '#942e38', '#f46d43', '#d73027', '#a50026']
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
      
    }, 
    loadFile(e) {
      let self = this;
      let files = e.target.files;
      self.fileName = "";
      self.historyFiles = {};
      if (files && files.length > 0) {
        self.fileName = self.fileName + files[0].name + ";";
        self.historyFiles = files;
      }
    },
    uploadHistory() {
      let self = this;

      // 校验文件上传是否为空
      if (JSON.stringify(self.historyFiles) === '{}') {
        alert("请选择上传的文件");
        return false
      }
      //  文件上传参数

      let name = self.historyFiles[0].name.substring(self.historyFiles[0].name.lastIndexOf(".") + 1).toLowerCase();
      if (name != "xlsx" && name != "xls") {
        alert("请选择.xlsx格式文件上传！");
        return
      }

      let fd = new FormData();
      fd.append("historyFile", document.getElementById("excel").files[0]);

      self.$axios.post('/upload/', fd)
        .then(res => {
          if (res.data) {
            document.getElementById('excel').value = "";
            self.historyFiles = {};
            self.fileName = '';
            self.createTime = res.data;
            alert('历史文件上传成功');
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    benchMark(type){
      let self = this;
      self.queryData.timeShift = self.timeShift;
      let oldPrice = self.queryData.price_bump
      let oldvolat = self.queryData.volatility_bump
      self.queryData.price_bump = '1.0';
      self.queryData.volatility_bump = '1.0';
      let params = {
        query: self.queryData
      }
      if (type == 'id') {
        self.$axios.post('/searchById/', params)
          .then(res => {
            let obj = eval('(' + res.data + ')');
            self.benchList = self.sum(obj.sum);
            self.queryData.price_bump = oldPrice
            self.queryData.volatility_bump = oldvolat
          })
          .catch(err => {
            console.log(err);
          })
      }else{
        self.$axios.post('/searchByWind/', params)
          .then(res => {
            let obj = eval('(' + res.data + ')');
            self.benchList = self.sum(obj.sum);
          })
      }
    },
    searchId() {
      let self = this;
      self.tableList = []
      self.benchList = []
      self.queryData.timeShift = self.timeShift;
      let check = self.check('id');
      if (check == false) {
        return
      }
      
      let params = {
        query: self.queryData
      }
      
      self.$axios.post('/searchById/', params)
        .then(res => {
          let obj = eval('(' + res.data + ')');
          self.tableList = self.toFixed(obj.data);
          self.sumList = self.sum(obj.sum);
          self.benchMark('id');
          self.selectChart(obj.heatMap);
        })
        .catch(err => {
          console.log(err);
        })
    },
    sum(arr){
      for (const i in arr) {
        if (i > 0) {
          arr[i] = Math.round(arr[i] * 10000) / 10000
        }
        else {
          arr[i] = '-'
        }
      }
      return arr;
    },
    check(type){
      let self = this;
      if (type == 'id') {
        if (!self.queryData.ID) {
          alert("请输入ID");
          return false;
        }
      }else{
          if (!self.queryData.contract_name) {
            alert("请输入contract_name");
            return false;
          }
      }
      if (!self.timeShift) {
        alert("请输入timeShift");
        return false;
      } else if (!self.queryData.price_bump) {
        alert("请输入price_bump");
        return false;
      } else if (!self.queryData.volatility_bump) {
        alert("请输入volatility_bump");
        return false;
      }

    },
    toFixed(obj){
      let tmpArr = [];
      let resultArr = [];
      for (let j = 0; j < obj[0].length; j++) {
        tmpArr = [];
        for (let i = 0; i < 11; i++) {
          let num;
          if (i > 0) {
            if (obj[i][j] == null) {
              num = '-';
            } else {
              num = Math.round(obj[i][j] * 10000) / 10000
              // num = obj[i][j].toFixed(4);
            }
          } else {
            num = obj[i][j];
          }
          tmpArr.push(num);
        }
        resultArr.push(tmpArr);
      }
      return resultArr;
    }
  },
  mounted() {
    let self = this;
    let box = self.$refs.tableScrollBox;
    box.addEventListener('scroll', () => {
      var scrollTop = box.scrollTop;
      var fixedHead = self.$refs.tableFixedHead;
      fixedHead.scrollTop = scrollTop;
    }, false)
    
  }, 
  created() {
    let self = this;
    self.$axios.post('/createTime/')
      .then(res => {
        self.createTime = res.data;
      })
      .catch(err => {
        console.log(err);
      })
  },
}