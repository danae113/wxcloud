const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    heightValue: '',
    weightValue: '',
    bmi: '',
    photos: [],
    fileIds: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onChangeHeight(e){
    let heightValue = e.detail
    if (this.data.weightValue){
      let bmi = ((this.data.weightValue)/(heightValue * heightValue)).toFixed(2)
      this.setData({
        bmi: bmi
      })
    }
    this.setData({
      heightValue: heightValue
    })
  },
  onChangeWeight(e){
    let weightValue = e.detail
    if (this.data.heightValue) {
      let bmi = (weightValue / (this.data.heightValue * this.data.heightValue)).toFixed(2)
      this.setData({
        bmi: bmi
      })
    }
    this.setData({
      weightValue: weightValue,
    })
  },
  addphoto(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          photos: this.data.photos.concat(tempFilePaths)
        })
      }
    })
  },
  submit(){
    if (this.data.heightValue && this.data.weightValue){
      wx.showLoading({
        title: '保存中',
      })
      // 上传图片到云存储
      let promiseArr = []
      for (let i = 0; i < this.data.photos.length ; i++){
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.photos[i];
          let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
            filePath: item,
            success: res => {
              console.log(res.fileID)
              this.setData({
                fileIds: this.data.fileIds.concat(res.fileID)
              });
              reslove();
            },
            fail: console.error
          })
        }))
      }
      Promise.all(promiseArr).then(res => {
        db.collection('dataList').add({
          data: {
            height: this.data.heightValue,
            weight: this.data.weightValue,
            bmi: this.data.bmi,
            photos: this.data.photos
          }
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
          })
          wx.navigateTo({
            url: '../record/record',
          })
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: '评价失败',
          })
          wx.navigateTo({
            url: '../record/record',
          })
        })
      })


    } else {
      wx.showToast({
        title: '请先填写身高，体重',
        icon: 'none'
      })
      return
    }
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