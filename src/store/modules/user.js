import { login, logout, getInfo } from '@/api/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    address: '',
    age: '',
    sex: '',
    userId: '',
    username: '',
    email: '',
    createtime: '',
    phoneNumber: '',
    isEmployee: '',
    role: [],
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },

  SET_ADDRESS: (state, address) => {
    state.address = address
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  },
  SET_AGE: (state, age) => {
    state.age = age
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_CREATETIME: (state, createtime) => {
    state.createtime = createtime
  },
  SET_PHONENUMBER: (state, phoneNumber) => {
    state.phoneNumber = phoneNumber
  },
  SET_ISEMPLOYEE: (state, isEmployee) => {
    state.isEmployee = isEmployee
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response

        commit('SET_TOKEN', data.token)
        console.log('token为')
        console.log(data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          // console.log('Verification failed, please Login again')
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, address, age, sex, phoneNumber, userid, username, createtime, email, role, permissions, isEmployee } = data
        if (!permissions || permissions.length <= 0) {
          reject('getInfo:permissions must be a non-null array!')
        }
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ADDRESS', address)
        commit('SET_AGE', age)
        commit('SET_SEX', sex)
        commit('SET_PHONENUMBER', phoneNumber)
        commit('SET_USERID', userid)
        commit('SET_USERNAME', username)
        commit('SET_CREATETIME', createtime)
        commit('SET_EMAIL', email)
        commit('SET_ISEMPLOYEE', isEmployee)
        commit('SET_ROLE', role)

        commit('SET_PERMISSIONS', permissions)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('SET_PERMISSIONS', [])
        commit('SET_ROLE', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

