// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"nuanxin"
})

const db = cloud.database()
const _ = db.command
const logger = cloud.logger()


function isToday(sign_time) {
  let today = getDate(Date.now())
  sign_time = getDate(sign_time)

  logger.info({
    today,
    sign_time
  })

  return today === sign_time
}

function dayIsYesterday(yesterday) {
  let newDay = Date.now();
  let oldDay = new Date(yesterday).getTime();
  return newDay - oldDay <= 24 * 60 * 60 * 1000;
}

function getDate(time) {
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  return `${year}-${month}-${day}`
}



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID
  const now = Date.now()

  const {
    data
  } = await db.collection('sign').where({
      _openid
    })
    .orderBy('sign_time', 'desc')
    .limit(1)
    .get()

  let lastSign = data.length && data[0]
  let lastSignTime = lastSign.sign_time || new Date('2020-1-2').getTime()
  let continue_sign_days = lastSign.continue_sign_days || 0
  let signed = data.length ? isToday(lastSign.sign_time) : false

  if (signed) {
    return {
      signed
    }
  } else {


    let isYesterday = dayIsYesterday(now, lastSignTime)

    if (isYesterday) {
      continue_sign_days = continue_sign_days + 1
    }


    let {
      _id
    } = await db.collection('sign').add({
      data: {
        _openid,
        sign_time: now,
        continue_sign_days
      }
    })



    return {
      signed: true,
      id: _id
    }
  }






}