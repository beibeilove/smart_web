import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: ''
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return axios({
    url: '/login',
    method: 'post',
    data: parameter
  })
}

/*export function getInfo() {
  return axios({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}*/

// export function logout() {
//   return axios({
//     url: '/logout',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }