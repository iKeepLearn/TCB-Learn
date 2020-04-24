function formatDate(date, str, hasTime) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if (hasTime) {
    return [year, month, day].map(formatNumber).join(str || '-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }

  return [year, month, day].map(formatNumber).join(str || '-')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function isSameDay(originTime, targetTime) {
  let origin = getDate(originTime)
  let target = getDate(targetTime)

  return origin === target
}

function getDate(time) {
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  return `${year}/${month}/${day}`
}


module.exports = {
  formatDate,
  formatNumber,
  isSameDay,
  getDate
}