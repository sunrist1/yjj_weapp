var wxCharts = require('../../utils/wxcharts.js');
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

var app = getApp();
var lineChart = null;
var lineChart2 = null;
Page({
  data: {
    fundCode:'',
    fundInfo:{},
    navType:'3month'
  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  /**
 * 下拉刷新
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getIndexData();
    this.getHqbData();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onLoad: function (option) {
    console.log(option.id)
    this.setData({
      fundCode:'040008'
    })

    // 获取详情信息
    this.getFundInfo();
  },

  changeNavType:function(e){
    var that = this;
    var navType = e.currentTarget.dataset.type;
    that.setData({
      navType:navType
    })

    that.getFundChartData();
  },

  // 获取净值走势数据
  getFundChartData: function () {
    var that = this;
    wx.request({
      url: config.service.fundNavTrade, //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        windcode: that.data.fundInfo.data.WINDCODE,
        datetype: that.data.navType
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var chartData = res.data.data.list;
        var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }

        var valueList = [],
            dateList = [];

        chartData.forEach(function(el){
          valueList.push(el.DATEVALUE)
          dateList.push(el.NAVVALUE)
        })

        lineChart = new wxCharts({
          canvasId: 'lineCanvas_1',
          type: 'line',
          categories:  valueList,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: '净值',
            data: dateList,
            color:'#455D7A',
            format: function (val, name) {
              return val.toFixed(2);
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '净值走势 (元)',
            format: function (val) {
              return val.toFixed(2);
            },
            min: 0
          },
          width: windowWidth,
          height: 200,
          dataLabel: false,
          dataPointShape: true,
          extra: {
            lineStyle: 'straight'
          }
        });
      }
    })
  },
  updateData: function () {
    var simulationData = this.getFundChartData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
  onShow: function (e) {

  },

  /**
   * 获取基金详情信息
   */
  getFundInfo:function(){
    var that = this;
    wx.request({
      url: config.service.fundDetailUrl, //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        fundCode: that.data.fundCode,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          fundInfo: res.data.data
        })

        // 回调请求净值走势
        that.getFundChartData();
      }
    })
  }
});