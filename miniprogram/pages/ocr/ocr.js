
Page({
  data: {

  },

  bankcard() {
    let self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        let filePath = res.tempFilePaths[0]

        let fileBuffer = wx.getFileSystemManager().readFileSync(filePath)
        console.log(fileBuffer)
        wx.cloud.callFunction({
          name: 'ocr',
          data: {
            type: "bank",
            buffer: fileBuffer
          }
        }).then(res => {
          console.log(res)
          let {
            number
          } = res.result.result
          self.setData({
            number
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },

  printText() {
    let self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        let filePath = res.tempFilePaths[0]

        let fileBuffer = wx.getFileSystemManager().readFileSync(filePath)
        console.log(fileBuffer)
        wx.cloud.callFunction({
          name: 'ocr',
          data: {
            type: "print",
            buffer: fileBuffer
          }
        }).then(res => {
          console.log(res)
          let {
            items
          } = res.result.result
          self.setData({
            printText: items
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })

  }


})