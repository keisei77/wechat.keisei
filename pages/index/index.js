const env = require('../../utils/env');
const app = getApp()

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
        TODO: 提交到baochen服务器 123
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
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    indicatorColor: '#ffffff',
    indicatorActiveColor: '#ffae27',
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    defaultSize: 'mini',
    loading: false,
    imageObject: {}
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
  },
  onReady: function () {
    wx.request({
      url: `${env.apiDomain}/api/moments`
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