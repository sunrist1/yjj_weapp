// pages/newsDetail/newsDetail.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleTitle:"",
    articleCreateTime:""
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
      key: 'articleContent',
      success: function (res) {
        var article = res.data.articleContent;
        console.log(res.data)
        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        WxParse.wxParse('article', 'html', article, that, 5);

        // 设置导航标题
        // wx.setNavigationBarTitle({
        //   title: res.data.title
        // })

        that.setData({
          articleTitle:res.data.title,
          articleCreateTime:res.data.time
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.articleTitle,
      path: 'pages/newsDetail/newsDetail',
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
  }
})