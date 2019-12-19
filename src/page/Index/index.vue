<template>
  <div class="index">
    <div class="content">
      <span class="show" v-if="!show" @click="show = !show">+</span>
      <span class="show" v-else @click="show = !show">-</span>
      <el-form :inline="true" :label-position="labelPosition" class="demo-form-inline">
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
          <!-- <transition name="slide-fade">
            <el-col v-if="show" :span="6">
              <el-form-item label="5Y：">
                <el-input v-model="queryData.HY" placeholder="请输入5Y"></el-input>
              </el-form-item>
            </el-col>
          </transition> -->
          <el-col :span="6">
            <el-form-item label="ID：">
              <el-input v-model="queryData.ID" placeholder="请输入ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期：">
              <!--Not queryData.timeShift-->
              <el-date-picker v-model="timeShift" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="价格扰动：">
              <el-input v-model="queryData.price_bump" placeholder="请输入价格扰动"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="波动率扰动：">
              <el-input v-model="queryData.volatility_bump" placeholder="请输入波动率扰动"></el-input>
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
          <el-col :span="10">
            <div class="el-form-item upload">
              <input class="name-input" type="text" v-model="fileName" placeholder="请上传xls、xlsx格式的Excel文件" readonly>
              <input class="hide-input ui-input-file" @change="loadFile($event)" type="file" id="excel" name="file">
              <a href="javascript:;" @click="uploadHistory()">上传数据文件</a>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-item tip">
              <label for="">历史文件创建时间：</label>
              <span>{{createTime.hTime}}</span> 
              <!--<span v-model="createTime.hTime">-->
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="12">
            <el-form-item class="btn">
              <el-button type="primary" @click="searchId()">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        </el-row>
      </el-form>
    </div>


    <div>
      <table>
        <thead>
          <tr>
            <th width="10%">benchMark</th>
            <th width="10%">PV(万)</th>
            <th width="6%">Delta(万)</th>
            <th width="10%">Delta_Pct(%)</th>
            <th width="6%">Gamma(万)</th>
            <th width="10%">Gamma_Pct(%)</th>
            <th width="6%">Theta(万)</th>
            <th width="10%">Theta_Pct(%)</th>
            <th width="6%">Vega(万)</th>
            <th width="10%">Vega_Pct(%)</th>
            <th width="6%">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(val, vindex) in benchList" :key="vindex">{{val}}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th width="10%">加总</th>
            <th width="10%">PV(万)</th>
            <th width="6%">Delta(万)</th>
            <th width="10%">Delta_Pct(%)</th>
            <th width="6%">Gamma(万)</th>
            <th width="10%">Gamma_Pct(%)</th>
            <th width="6%">Theta(万)</th>
            <th width="10%">Theta_Pct(%)</th>
            <th width="6%">Vega(万)</th>
            <th width="10%">Vega_Pct(%)</th>
            <th width="6%">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td v-for="(val, vindex) in sumList" :key="vindex">{{val}}</td>
          </tr>
        </tbody>
      </table>
    </div>
      

    <div class="table table-scroll-mod">
      <div class="table-scroll-box" ref="tableScrollBox">
        <div class="loading" v-show="loadingClass">
          <img src="../../assets/loading.gif" alt="">
        </div>
        <!-- fixed -->
        <!--
        <div class="fixed-head" ref="tableFixedHead">
          <table>
            <thead>
              <tr>
                <th width="10%">ID</th>
                <th width="10%">PV(万)</th>
                <th width="6%">Delta(万)</th>
                <th width="10%">Delta_Pct(%)</th>
                <th width="6%">Gamma(万)</th>
                <th width="10%">Gamma_Pct(%)</th>
                <th width="6%">Theta(万)</th>
                <th width="10%">Theta_Pct(%)</th>
                <th width="6%">Vega(万)</th>
                <th width="10%">Vega_Pct(%)</th>
                <th width="6%">Price</th>
              </tr>
            </thead>
          </table>
        </div>
        -->
        <!-- active -->
        <table class="active" v-show="!loadingClass">
          <thead>
            <tr>
              <th width="10%">benchMark</th>
              <th width="10%">PV(万)</th>
              <th width="6%">Delta(万)</th>
              <th width="10%">Delta_Pct(%)</th>
              <th width="6%">Gamma(万)</th>
              <th width="10%">Gamma_Pct(%)</th>
              <th width="6%">Theta(万)</th>
              <th width="10%">Theta_Pct(%)</th>
              <th width="6%">Vega(万)</th>
              <th width="10%">Vega_Pct(%)</th>
              <th width="6%">Price</th>
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