// pages/newslist/newslist.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiUrl: 'https://www.qzcool.com/api/v1.0/',
    loading:true,
    firstNew: {}, //第一条新闻
    news_list: [],//新闻列表 
    screenHeight: 0,
    screenWidth: 0,
    imagewidth: 0,//缩放后的宽  
    imageheight: 0,//缩放后的高 
  },
  imageLoad: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var vm = this;
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
    vm.getNewsList(0);
  },

  getNewsList: function (newsId) {
    var vm = this;
    var url = vm.data.apiUrl + 'news-list/' + newsId;

    wx.showLoading({
      title: '加载中',
    });


    //服务器请求数据
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

        

        var news_list = res.data['data'];

        if (newsId == 0) {

          vm.data.news_list = [];

          var firstNew = res.data['data'][0];
          firstNew.image = vm.data.apiUrl + 'image/' + firstNew.NewsId + '.jpg';
          firstNew.urlEncodeTitle = vm.URLencode(firstNew.Title);
          console.log(firstNew.urlEncodeTitle);
          vm.setData({
            firstNew: firstNew
          })

          wx.stopPullDownRefresh();
        }  
        const length = res.data['data'].length; 
        for (let i = 0; i < length; ++i) {
          news_list[i].image_s = vm.data.apiUrl + 'image/' + news_list[i].NewsId + '_s.jpg';
          news_list[i].urlEncodeTitle = vm.URLencode(news_list[i].Title);
        }

        vm.data.news_list.push(...news_list);

        vm.setData({ 
          news_list: vm.data.news_list,
          loading:false
        });
        wx.hideLoading();

      }
    })
  },

  URLencode: function (sStr) {//处理url中特殊保留字符?
    return encodeURI(sStr).replace(/\?/g, '%3F').replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(/\'/g, '%27').replace(/\//g, '%2F');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
   
    this.getNewsList(0); 
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
    var vm = this.data;
    var len = vm.news_list.length;
    console.log(vm.news_list[len-1].NewsId);

    this.getNewsList(vm.news_list[len-1].NewsId);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var vm = this;
    var path = '/pages/newslist/newslist';

    return {
      title: '英语文章轻松读,点击单词自动翻译',
      path: path,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          icon: 'success',
          duration: 2000
        })
      }
    }

  }
})