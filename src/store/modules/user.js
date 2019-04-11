import Vue from 'vue'
import { login } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { router } from '@/api/router'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.retCode === '200') {
            const result = response.retData
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_NAME', { name: result.username, welcome: welcome() })
            resolve()
          } else {
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        const result = {
          role: {
            createTime: 1497160610259,
            creatorId: 'system',
            deleted: 0,
            describe: '拥有所有权限',
            id: 'admin',
            name: '管理员',
            permissions: router
          },
          roleId: 'admin',
        }

        if (result.role && result.role.permissions.length > 0) {
          const role = result.role
          role.permissions = result.role.permissions
          role.permissions.map(per => {
            if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
              const action = per.actionEntitySet.map(action => {
                return action.action
              })
              per.actionList = action
            }
          })
          role.permissionList = role.permissions.map(permission => {
            return permission.permissionId
          })
          commit('SET_ROLES', result.role)
          commit('SET_INFO', result)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }

        commit('SET_AVATAR', result.avatar ? result.avatar : 'https://pro.loacg.com/avatar2.jpg')

        resolve(result)
      })
    },

    // 登出
    Logout({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        resolve()
      })
    },

  }
}

export default user