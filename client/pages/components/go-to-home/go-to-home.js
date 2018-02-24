// pages/components/gotoHome/go-to-home.js
var config = require('../../../config')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    iconUrl: `${config.service.yjjhost}/public/mobile/images/weapp/home.png`
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoHome:function(){
      console.log('aa')
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})
