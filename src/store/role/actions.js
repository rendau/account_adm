export function list (ctx, params={}) {
  return this.$api.get('role', { params })
}

export function get (ctx, id) {
  return this.$api.get(`role/${id}`)
}

export function save (ctx, { id, data }) {
  if (!id) {
    return this.$api.post(`role`, data)
  } else {
    return this.$api.put(`role/${id}`, data)
  }
}

export function remove (ctx, id) {
  return this.$api.delete(`role/${id}`)
}
