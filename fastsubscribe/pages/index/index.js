//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
function getInfo(openId,that)
{
  wx.request({
    url: app.globalData.domainName + 'setting/getInfo',
    data: {
      weixin: openId
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      if (res.data.ok) {
        if (res.data.value != null) {
          that.setData({
            keywords: res.data.value.words,
            email:res.data.value.email
          })
        }
      }
      else {
        wx.showModal({
          content: '快订查询失败，请重新加载！',
          showCancel: false
        });
      }
    }
  });
}

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    searchContent: '',
    email:'',
    keywords: [],
    modalHidden: true,
    modalHidden2: true,
    subscribe:4
  },
  onLoad: function () {
    
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo,openId) {
      getInfo(app.globalData.openId, that);
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  addKeyword: function (e) {
    console.log(this.data.keywords)
    if (this.data.searchContent == "") {
      wx.showModal({
        content: '订阅内容为空，请确认！',
        showCancel: false
      });
      return;
    }
    var searchKeywords = this.data.keywords;
    var length = searchKeywords.length;
    if (length >= this.data.subscribe)
    {
      wx.showModal({
        content: '订阅数量达到上限！',
        showCancel: false
      });
      return;
    }
    for (let i = 0; i < length; i++) {
      if (searchKeywords[i] == this.data.searchContent) {
        wx.showModal({
          content: '订阅内容已预订，请确认！',
          showCancel: false
        });
        return;
      }
    }
    searchKeywords.push(this.data.searchContent);
    this.setData({
      keywords: searchKeywords,
      searchContent:''
    });
  },
  minusKeyword: function (e) {
    console.log(e.currentTarget.dataset)
    var dataset = e.currentTarget.dataset;
    var searchKeywords = this.data.keywords;
    searchKeywords.splice(dataset.text, 1);
    this.setData({
      keywords: searchKeywords
    });
  },
  searchInput: function (e) {
    this.setData({
      searchContent: e.detail.value
    })

  },
  emailInput: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  formSubmit: function (e) {
    var formData = e.detail.value;
    let map = util.objToStrMap(formData);
    var tabs = [];
    var str="";
    for (var [key, value] of map)
    {
      if(util.startWith(key,"search")&&value!="")
      {
          let obj = { keyword: value, list: [] };
          tabs.push(obj);
          str += value + ",";
      }
    }
    str=str.substring(0,str.length-1);
    var tabsStr= JSON.stringify(tabs);
    wx.showModal({
      title: '提示',
      content: '已输入完成，确定提交么？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domainName + 'setting/update',
            method: 'POST',
            data: {
              weixin: app.globalData.openId,
              words:str,
              email: formData.email
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.ok) {
                wx.navigateTo({
                  url: '../contentlist/contentlist?tabs=' + tabsStr
                })
              }
              else {
                wx.showModal({
                  content: '查询失败，请重新尝试！',
                  showCancel: false
                });
              }
            }
          });
          return;
        } else {
          return;
        }
      }
    });
  }
})
