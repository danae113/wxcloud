// 日期格式化
const formatTime = (date, time, separator) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  let timedate = [year, month, day].map(formatNumber).join(separator ? separator : '-')
  if (time == 1) {
    timedate += ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return timedate
}

module.exports ={
  COMMONFN: {
    formatTime: formatTime
  }
}