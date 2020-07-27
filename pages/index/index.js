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
    photoListLeft: [],
    photoListRight: [],
    leftHeight: 0,
    rightHeight: 0,
    photoListRight: [],
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
    if(!this.data.loading && !this.data.noMore) {
      this.setData({
        current: this.data.current + 1
      })
      this.getList()
    }
  },
  changeCategory(e) {
    this.setData({
      current: 1,
      noMore: false,
      type: e.currentTarget.dataset.type
    })
    this.getList();
  },
  async getList() {
    if(!this.data.noMore) {
      this.setData({
        loading: true
      })
      const { code, data } = await request({
        url: `/apis/photo`,
        method: "get",
        data: {
          size: this.data.size,
          current: this.data.current,
          type: this.data.type
        }
      })
      if(this.data.current == 1) {
        wx.stopPullDownRefresh()
      }
      if(data.records.length < this.data.size) {
        this.setData({
          noMore: true
        })
      } else {
        this.setData({
          noMore: false
        })
      }
      if (code == 200) {
        if(this.data.current == 1) {
          this.setData({
            photoListLeft: [],
            photoListRight: [],
            leftHeight: 0,
            rightHeight: 0,
            pathList: []
          })
        }
        data.records = data.records.map(item => {
          item.path = "https://www.zxdkk.com/photo" + item.path
          item.preview = true
          // item.realPath = "../../assets/images/logo.png"
          return item
        })
        var photoListLeft = this.data.photoListLeft
        var photoListRight = this.data.photoListRight
        var leftHeight = this.data.leftHeight
        var rightHeight = this.data.rightHeight
        var pathList = this.data.pathList
        Promise.all(data.records.map(async item=>{
          let { height } = await wx.getImageInfo({ src: item.path })
          if(leftHeight <= rightHeight) {
            photoListLeft.push(item)
            leftHeight += height
          } else {
            photoListRight.push(item)
            rightHeight += height
          }
          pathList.push(item.path)
          this.setData({
            photoListLeft,
            photoListRight,
            leftHeight,
            rightHeight,
            pathList
          })
        })).then(() => {
          this.setData({
            loading: false
          })
        })
      }
    }
  },
  handleLoad(e) {
    var photoListLeft = this.data.photoListLeft.map(item => {
      if(item.id == e.currentTarget.dataset.item.id) {
        item.preview = false
      }
      return item
    })
    var photoListRight = this.data.photoListRight.map(item => {
      if(item.id == e.currentTarget.dataset.item.id) {
        item.preview = false
      }
      return item
    })
    this.setData({
      photoListLeft,
      photoListRight
    })
  },
  handlePreview(e){
    wx.previewImage({
      current: e.currentTarget.dataset.path,
      urls: this.data.pathList
    })
  }
})