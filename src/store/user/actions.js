export function list (ctx, params = {}) {
  return this.$api.get('usr', { params })
}

export function get (ctx, id) {
  return this.$api.get(`usr/${id}`)
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
