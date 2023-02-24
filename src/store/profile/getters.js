import _ from 'lodash'
import { cns } from 'boot/cns'

export function authTokenAccess (state) {
  return state.token.access
}

export function authTokenRefresh (state) {
  return state.token.refresh
}

export function isAuthed (state, getters) {
  return !!state.ctx
}

export function permCodes (state, getters) {
  return state.ctx?.perm_codes || []
}

export function isSAdmin (state, getters) {
  return !!_.find(getters.permCodes, code => code === cns.PermAll)
}

export function hasPerm (state, getters) {
  if (getters.isSAdmin) return () => true
  return permCode => !!_.find(getters.permCodes, code => code === permCode)
}

export function hasPerms (state, getters) {
  if (getters.isSAdmin) return () => true
  return permCodes => _.intersection(getters.permCodes, permCodes).length > 0
}

export function id (state) {
  return (state.ctx || {}).id || 0
}
