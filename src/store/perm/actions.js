export function list (ctx, params={}) {
  return this.$api.get('perm', { params })
}

export function get (ctx, id) {
  return this.$api.get(`perm/${id}`)
}

export function save (ctx, { id, data }) {
  if (!id) {
    return this.$api.post(`perm`, data)
  } else {
    return this.$api.put(`perm/${id}`, data)
  }
}

export function remove (ctx, id) {
  return this.$api.delete(`perm/${id}`)
}
