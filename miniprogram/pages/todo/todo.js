const db = wx.cloud.database(); // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    this.getdataList()
  },
  addTodo(){
    wx.navigateTo({
      url: '/components/addTodo/addTodo',
    })
  },
  getdataList(){
    db.collection('todo').get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data)
      this.setData({
        dataList: res.data
      })
    })
  },

  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})