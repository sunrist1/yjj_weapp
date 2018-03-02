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
    navType:'3month',
    shengouRateList:[],
    shuhuiRateList:[],
    currentIndex:0,
    currentItemId:0,
    increseData:'',
    isCurrency:false,  // 用于判断是否是货币基金
  },
  onShareAppMessage: function (res) {
    var that = this;
    var sharePath = 'pages/publicFundDetail/publicFundDetail?id=' + that.data.fundInfo.fundCode;
    console.log(sharePath);
    return {
      title: that.data.fundInfo.data.F_INFO_FULLNAME,
      path: sharePath,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  onLoad: function (option) {
    var id = option.id ? option.id : '210012';
    this.setData({
      fundCode: id
    })

    // 获取详情信息
    this.getFundInfo();
  },
  /**
 * 下拉刷新
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getFundInfo();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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
    var url = that.data.isCurrency ? config.service.wanNavTrade : config.service.fundNavTrade;
    wx.request({
      url: url, 
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

        if(chartData.length < 1){
          wx.showToast({
            title: '无相关数据',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        if (!that.data.increseData){
          var length = chartData.length;
          if (that.data.isCurrency) {
            that.setData({
              increseData: ((chartData[length - 1].WAN - chartData[length - 2].WAN) / chartData[length - 2].WAN * 100).toFixed(2)
            })
          } else {
            that.setData({
              increseData: ((chartData[length - 1].NAVVALUE - chartData[length - 2].NAVVALUE) / chartData[length - 2].NAVVALUE * 100).toFixed(2)
            })
          }
        }
        
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
          dateList.push(el.DATEVALUE)
          if (that.data.isCurrency){
            valueList.push(el.WAN)
          }else{
            valueList.push(el.NAVVALUE)
          }
        })

        var chartName = '净值',
            yTitle ='净值走势(元)';
        if (that.data.isCurrency){
          chartName = '万份收益';
          yTitle = '万份收益走势';
        }
        var valueListCache = [];
        valueList.forEach(function(el){
          valueListCache.push(el)
        })
        var sortList = valueList.sort(function(a,b){
          return a - b;
        })
        lineChart = new wxCharts({
          canvasId: 'lineCanvas_1',
          type: 'line',
          categories: dateList,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: chartName,
            data: valueListCache,
            color:'#455D7A',
            format: function (val, name) {
              return val.toFixed(2);
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: yTitle,
            format: function (val) {
              return val.toFixed(2);
            },
            min: sortList[0]-0.02
          },
          width: windowWidth,
          height: 200,
          dataLabel: false,
          dataPointShape: false,
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
    util.showBusy('正在加载...');
    wx.request({
      url: config.service.fundDetailUrl, //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        fundCode: that.data.fundCode,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete:function(res){
        wx.hideToast()
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          fundInfo: res.data.data
        })

        if (that.data.fundInfo.data.F_INFO_FIRSTINVESTTYPE.indexOf('货币') >= 0){
          that.setData({
            isCurrency:true
          })
        }

        // 回调请求走势图
        that.getFundChartData();
        // 获取申购费率
        that.getShengouRate();
        // 获取赎回费率
        that.getShuhuiRate();
      }
    })
  },

  /**
   * 申购费率
   */
  getShengouRate:function(){
    var that = this;
    util.showBusy('正在加载...');
    wx.request({
      url: config.service.fundShengouRate, //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        windcode: that.data.fundInfo.data.WINDCODE,
        fundcode: that.data.fundCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function (res) {
        wx.hideToast()
      },
      success: function (res) {
        that.setData({
          shengouRateList: res.data.data.list
        })
      }
    })
  },

  /**
   * 赎回费率
   */
  getShuhuiRate: function () {
    var that = this;
    util.showBusy('正在加载...');
    wx.request({
      url: config.service.fundShuhuiRate, //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        windcode: that.data.fundInfo.data.WINDCODE,
        fundcode: that.data.fundCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function (res) {
        wx.hideToast()
      },
      success: function (res) {
        that.setData({
          shuhuiRateList: res.data.data.list
        })
      }
    })
  },

  /**
   * 基金信息滑动时间
   */
  changeInfoSwiper:function(e){
    var cur = e.detail.current;
    this.setData({
      currentIndex:cur
    })
  },

  /**
   * 切换基金信息栏
   */
  changeInfoBar:function(e){
    var cur = e.target.dataset.current;
    this.setData({
      currentItemId:cur
    })
  }
});