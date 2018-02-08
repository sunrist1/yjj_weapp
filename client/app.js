//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl);
        this.deviceInfo = this.promise.getDeviceInfo();
    },
    promise: {
      getDeviceInfo: function () {//获取设备信息
        let promise = new Promise((resolve, reject) => {
          wx.getSystemInfo({
            success: function (res) {
              resolve(res)
            },
            fail: function () {
              reject()
            }
          })
        })
        return promise
      }
    },
    getGid: (function () {//全局唯一id
      let id = 0
      return function () {
        id++
        return id
      }
    })()
})