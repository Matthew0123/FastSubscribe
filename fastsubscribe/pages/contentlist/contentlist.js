//获取应用实例
const app = getApp()
function queryNews(optiontabs,that)
{
  let searchlength = optiontabs.length;
  var temp = optiontabs[that.data.activeIndex];
  wx.request({
    url: app.globalData.domainName + "express/queryNewsOnline",
    data: {
      word: temp.keyword,
    },
    header: {//请求头
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    success: function (res) {
      if (res.data.ok) {
        var tarray = res.data.value;
        temp.list = tarray;
        that.setData({
          tabs: optiontabs
        })
        console.log(that.data.tabs);
      }
      else
      {
        wx.showModal({
          content: '咨询查询失败，请重新尝试！',
          showCancel: false
        });
      }
    }
  }); 
}

Page({
  data: {
    activeIndex: 0,
    tabs: [],
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function (options) {
    var that = this;
    var optiontabs = JSON.parse(options.tabs);
    queryNews(optiontabs, that);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length) + 10,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  bindDownLoad:function(){

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
    var optiontabs = this.data.tabs;
    queryNews(optiontabs,this);
  },
  pageskip: function (e) {
    wx.navigateTo({
      url: '../webview/webview?link=' + encodeURIComponent(e.currentTarget.dataset.text)
    })
  }
});