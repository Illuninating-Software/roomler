import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const actions = {
  async push ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put(`/api/room/moderators/push/${payload.room}`, payload)
      if (response.result.room && response.result.users) {
        response.result.users.forEach((user) => {
          commit('api/auth/push', user, {
            root: true
          })
        })
        commit('api/room/push', response.result.room, {
          root: true
        })
        commit('api/message/initMessages', response.result.room.path, {
          root: true
        })
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async pull ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put(`/api/room/moderators/pull/${payload.room}`, payload)
      if (response.result.room && response.result.users) {
        response.result.users.forEach((user) => {
          commit('api/auth/push', user, {
            root: true
          })
        })
        commit('api/room/push', response.result.room, {
          root: true
        })
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async switch ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put(`/api/room/moderators/switch/${payload.room}`, payload)
      if (response.result.room && response.result.users) {
        response.result.users.forEach((user) => {
          commit('api/auth/push', user, {
            root: true
          })
        })
        commit('api/room/push', response.result.room, {
          root: true
        })
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
