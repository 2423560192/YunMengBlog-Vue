const state = {
  token: localStorage.getItem('access_token') || '',
  userInfo: JSON.parse(localStorage.getItem('user') || '{}')
}

const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
    localStorage.setItem('access_token', token)
  },
  SET_USER_INFO (state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('user', JSON.stringify(userInfo))
  },
  CLEAR_AUTH (state) {
    state.token = ''
    state.userInfo = {}
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }
}

const actions = {
  login ({ commit }, { token, user }) {
    commit('SET_TOKEN', token)
    commit('SET_USER_INFO', {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar
    })
  },
  logout ({ commit }) {
    commit('CLEAR_AUTH')
  }
}

const getters = {
  isLoggedIn: state => !!state.token,
  userInfo: state => state.userInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
