// pages/search/search.js
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchImgUrl: `${config.service.yjjhost}/public/mobile/images/weapp/search.png`,
    clockImgUrl: `${config.service.yjjhost}/public/mobile/images/weapp/time.png`,
    hotImgUrl: `${config.service.yjjhost}/public/mobile/images/weapp/hot.png`,
    emptyImgUrl: `${config.service.yjjhost}/public/mobile/images/weapp/empty.png`,

    resultList:[],   // 搜索结果
    searchKey:"",  // 搜索关键字
    showSearch:false,
    inputValue:"",

    searchHistory:[],  // 搜索历史
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
    wx.getStorage({
      key: 'searchHistory',
      success: function (res) {
        var list = res.data;
        that.setData({
          searchHistory: list
        })
      }
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }

  /**
   * 搜索关键字
   */
  searchFund:function(e){
    var that = this;
    var value = e.detail.value;
    if(value == ''){
      that.setData({
        showSearch:false
      })
      return;
    };
    that.setData({
      searchKey:value,
      showSearch:true,
      inputValue:value
    })
    var reqData = {
      pageIndex: 1,
      pageSize: 20,
      isQueryAll: 1,
      sort: 'yearInterest',
      type: '',
      key: value
    };
    wx.request({
      url: config.service.publicFundListUrl, 
      method: 'post',
      data: JSON.stringify(reqData),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          resultList: []
        })
        var list = res.data.data.list;
        that.setData({
          resultList:list
        })
      }
    })
  },

  /**
   * 清除输入框
   */
  clear_input:function(){
    this.setData({
      showSearch: false,
      inputValue:""
    })
  },

  /**
   * 跳转详情页
   */
  toDetail: function (e) {
    var code = e.currentTarget.dataset.code;
    console.log(code);
    wx.navigateTo({
      url: '/pages/publicFundDetail/publicFundDetail?id=' + code
    })
  },

  /**
   * 清除历史记录
   */
  clearStorage:function(){
    this.setData({
      searchHistory:[]
    })
    wx.clearStorage();
  }
})