var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

// pages/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchImgUrl:`${config.service.yjjhost}/public/mobile/images/weapp/search.png`,
    sortImgSrc:`${config.service.yjjhost}/public/mobile/images/weapp/sort-descending.png`,
    activeSortImgSrc:`${config.service.yjjhost}/public/mobile/images/weapp/sort-descending_2.png`,
    toView: 'all',
    scrollTop: 100,
    publicFundList:[],
    // 列表请求参数
    pageIndex:1,
    pageSize:20,
    isQueryAll:0,
    sort: "dayInterest",  
    // sort== 净值:netWorth  一月:oneMInterest 三月:threeMInterest  半年:sixMInterest  一年:yearInterest 万份收益:wanInterest
    fundType:"",
    key:"",
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
    this.getPubFundList();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 加载更多
    var that = this;
    that.setData({
      pageIndex: that.data.pageIndex++
    })
    that.getPubFundList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 请求基金列表数据
   */
  getPubFundList: function (clean=0){
    var that = this;
    wx.request({
      url: config.service.publicFundListUrl, //仅为示例，并非真实的接口地址
      method:'post',
      data: {
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize,
        isQueryAll: that.data.isQueryAll,
        sort: that.data.sort,
        type: that.data.fundType,
        key: that.data.key
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(clean == 1){
          that.setData({
            publicFundList:[]
          })
        }
        var list = res.data.data.list;
        list.forEach(function(el){
          var time = new Date(el.updateDateTime * 1000)
          el.typeShortName = el.typeName.substring(0,1);
          el.updateDateTimeUTC = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate();
          el.dayInterest = el.dayInterest ? el.dayInterest.toFixed(2):'--';
          el.oneMInterest = el.oneMInterest ? el.oneMInterest.toFixed(2):'--';
          el.threeMInterest = el.threeMInterest ? el.threeMInterest.toFixed(2):'--';
          el.sixMInterest = el.sixMInterest ? el.sixMInterest.toFixed(2):'--';
          el.yearInterest = el.yearInterest ? el.yearInterest.toFixed(2):'--';
        })

        var localList = that.data.publicFundList;
        that.setData({
          publicFundList: that.data.publicFundList.concat(list)
        })
      }
    })
  },

  /**
   * 修改请求基金类型并刷新列表数据
   */
  changeFundType:function(e){
    var that = this;
    that.setData({
      fundType: e.target.dataset.type
    })
    that.getPubFundList(1);
  },

  /**
   * 修改请求基金的排序类型
   */
  changeSortType:function(e){
    var that = this;
    var sort = e.target.dataset.sort;
    that.setData({
      sort: sort
    })
    that.getPubFundList(1);
  },

  /**
   * 跳转详情页
   */
  toDetail:function(e){
    var code = e.currentTarget.dataset.code;
    console.log(code);
    wx.navigateTo({
      url: '/pages/publicFundDetail/publicFundDetail?id=' + code
    })
  },

  /**
   * 跳转到搜索页
   */
  toSearch:function(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
})