import { axios } from '@/utils/request'

// ====================================问候语==============================================================
/**
 * 问候语列表
 * @param parameter
 * @returns {*}
 */
export function getGreetList(parameter) {
  return axios({
    url: '/listgreet',
    method: 'get',
    params: parameter
  })
}

/**
 * 新增问候语
 * @param parameter
 * @returns {*}
 */
export function addGreet(parameter) {
  return axios({
    url: '/addgreet',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除问候语
 * @param parameter
 * @returns {*}
 */
export function deleteGreet(parameter) {
  return axios({
    url: '/deletegreet?id='+parameter,
    method: 'post',
    data: {}
  })
}

/**
 * 更新问候语
 * @param parameter
 * @returns {*}
 */
export function updateGreet(parameter) {
  return axios({
    url: '/updategreet',
    method: 'post',
    data: parameter
  })
}

/**
 * 问候语详情
 * @param parameter
 * @returns {*}
 */
export function getGreetDetail(parameter) {
  return axios({
    url: '/findgreet',
    method: 'post',
    data: parameter
  })
}
// ====================================未识别问题==============================================================

/**
 * 未识别问题统计列表
 * @param parameter
 * @returns {*}
 */
export function getNoRecognizedList(parameter) {
  return axios({
    url: '/listunidentified',
    method: 'get',
    params: parameter
  })
}

/**
 * 无答案回复列表
 * @param parameter
 * @returns {*}
 */
export function getNoAnswerApplyList(parameter) {
  return axios({
    url: '/listunanswer',
    method: 'get',
    params: parameter
  })
}

/**
 * 新增无答案回复
 * @param parameter
 * @returns {*}
 */
export function addNoAnswerApply(parameter) {
  return axios({
    url: '/addunanswer',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除无答案回复
 * @param parameter
 * @returns {*}
 */
export function deleteNoAnswerApply(parameter) {
  return axios({
    url: '/deleteunanswer?id='+parameter,
    method: 'post',
    data: {}
  })
}

/**
 * 更新无答案回复
 * @param parameter
 * @returns {*}
 */
export function updateNoAnswerApply(parameter) {
  return axios({
    url: '/updateunanswer',
    method: 'post',
    data: parameter
  })
}

/**
 * 无答案回复详情
 * @param parameter
 * @returns {*}
 */
export function getNoAnswerApplyDetail(parameter) {
  return axios({
    url: '/findunanswer',
    method: 'post',
    data: parameter
  })
}

// ===========================================设备管理===================================================================

/**
 * 设备管理列表
 * @param parameter
 * @returns {*}
 */
export function getEquipmentList(parameter) {
  return axios({
    url: '/listDevice',
    method: 'get',
    params: parameter
  })
}

/**
 * 更新设备管理
 * @param parameter
 * @returns {*}
 */
export function updateEquipment(parameter) {
  return axios({
    url: '/updatedevice',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除设备管理
 * @param parameter
 * @returns {*}
 */
export function deleteEquipment(parameter) {
  return axios({
    url: '/deleteDevice?id='+parameter,
    method: 'post',
    data: {}
  })
}

/**
 * 设备管理详情
 * @param parameter
 * @returns {*}
 */
export function getEquipmentDetail(parameter) {
  return axios({
    url: '/findDevice',
    method: 'post',
    data: parameter
  })
}

// ====================================经销商==============================================================

/**
 * 经销商列表
 * @param parameter
 * @returns {*}
 */
export function getDealerList(parameter) {
  return axios({
    url: '/listDealer',
    method: 'get',
    params: parameter
  })
}

/**
 * 新增经销商
 * @param parameter
 * @returns {*}
 */
export function addDealer(parameter) {
  return axios({
    url: '/addDealer',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除经销商
 * @param parameter
 * @returns {*}
 */
export function deleteDealer(parameter) {
  return axios({
    url: '/deleteDealer?id='+parameter,
    method: 'post',
    data: {}
  })
}

/**
 * 更新经销商
 * @param parameter
 * @returns {*}
 */
export function updateDealer(parameter) {
  return axios({
    url: '/updateDealer',
    method: 'post',
    data: parameter
  })
}

/**
 * 经销商详情
 * @param parameter
 * @returns {*}
 */
export function getDealerDetail(parameter) {
  return axios({
    url: '/findDealer',
    method: 'post',
    data: parameter
  })
}

// =========================================区域列表====================================================================
/**
 * 区域列表
 * @param parameter
 * @returns {*}
 */
export function getAreaList(parameter) {
  return axios({
    url: '/getRegion',
    method: 'post',
    data: parameter
  })
}


// =========================================轮播图====================================================================
/**
 * 轮播图列表
 * @param parameter
 * @returns {*}
 */
export function getBannerList(parameter) {
  return axios({
    url: '/listShow',
    method: 'post',
    data: parameter
  })
}

/**
 * 轮播图更新
 * @param parameter
 * @returns {*}
 */
export function updateBanner(parameter) {
  return axios({
    url: '/Slideshow?slideshow=' + parameter,
    method: 'post',
    data: {}
  })
}

/**
 * 文件上传
 * @param parameter
 * @returns {*}
 */
export function uploadFile(parameter) {
  console.log(parameter)
  return axios({
    url: '/uploadFolder',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// ====================================关键字==============================================================

/**
 * 关键字列表
 * @param parameter
 * @returns {*}
 */
export function getKeywordList(parameter) {
  return axios({
    url: '/listKeyword',
    method: 'get',
    params: parameter
  })
}

/**
 * 新增关键字
 * @param parameter
 * @returns {*}
 */
export function addKeyword(parameter) {
  return axios({
    url: '/addKeyword',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除关键字
 * @param parameter
 * @returns {*}
 */
export function deleteKeyword(parameter) {
  return axios({
    url: '/deleteKeyword?id='+parameter,
    method: 'post',
    data: {}
  })
}

/**
 * 更新关键字
 * @param parameter
 * @returns {*}
 */
export function updateKeyword(parameter) {
  return axios({
    url: '/updateKeyword',
    method: 'post',
    data: parameter
  })
}

/**
 * 关键字详情
 * @param parameter
 * @returns {*}
 */
export function getKeywordDetail(parameter) {
  return axios({
    url: '/findKeyword',
    method: 'post',
    data: parameter
  })
}


// ====================================问题==============================================================

/**
 * 问题列表
 * @param parameter
 * @returns {*}
 */
export function getQuestionList(parameter) {
  return axios({
    url: '/listQuestion',
    method: 'get',
    params: parameter
  })
}

/**
 * 新增问题
 * @param parameter
 * @returns {*}
 */
export function addQuestion(parameter) {
  return axios({
    url: '/addQuestion',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除问题
 * @param parameter
 * @returns {*}
 */
export function deleteQuestion(parameter) {
  return axios({
    url: '/deleteQuestion?id='+parameter,
    method: 'post',
    data: {}
  })
}

/**
 * 更新问题
 * @param parameter
 * @returns {*}
 */
export function updateQuestion(parameter) {
  return axios({
    url: '/updateQuestion',
    method: 'post',
    data: parameter
  })
}

/**
 * 问题详情
 * @param parameter
 * @returns {*}
 */
export function getQuestionDetail(parameter) {
  return axios({
    url: '/findQuestion?id='+parameter,
    method: 'post',
    data: {},
  })
}

/**
 * 绑定问题与答案
 * @param parameter
 * @returns {*}
 */
export function boundAnswer(parameter) {
  console.log(parameter, 222)
  return axios({
    url: '/boundAnswer?questionid=' + parameter.id + '&answerid=' + parameter.answerid,
    method: 'post',
    data: {}
  })
}

// ====================================答案==============================================================

/**
 * 答案列表
 * @param parameter
 * @returns {*}
 */
export function getAnswerList(parameter) {
  return axios({
    url: '/listAnswer',
    method: 'get',
    params: parameter
  })
}

/**
 * 新增答案
 * @param parameter
 * @returns {*}
 */
export function addAnswer(parameter) {
  return axios({
    url: '/addanswer',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除答案
 * @param parameter
 * @returns {*}
 */
export function deleteAnswer(parameter) {
  return axios({
    url: '/deleteanswer?id='+parameter,
    method: 'post',
    data: {}
  })
}

/**
 * 更新答案
 * @param parameter
 * @returns {*}
 */
export function updateAnswer(parameter) {
  return axios({
    url: '/updateanswer',
    method: 'post',
    data: parameter
  })
}

/**
 * 答案详情
 * @param parameter
 * @returns {*}
 */
export function getAnswerDetail(parameter) {
  return axios({
    url: '/findanswer',
    method: 'post',
    params: parameter
  })
}

// ====================================统计==============================================================

/**
 * 问题线路统计列表
 * @param parameter
 * @returns {*}
 */
export function getAnswerRouteList(parameter) {
  return axios({
    url: '/statisticslongroad',
    method: 'get',
    params: parameter
  })
}

/**
 * 统计首次问题被问到的次数
 * @param parameter
 * @returns {*}
 */
export function getFirstQuestionAnalysis(parameter) {
  return axios({
    url: '/statisticsfirstkey',
    method: 'get',
    params: parameter
  })
}

/**
 * 统计问题被问到的次数
 * @param parameter
 * @returns {*}
 */
export function getQuestionAnalysis(parameter) {
  return axios({
    url: '/statisticsbeforekey',
    method: 'get',
    params: parameter
  })
}
