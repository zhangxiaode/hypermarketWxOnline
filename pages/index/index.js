import { request } from "../../utils/index";
Page({
  data: {
    category: [
      {
        type: 1,
        name: "海洋风景"
      },
      {
        type: 2,
        name: "人文景观"
      },
      {
        type: 3,
        name: "婚纱摄影"
      },
      {
        type: 4,
        name: "生活街拍"
      },
      {
        type: 5,
        name: "动物世界"
      },
      {
        type: 6,
        name: "现代科技"
      },
      {
        type: 7,
        name: "明星网红"
      },
      {
        type: 8,
        name: "蓝色星球"
      }
    ],
    windowHeight: 740,
    type: 1,
    current: 1,
    size: 10,
    photoList: [
    ],
    pathList: [],
    loading: false,
    noMore: false
  },
  onLoad() {
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
  onPullDownRefresh() {
    // 下拉刷新操作
    this.setData({
      current: 1,
      noMore: false
    })
    this.getList()
  },
  onReachBottom() {
    // 上拉加载操作
    this.setData({
      current: this.data.current + 1
    })
    this.getList()
  },
  changeCategory(e) {
    this.setData({
      current: 1,
      noMore: false,
      type: e.currentTarget.dataset.type
    })
    this.getList();
  },
  getList() {
    if(!this.data.noMore) {
      this.setData({
        loading: true
      })
      request({
        url: `/apis/photo`,
        method: "get",
        data: {
          size: this.data.size,
          current: this.data.current,
          type: this.data.type
        }
      }).then(response => {
        if (response.code == 200) {
          var photoList = [...this.data.photoList,...response.data.records]
          if(this.data.current == 1) {
            photoList = response.data.records
          }
          if(response.data.records.length < this.size) {
            this.setData({
              photoList,
              pathList: this.data.photoList.map(item => {return item.path}),
              noMore: true
            })
          } else {
            this.setData({
              photoList,
              pathList: this.data.photoList.map(item => {return item.path}),
              noMore: false
            })
          }
          if(this.data.current == 1) {
            wx.stopPullDownRefresh()
          }
          this.setData({
            loading: false
          })
        }
      })
    }
  },
  handlePreview(e){
    wx.previewImage({
      current: e.currentTarget.dataset.path,
      urls: this.data.pathList
    })
  }
})