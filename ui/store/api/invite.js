import {
  storage
} from '@/services/storage'
import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  invites: [],
  pendingInvites: []
})

export const mutations = {
  storePendingInvites (state, invite) {
    const result = []
    if (invite) {
      result.push(invite)
    }

    // Merge with Cookie Pending Invites
    let invites = storage.get('pendingInvites')
    if (invites) {
      invites = JSON.parse(invites)
      invites.forEach((i) => {
        if (!result.includes(i)) {
          result.push(i)
        }
      })
    }
    // Merge with State Pending Invites
    state.pendingInvites.forEach((i) => {
      if (!result.includes(i)) {
        result.push(i)
      }
    })
    state.pendingInvites = result
    storage.set('pendingInvites', JSON.stringify(state.pendingInvites), true)
  },
  clearPendingInvites (state) {
    state.pendingInvites = []
    storage.set('pendingInvites', state.pendingInvites, true)
  },

  setInvites (state, invites) {
    state.invites = invites
  },
  push (state, invites) {
    invites.forEach((invite) => {
      state.invites.push(invite)
    })
  },
  pull (state, invite) {
    state.invites = state.invites.filter(r => r._id !== invite._id)
  }
}

export const actions = {
  async create ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/invite/create', payload)
      commit('push', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },
  async get ({
    commit,
    state
  }, id) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/invite/get?id=${id}`)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async getAll ({
    commit,
    state
  }, roomid) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/invite/get-all?room=${roomid}`)
      commit('setInvites', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async acceptPendingInvites ({
    commit,
    state
  }) {
    const self = this
    const response = {}
    try {
      commit('storePendingInvites') // Merge Cookie with Store
      if (state.pendingInvites.length) {
        await Promise.all(state.pendingInvites.map(invite => self.$axios.$put(`/api/invite/accept/${invite}`)))
        commit('clearPendingInvites')
      }
    } catch (err) {
      handleError(err, commit)
    }
    return response
  }
}