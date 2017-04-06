const env = require('../../utils/env');
const app = getApp()
// const sliderWidth = 56.25; // 需要设置slider的宽度，用于计算中间位置
const qiniuUploader = require("../../utils/qiniuUploader");
// 初始化七牛相关参数
const initQiniu = () => {
  var options = {
    region: 'ECN', // 华东区
    uptokenURL: `${env.apiDomain}/api/token`,
    // uptoken: 'xxxx',
    domain: `${env.qiniuDomain}`
  };
  qiniuUploader.init(options);
}
// 上传文件
const chooseImage = (vm) => {
  initQiniu();
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        vm.setData({
          'imageObject': res
        });
        // TODO: 提交到baochen服务器，明天就做
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      });
    }
  })
}

Page({
  data: {
    message: 'Hello KeiSei!',
    userInfo: {},
    loading: false,
    moments: [],
    imageObject: {},
    tabs: [
      {
        default: "../../assets/images/hot.png",
        selected: "../../assets/images/hot_fill.png"
      }, 
      {
        default: "../../assets/images/discover.png",
        selected: "../../assets/images/discover_fill.png"
      }, 
      {
        default: "../../assets/images/like.png",
        selected: "../../assets/images/like_fill.png"
      }
    ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
            sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
      this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
      });
  },
  onReady: function () {
    var that = this;
    wx.request({
      url: `${env.apiDomain}/api/moments`,
      success: function(res) {
        console.log(res.data)
        that.setData({
          moments: res.data
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'Colorful Life',
      path: '/pages/index/index',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  onChooseImage: function () {
    var vm = this;
    chooseImage(vm);
  }
})