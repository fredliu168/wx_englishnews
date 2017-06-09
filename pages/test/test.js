// test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: 'https://www.qzcool.com/api/v1.0/',
    news_content: 'hello world? pass',
    new_image_url: '',
    selected_word: '',
    showTipDlg: false,
    word_phonetic: '',
    word_explains: [], 
    last_word:'',
    style: {} 

  },

  tapName: function (event) {

    console.log(event.currentTarget.dataset.hi);
    var word = event.currentTarget.dataset.hi;
 
    var vm = this.data;

    if (vm.last_word != '')
    {
      vm.style[vm.last_word] = '';
    }
    vm.last_word = word;

    vm.style[word] = 'color: green';
    this.setData({
      selected_word: word,
      showTipDlg: true,
      word_phonetic: '',
      word_explains: [],
      style: vm.style

    });

   

    var url = this.data.api + 'query/' + word;

    var vm = this;



    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
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

  getText: function (newID) {
    var vm = this;
    var url = vm.data.api + 'news/' + newID;
    console.log(url);

    //服务器请求数据
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var news_content = res.data['data'];

     for (var i = 0; i < news_content.length;i++)
        {
          console.log(news_content[i].Sentence);
          news_content[i].words = news_content[i].Sentence.split(/\s+?/); 
        } 

        vm.setData({
          news_content: news_content,
          new_image_url: vm.data.api + 'image/' + vm.data.NewsId + '.jpg'
        });

      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getText(55784);

    // var words = this.data.news_content.split(/\s+?/); 

    // console.log(words);
    // this.setData({
    //   newsArray: words
    // });

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

  }
})