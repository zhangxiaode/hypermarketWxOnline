//获取应用实例
import { request, login, getUserInfo, getSetting } from "../../utils/index";
Page({
  data: {
    authorize: false
  },
  onShow() {
    this.callbackUser();
  },
  callbackUser() {
    getSetting().then(res => {
      if (res.authSetting['scope.userInfo']) {
        this.setData({ authorize: true });
      } else {
        this.setData({ authorize: false });
      }
    })
  },
  goLogin() {
    login().then(res => {
      getUserInfo().then(data => {
        request({
          url: `/apis/login`,
          method: "post",
          data: {
            code: res.code,
            encryptedData: data.encryptedData,
            iv: data.iv
          }
        }).then(response => {
          if (response.code == 200) {
            wx.setStorageSync('token',response.data.token)
            wx.navigateTo({
              url: '/pages/index/index'
            })
          }
        })
      }).catch(err => {
        wx.showToast({
          title: '请授权后再登录'
        });
      })
    }).catch(err => {
      wx.showToast({
        title: '无法获取用户登录凭证'
      });
    })
  }
})