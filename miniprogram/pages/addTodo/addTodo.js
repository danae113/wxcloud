// miniprogram/pages/addTodo/addTodo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    level: '',
    needData: '',
    images: [],
    fileIds: [],
    address: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  onShow: function () {

  },

  bindDateChange(e) {
    this.setData({
      needData: e.detail.value
    })
  },
  addphoto(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        })
      }
    })
  },
  addads(){
    wx.chooseLocation({
      success: res => {
        console.log(res)
        let address = {
          addressName : res.address,
          pointname : res.name,
          latitude : res.latitude,
          longitude: res.longitude
        }
        console.log(address)
        this.setData({
          address: address
        })
      }
    })
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