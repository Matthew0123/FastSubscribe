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
var touchDot = 0;//触摸时的原点 
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理 时间记录 
var tmpFlag = true;// 判断左右华东超出菜单最大值时不再执行滑动事件

Page({
  data: {
    activeIndex: 0,
    tabs: [],
    sliderOffset: 0,
    sliderLeft: 0,
    tabLength:0,
    nthMax:0
  },
  onLoad: function (options) {
    var that = this;
    var optiontabs = JSON.parse(options.tabs);
    queryNews(optiontabs, that);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          tabLength: (res.windowWidth / optiontabs.length),
          nthMax: optiontabs.length
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
  },
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function (e) {
    var touchMove = e.touches[0].pageX; 
    // 向左滑动 
    if(touchMove - touchDot <= -40 && time < 10)
    { 
      if (tmpFlag && this.data.activeIndex < this.data.nthMax)
      { 
        this.setData({
          activeIndex: ++this.data.activeIndex > this.data.nthMax ? this.data.nthMax : this.data.activeIndex,
          sliderOffset: this.data.sliderOffset + this.data.tabLength,
        })
        tmpFlag = false;
        var optiontabs = this.data.tabs;
        queryNews(optiontabs, this);
      } 
    } 
    // 向右滑动 
    if(touchMove - touchDot >= 40 && time < 10)
    { 
      if (tmpFlag && this.data.activeIndex > 0)
      { 
        this.setData({
          activeIndex:--this.data.activeIndex < 0 ? 0 : this.data.activeIndex,
          sliderOffset: this.data.sliderOffset - this.data.tabLength,
        })
        tmpFlag=false;
        var optiontabs = this.data.tabs;
        queryNews(optiontabs, this);
      } 
    } // touchDot = touchMove; //每移动一次把上一次的点作为原点（好像没啥用）     
  },
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true; // 回复滑动事件
  }
});