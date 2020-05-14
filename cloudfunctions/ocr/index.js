// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "nuanxin"
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    type,
    buffer
  } = event

  let imgBuffer = new Buffer(buffer)
  let result

  switch (type) {
    case "bank":
      result = await cloud.openapi.ocr.bankcard({
        type: 'photo',
        img: {
          contentType: 'image/png',
          value: imgBuffer
        }
      })
      break;

    case "print":
      result = await cloud.openapi.ocr.printedText({
        type: 'photo',
        img: {
          contentType: 'image/png',
          value: imgBuffer
        }
      })
      break;
  }



  return {
    result
  }
}