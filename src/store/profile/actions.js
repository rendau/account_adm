import { cns } from 'boot/cns'
import { authTokenAccess } from 'src/store/profile/getters'

let ctxLoadSinceAppStartPr = null

export function refresh ({ state, dispatch }, nr401 = false) {
  console.log('start refresh-profile')
  return this.$api.get('profile', { nr401 }).then(resp => {
    return dispatch('set', resp.data).then(() => resp)
  })
}

export function refreshSinceAppStart ({ dispatch }) {
  if (!ctxLoadSinceAppStartPr) {
    console.log('start refresh-profile since app-start')
    ctxLoadSinceAppStartPr = dispatch('refresh', true).catch(err => {
      if (err.data?.code === cns.ErrNotAuthorized) {
        return Promise.resolve(null)
      } else {
        // console.error(err)
        return Promise.reject(err)
      }
    })
  }

  return ctxLoadSinceAppStartPr
}

export function resetCtxLoadSinceAppStartPr () {
  ctxLoadSinceAppStartPr = null
}

export function logout ({ dispatch, getters }) {
  let pr
  if (getters['authTokenAccess']) {
    pr = this.$api.post('profile/logout', null, {
      nr401: true,
      nfa: true,
      nl: true,
    }).catch(() => {})
  } else {
    pr = Promise.resolve()
  }
  return pr.then(() => dispatch('set', null))
}

export function refreshAccessToken ({ getters, commit }) {
  console.log('refreshing access token')
  return this.$api.post('profile/auth/token', {
    refresh_token: getters['authTokenRefresh'],
  }, { nfa: true }).then(resp => {
    let aToken = resp.data?.access_token || ''
    commit('setTokenAccess', aToken)
    return aToken
  })
}

export function set (ctx, value) {
  if (!value) {
    ctx.commit('setToken', { access: '', refresh: '' })
  }

  let loggedIn = !ctx.state.ctx && !!value

  ctx.commit('setCtx', value)

  if (loggedIn) {
    return ctx.dispatch('afterLogin')
  }
}

export function afterLogin (ctx) {
  return ctx.dispatch('dic/getDic', null, { root: true })
}
