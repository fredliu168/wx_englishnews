// newscontent.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: 'https://www.qzcool.com/api/v1.0/',
    Title: '',
    Title_words: [],
    Source: '',
    NewsId: 0,
    news_content: {},
    new_image_url: '',
    screenHeight: 0,
    screenWidth: 0,
    selected_word: '',
    showTipDlg: false,
    word_phonetic: '',
    word_explains: [],
    last_word: '',
    style: {},
    isOut: true,
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

    var Title_words = this.URLdecode(options.Title).split(/\s+?/);

    console.log(Title_words);


    this.setData({
      Title_words: Title_words,
      Title: options.Title,
      NewsId: options.NewsId,
      Source: options.Source
    });


    var vm = this;
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });

    this.getText(this.data.NewsId);

  },
  URLdecode: function (sStr) {//处理url中特殊保留字符?
    return decodeURI(sStr).replace('%3F', '?');
  },

  getText: function (newID) {
    var vm = this;
    var url = vm.data.api + 'news/' + newID;
    //console.log(url);

    wx.showLoading({
      title: '加载中',
    });

    //服务器请求数据
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },

      success: function (res) {
        //console.log(res.data);
        var news_content = res.data['data'];

        for (var i = 0; i < news_content.length; i++) {
          //console.log(news_content[i].Sentence);
          news_content[i].words = news_content[i].Sentence.split(/\s+?/);
        }

        vm.setData({
          news_content: news_content,
          new_image_url: vm.data.api + 'image/' + vm.data.NewsId + '.jpg'
        });

        wx.hideLoading();

      }
    })

  },

  tapContainer: function (event) {

    console.log("tapContainer");

    var vm = this.data;

    if (vm.isOut) {
      this.setData({
        showTipDlg: false
      })
      vm.isOut = false;
    }

    vm.isOut = true;
  },

  tapName: function (event) {
    //点击单词
    console.log(event.currentTarget.dataset.hi);
    var word = event.currentTarget.dataset.hi;

    var vm = this.data;

    vm.isOut = false;

    if (vm.last_word != '') {
      vm.style[vm.last_word] = '';
    }
    vm.last_word = word;

    //console.log(word.replace(/[^a-zA-Z]/g, ''));

    vm.style[word] = 'color: green';
    this.setData({
      selected_word: this.stripscript(word),
      showTipDlg: true,
      word_phonetic: '',
      word_explains: [],
      style: vm.style

    });

    word = this.stripscript(word);

    var url = this.data.api + 'query/' + word;

    var vm = this;



    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data);
        vm.data.word_phonetic = res.data['basic']['us-phonetic'];
        vm.data.word_explains = res.data['basic']['explains'];

        if (vm.data.word_phonetic != null) {
          vm.data.word_phonetic = '/' + vm.data.word_phonetic + '/';
        }

        vm.setData({
          word_phonetic: vm.data.word_phonetic,
          word_explains: vm.data.word_explains
        });
      }

    });

  },

  closeTip: function () {
    console.log("close");


    this.setData({
      showTipDlg: false
    })
  },

  stripscript: function (word) {
    //过滤特殊字符
    /*
    var pattern = new RegExp("[`~!@#$^&*()=|{}\"':;',\\[\\].<>/?~！@#￥……&*;—|{}‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
    */

    return word.replace(/[^a-zA-Z]/g, '')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.Title);
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
    this.getText(this.data.NewsId);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { 
   
    var vm = this;
    var path = '/pages/newscontent/newscontent?NewsId=' + this.data.NewsId + '&Title=' + this.data.Title + '&Source=' + this.data.Source;
   
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