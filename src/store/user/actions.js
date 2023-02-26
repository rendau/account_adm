export function list (ctx, params = {}) {
  return this.$api.get('usr', { params })
}

export function get (ctx, id) {
  return this.$api.get(`usr/${id}`)
}

export function getNewAccessToken (ctx, id) {
  return this.$api.get(`usr/${id}/new_access_token`)
}

export function getNewRefreshToken (ctx, id) {
  return this.$api.get(`usr/${id}/new_refresh_token`)
}

export function save (ctx, { id, data }) {
  if (!id) {
    return this.$api.post(`usr`, data)
  } else {
    return this.$api.put(`usr/${id}`, data)
  }
}

export function remove (ctx, id) {
  return this.$api.delete(`usr/${id}`)
}
