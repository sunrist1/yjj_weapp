//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topImgSrc:"http://app1.efoundation.com.cn/public/mobile/images/tjcl/index_carousel.jpg",
    jrktType: [
      { label:'smjn',name:'私募锦囊'},
      { label:'peztc',name:'PE直通车'},
      { label:'xtzn',name:'信托指南'},
      { label:'jxsp',name:'精选视频'}
    ],
    newsAjaxTYpe: [
      { label: 'goldFund', name: '金股基金' },
      { label: 'themeFund', name: '主题投基' },
      { label: 'hotPoint', name: '基金热点' },
      { label: 'industryDiscuss', name: '行业研究' },
      { label: 'medias', name: '资讯早知道' },
      { label: 'industrys', name: '行业动态' },
      { label: 'hitea', name: '理财下午茶' },
      { label: 'books', name: '好书推荐' }
    ],
    newsList:[],
    newsCacheList:[],
    pageIndex:1,
    randomDataTime:1,   // 用于判定是否继续插入数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.data.jrktType.forEach(function(el){
      that.getJrktData(el.label)
    })

    that.data.newsAjaxTYpe.forEach(function (el) {
      that.getNewsData(el.label)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var index = this.data.pageIndex;
    var that = this;
    index++;
    that.setData({
      pageIndex: index
    });
    that.setData({
      randomDataTime: 1
    })
    that.data.jrktType.forEach(function (el) {
      that.getJrktData(el.label)
    })

    that.data.newsAjaxTYpe.forEach(function (el) {
      that.getNewsData(el.label)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  // 请求金融课堂资讯
  getJrktData:function(type){
    var that = this;
    var reqObj = {
      pageIndex: that.data.pageIndex,
      pageSize: 20,
      recommendedStatus: 1,
      type: type,
      subType:""
    }
    var reqData = JSON.stringify(reqObj);
    wx.request({
      url: config.service.jrktUrl, //仅为示例，并非真实的接口地址
      method: 'post',
      data: reqData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var list = that.data.newsCacheList,
          listCache = [];

        res.data.bannerDatas.data.list.forEach(function (el) {
          var time = new Date(el.editDatetime * 1000);
          var obj = {
            title: el.title,
            type: el.typeName,
            time: time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate(),
            imgUrl: config.service.yjjhost+'/'+el.photoUrl,
            timeUnix: el.editDatetime,
            articleContent: el.articleContent
          }
          listCache.push(obj)
        })
        list.sort(function (a, b) {
          return b.timeUnix - a.timeUnix
        })
        list = list.concat(listCache);
        that.setData({
          newsCacheList: list
        })
      }
    })
  },

  // 请求投基策略和财富头条资讯
  getNewsData: function (type) {
    var that = this;
    var reqObj = {
      pageIndex: that.data.pageIndex,
      pageSize: 20,
      articleType: type,
    }
    var reqData = JSON.stringify(reqObj);
    wx.request({
      url: config.service.newsAjaxUrl, //仅为示例，并非真实的接口地址
      method: 'post',
      data: reqData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var list = that.data.newsCacheList,
            listCache = [];
        res.data.data.list.forEach(function(el){
          var time = new Date(el.editDatetime * 1000);
          var obj = {
            title: el.articleTitle,
            type: el.articleTypeName,
            time: time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate(),
            imgUrl: config.service.yjjhost+'/'+el.articlePhoto,
            timeUnix: el.editDatetime,
            articleContent: el.articleContent
          }
          listCache.push(obj)
        })
        list.sort(function(a,b){
          return b.timeUnix - a.timeUnix
        })
        list = list.concat(listCache);
        that.setData({
          newsCacheList: list
        })
      }
    })
  }
})