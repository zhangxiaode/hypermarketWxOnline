import { request } from "../../utils/index";
Page({
  data: {
    windowHeight: 740,
    current: 1,
    size: 10,
    photoList: [
    ]
  },
  onShow() {
    var that = this;
    wx.getSystemInfo({
      success (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    this.getList();
  },
  getList() {
    request({
      url: `/apis/photo`,
      method: "get",
      data: {
        size: this.data.size,
        current: this.data.current
      }
    }).then(response => {
      if (response.code == 200) {
        this.setData({
          photoList: [...this.data.photoList,...response.data.records]
        })
      }
    })
  }
})