function getLoginMsg(login,user,that,cb)
{
  wx.request({
    //获取openid接口
    url: that.globalData.domainName + 'weixin/getLoginMsg',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
      code: login.code
    },
    method: 'GET',
    success: function (res) {
      if (res.data.ok) {
        that.globalData.userInfo = user.userInfo;
        that.globalData.openId = res.data.value.openid;
        typeof cb == "function" && cb(that.globalData.userInfo, that.globalData.openId)
      }
      else {
        console.log("微信openid获取失败！");
      }
    }
  })
}
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (login) {
          wx.getUserInfo({
            success: function (user) {
              // 登录
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  getLoginMsg(login,user,that,cb);
                }
              })
            }
          })
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    domainName: "https://www.shangyuekeji.com/v1/api/",
    openId:null
  }
})