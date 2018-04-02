
Page({
  data: {
    link:""
  },
  onLoad: function (options) {
    this.setData({
      link: decodeURIComponent(options.link),
    })
  }
})