export default {
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
        HY: '0.0287345',
      },
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
    }
  },
  methods: {
    
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
    loadFile1(e) {
      let self = this;
      let files = e.target.files;
      self.fileName1 = "";
      self.sigmaFiles = {};
      // document.getElementById('excel').value="";
      if (files && files.length > 0) {
        self.fileName1 = self.fileName1 + files[0].name + ";";
        self.sigmaFiles = files;
      }
    },
    uploadSigma() {
      let self = this;

      // 校验文件上传是否为空
      if (JSON.stringify(self.sigmaFiles) === '{}') {
        alert("请选择上传的文件");
        return false
      }
      //  文件上传参数

      let name = self.sigmaFiles[0].name.substring(self.sigmaFiles[0].name.lastIndexOf(".") + 1).toLowerCase();
      if (name != "xlsx" && name != "xls") {
        alert("请选择.xlsx格式文件上传！");
        return
      }

      let fd = new FormData();
      fd.append("sigmaFiles", document.getElementById("excel1").files[0]);

      self.$axios.post('/uploadSigma/', fd)
        .then(res => {
          if (res.data) {
            document.getElementById('excel1').value = "";
            self.sigmaFiles = {};
            self.fileName1 = '';
            self.createTime = res.data;
            alert('即时文件上传成功');
          }
        })
        .catch(err => {
          console.log(err);
        })
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
      self.benchList = []
      self.queryData.timeShift = self.timeShift;
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
          self.benchMark('id')
        })
        .catch(err => {
          console.log(err);
        })
    },
    searchWind() {
      let self = this;
      self.tableList = [];
      
      self.queryData.timeShift = self.timeShift;

      let check = self.check('wind');
      if (check == false) {
        return
      }
      
      let params = {
        query: self.queryData
      }
      self.loaddingClass = true;
      self.$axios.post('/searchByWind/', params)
        .then(res => {
          let obj = eval('(' + res.data + ')');
          self.tableList = self.toFixed(obj.data);
          self.sumList = self.sum(obj.sum);
          
          self.benchMark('wind')
          self.loaddingClass = false;

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
        for (let i = 0; i < 10; i++) {
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