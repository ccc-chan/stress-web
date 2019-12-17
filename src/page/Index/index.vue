<template>
  <div class="index">
    <div class="content">
      <el-form :inline="true" :label-position="labelPosition" class="demo-form-inline">
        <el-row>
          <el-col :span="12">
            <div class="el-form-item tip">
              <label for="">历史文件创建时间：</label>
              <span v-model="createTime.hTime">{{createTime.hTime}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="el-form-item upload">
              <input class="name-input" type="text" v-model="fileName" placeholder="请上传xls、xlsx格式的Excel文件" readonly>
              <input class="hide-input ui-input-file" @change="loadFile($event)" type="file" id="excel" name="file">
              <a href="javascript:;" @click="uploadHistory()">上传数据文件</a>
            </div>
          </el-col>
          <!-- <el-col :span="12">
            <div class="el-form-item upload">
              <input class="name-input" type="text" v-model="fileName1" placeholder="请上传xls、xlsx格式的Excel文件" readonly>
              <input class="hide-input ui-input-file" @change="loadFile1($event)" type="file" id="excel1" name="file1">
              <a href="javascript:;" @click="uploadSigma()">上传即时文件</a>
            </div>
          </el-col> -->
        </el-row>
        <transition-group name="slide-fade">
          <el-row v-if="show" key="a">
            <el-col :span="6">
              <el-form-item label="1M：">
                <el-input v-model="queryData.OM" placeholder="请输入1M"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="3M：">
                <el-input v-model="queryData.TM" placeholder="请输入3M"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="6M：">
                <el-input v-model="queryData.SM" placeholder="请输入6M"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="9M：">
                <el-input v-model="queryData.OM" placeholder="请输入9M"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="show" key="b">
            <el-col :span="6">
              <el-form-item label="1Y：">
                <el-input v-model="queryData.OY" placeholder="请输入1Y"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="2Y：">
                <el-input v-model="queryData.SY" placeholder="请输入2Y"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="3Y：">
                <el-input v-model="queryData.TY" placeholder="请输入3Y"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="4Y：">
                <el-input v-model="queryData.FY" placeholder="请输入4Y"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </transition-group>
        <el-row>
          <transition name="slide-fade">
            <el-col v-if="show" :span="6">
              <el-form-item label="5Y：">
                <el-input v-model="queryData.HY" placeholder="请输入5Y"></el-input>
              </el-form-item>
            </el-col>
          </transition>
          <el-col :span="6">
            <el-form-item label="ID：">
              <el-input v-model="queryData.ID" placeholder="请输入ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期：">
              <el-date-picker v-model="timeShift" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
              <!-- <el-input v-model="queryData.timeShift" placeholder="请输入timeShift"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="价格扰动：">
              <el-input v-model="queryData.price_bump" placeholder="请输入价格扰动"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="波动率扰动：">
              <el-input v-model="queryData.volatility_bump" placeholder="请输入波动率扰动"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标的代码：">
              <el-input v-model="queryData.contract_name" placeholder="请输入标的代码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="btn">
              <el-button type="primary" @click="show = !show">show</el-button>
              <el-button type="primary" @click="searchId()">search by ID</el-button>
              <el-button type="primary" @click="searchWind()">search by Wind</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="图形类型：">
              <el-select v-model="queryData.type" placeholder="请选择" >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table table-scroll-mod">
      <div class="table-scroll-box" ref="tableScrollBox">
        <div class="loadding" v-show="loaddingClass">
          <img src="../../assets/loadding.gif" alt="">
        </div>
        <!-- fixed -->
        <div class="fixed-head" ref="tableFixedHead">
          <table>
            <thead>
              <tr>
                <th>benchMark</th>
                <th>Price</th>
                <th>Delta</th>
                <th>Delta_Pct</th>
                <th>Gamma</th>
                <th>Gamma_Pct</th>
                <th>Theta</th>
                <th>Theta_Pct</th>
                <th>Vega</th>
                <th>Vega_Pct</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(val, vindex) in benchList" :key="vindex">{{val}}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>sum</th>
                <th>Price</th>
                <th>Delta</th>
                <th>Delta_Pct</th>
                <th>Gamma</th>
                <th>Gamma_Pct</th>
                <th>Theta</th>
                <th>Theta_Pct</th>
                <th>Vega</th>
                <th>Vega_Pct</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td v-for="(val, vindex) in sumList" :key="vindex">{{val}}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>ID</th>
                <th>Price</th>
                <th>Delta</th>
                <th>Delta_Pct</th>
                <th>Gamma</th>
                <th>Gamma_Pct</th>
                <th>Theta</th>
                <th>Theta_Pct</th>
                <th>Vega</th>
                <th>Vega_Pct</th>
              </tr>
            </thead>
          </table>
        </div>
        <!-- active -->
        <table class="active" v-show="!loaddingClass">
          <thead>
            <tr>
              <th>benchMark</th>
              <th>Price</th>
              <th>Delta</th>
              <th>Delta_Pct</th>
              <th>Gamma</th>
              <th>Gamma_Pct</th>
              <th>Theta</th>
              <th>Theta_Pct</th>
              <th>Vega</th>
              <th>Vega_Pct</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(val, vindex) in benchList" :key="vindex">{{val}}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>sum</th>
              <th>Price</th>
              <th>Delta</th>
              <th>Delta_Pct</th>
              <th>Gamma</th>
              <th>Gamma_Pct</th>
              <th>Theta</th>
              <th>Theta_Pct</th>
              <th>Vega</th>
              <th>Vega_Pct</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(val, vindex) in sumList" :key="vindex">{{val}}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>ID</th>
              <th>Price</th>
              <th>Delta</th>
              <th>Delta_Pct</th>
              <th>Gamma</th>
              <th>Gamma_Pct</th>
              <th>Theta</th>
              <th>Theta_Pct</th>
              <th>Vega</th>
              <th>Vega_Pct</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rindex) in tableList" :key="rindex" >
              <td v-for="(val, vindex) in row" :key="vindex">{{val}}</td>
            </tr>
          </tbody>  
        </table>
      </div>
    </div>
      <div id="heat" class="heat" style="width:100%;height:600px;margin: 0 auto 50px;background: #222a41;"> </div>
      <!-- <heat-map :heatData="heatData" :max="maxData" :min="minData" ></heat-map> -->
    <div>
      
    </div>
  </div>
</template>
<script src='./index.js'>
// import {post} from '../api/api'
</script>
<style lang="less" scoped>
  @import './index';
  #sTable {
    margin: 300px
  }
  .fixedCol{
    position: fixed;
    left: 0;
    background: lightblue;
    z-index: 1;
  }
    #fHeader {
      background: lightblue;
      position: fixed;
      top: 0;
      z-index: 1;
    }
    .fixedA1{
      background: lightblue;
      position: fixed;
      top: 0;
      left: 0;
      z-index:2;
    }
    [v-cloak]{
      display: none;
    }
</style>