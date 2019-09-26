const db = wx.cloud.database(); // 初始化数据库
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  ready() {
    this.today()
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '',
    content: '',
    level: '',
    needData: '',
    images: [],
    fileIds: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    today(){
      const date = new Date()
      const nowYear = date.getFullYear()
      const nowMonth = date.getMonth() + 1
      const nowDay = date.getDate()
      this.setData({
        needData: nowYear + '-' + nowMonth + '-' + nowDay
      })
    },
    inputtil(e){
      this.setData({
        title: e.detail.value
      })
    },
    inputcon(e){
      this.setData({
        content: e.detail.value
      })
    },
    onChange(e){
      console.log(e)
      this.setData({
        level: e.detail
      })
    },
    bindDateChange(e){
      this.setData({
        needData: e.detail.value
      })
    },
    addImg(){
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
    submit(){
      console.log('submit')
      var flag = true
      var msg = ""
      if (!this.data.title){
        flag = false;
        msg = '标题不能为空'
      } else if (!this.data.content){
        flag = false;
        msg = '内容不能为空'
      } else if(!this.data.level){
        flag = false;
        msg = '请选择重要程度'
      } else if (!this.data.needData) {
        flag = false;
        msg = '请选择日期'
      }
      console.log(flag)
      if (flag){        
        wx.showLoading({
          title: '保存中',
        })
        let data = {
          title: this.data.title,
          content: this.data.content,
          level: this.data.level,
          needData: this.data.needData,
          images: this.data.images,
          isFinish: false
        }
        console.log(data)

        // 上传图片到云存储
        let promiseArr = []
        for (let i = 0; i < this.data.images.length; i++) {
          promiseArr.push(new Promise((reslove, reject) => {
            let item = this.data.images[i];
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
          console.log('res',res)
          db.collection('todo').add({
            data: data
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
            })
            wx.reLaunch({
              url: '/pages/todo/todo',
            })

          }).catch(err => {
            wx.hideLoading();
            wx.showToast({
              title: '保存失败',
            })
            wx.reLaunch({
              url: '/pages/todo/todo',
            })
          })
        })

      }else {
        wx.showToast({
          title: msg,
          mask: true,
          icon: "none"
        })
      }
    }
  }
})
