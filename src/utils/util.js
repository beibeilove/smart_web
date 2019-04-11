export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor((Math.random()*arr.length))
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function dateFormate(times, type, split='-') {
  if (times) {
    if (isNaN(new Date(times).getTime())) {
      times = times && times.indexOf('-') > -1 ? times.replace('-', '/') : times
      times = times && times.indexOf('T') > -1 ? times.replace('T', ' ') : times
      times = times && times.indexOf('.') > -1 ? times.split('.')[0] : times
    }
    const time = new Date(times)
    const year = time.getFullYear()
    const month = time.getMonth() > 8 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
    const day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    const hour = time.getHours() > 9 ? time.getHours() : '0' + time.getHours()
    const minutes = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()
    const seconds = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
    if (type === 'date') {
      return year + split + month + split + day
    } else if (type === 'time') {
      return year + split + month + split + day + ' ' + hour + ':' + minutes + ':' + seconds
    }

  }
}