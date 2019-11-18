const db = wx.cloud.database(); // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    dataList: [],
    todayList: [],
    otherList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.today()
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
  },

  onShow: function () {
    this.getdataList()
  },
  getdataList() {
    db.collection('todos').get().then(res => {
      console.log(res.data)
      let list = res.data
      this.setData({
        dataList: list
      })
    })
  },

  
  today(){
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()  
   
    this.setData({
      date: year + '-' + month + '-' + day
    })
  },

  addTodo(){
    wx.navigateTo({
      url: '/pages/addTodo/addTodo',
    })
  },
  

  bigimage(e){
    this.setData({
      curImg: e.currentTarget.dataset.img
    })
    wx.previewImage({
      current: this.data.curImg[0], // 当前显示图片的http链接
      urls: this.data.curImg        // 需要预览的图片http链接列表
    })
  }
})