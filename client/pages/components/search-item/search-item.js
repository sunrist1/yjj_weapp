// pages/components/search_item/search-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fundName: {
      type: String,
      value: '',
    },
    fundCode: {
      type: String,
      value: '',
    },
    key:{
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fundNameNodes:"",
    fundCodeNodes:""
  },

  ready:function(){
    var that = this;
    var key = that.properties.key;
    var fundName = that.properties.fundName;
    var fundCode = that.properties.fundCode;

    var fundNameNodes = fundName.replace(new RegExp(key, "gm"), "<span class='key_word'>" + key + "</span>")
    var fundCodeNodes = fundCode.replace(new RegExp(key, "gm"), "<span class='key_word'>" + key + "</span>")

    that.setData({
      fundNameNodes: fundNameNodes,
      fundCodeNodes: fundCodeNodes
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail: function () {
      var that = this;
      var code = that.properties.fundCode
      var fundName = that.properties.fundName
      wx.getStorage({
        key: 'searchHistory',
        success: function (res) {
          var list = res.data;
          list.push({
            fundName: fundName,
            fundCode: code,
            addTime:new Date().getTime()
          })

          list.sort(function (a, b) {
            return b.addTime - a.addTime;
          })

          // 搜索历史去重
          list.forEach(function (el, index) {
            for (var i = index + 1; i < list.length; i++) {
              if (list[index].fundCode == list[i].fundCode) {
                list.splice(i, 1)
              }
            }
          })
          console.log(list)
          wx.setStorage({
            key: "searchHistory",
            data: list
          })
        },
        fail:function(res){
          var list = [{
            fundName:fundName,
            fundCode: code,
            addTime: new Date().getTime()
          }]
          wx.setStorage({
            key: "searchHistory",
            data: list
          })
        },
        complete:function(res){
          wx.navigateTo({
            url: '/pages/publicFundDetail/publicFundDetail?id=' + code
          })
        }
      })
      
    }
  }
})
