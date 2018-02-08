//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    carouselImgList: [
      'https://app1.efoundation.com.cn/upload/article/0f01630e-debb-4453-af51-121906bbe5a8.jpg',
      'https://app1.efoundation.com.cn//upload/article/10976389-9b7b-46f0-a04b-0e39d0caa20f.jpg',
      'https://app1.efoundation.com.cn//upload/article/155986b5-82f2-4112-bcb8-b1d9d226a670.jpg'
    ],
    certificateImgSrc:'http://192.168.1.211:3000/certificate_2.png',
    logged: false,
    takeSession: false,
    requestResult: '',
    swiper:{
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 1000
    },
    // 优选基金
    goodFundList:[],
    // 新手基金
    newHandFund:[],
    // 私募基金
    privateFund:[],
    // 活期宝信息
    hqbData:{},
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.getIndexData();
    this.getHqbData();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getIndexData();
    this.getHqbData();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /**
 * 请求基金列表数据
 */
  getIndexData: function () {
    var that = this;
    wx.request({
      url: config.service.indexDataUrl, //仅为示例，并非真实的接口地址
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data.data;
        var newFund = [];
        if (Array.isArray(data.newhand)){
          newFund.concat(data.newhand)
        }else{
          newFund.push(data.newhand)
        }
        newFund.forEach(function(el){
          el.shortFundType = el.typeName.substring(0,1)
        })
        data.publicfund.forEach(function(el2){
          el2.shortFundType = el2.typeName.substring(0, 1)
        })
        that.setData({
          goodFundList: data.publicfund,
          newHandFund: newFund,
          privateFund:data.privatefund
        })
      }
    })
  },
  
  /**
   * 请求活期宝数据
   */
  getHqbData:function(){
    var that = this;
    wx.request({
      url: config.service.hqbDataUrl, //仅为示例，并非真实的接口地址
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data;
        data.navdateStr = data.navdate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
        that.setData({
          hqbData:data
        })
      }
    })
  },

  /**
   * 跳转到基金详情页
   */
  goFundDetail:function(e){
    var code = e.currentTarget.dataset.code;
    console.log(code);
    wx.navigateTo({
      url: '/pages/publicFundDetail/publicFundDetail?id='+code
    })
  },

  /**
   * 跳转列表页
   */
  toList:function(){
    wx.switchTab({
      url: '/pages/list/list'
    })
  }
})
