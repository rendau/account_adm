export function list (ctx, params={}) {
  return this.$api.get('app', { params })
}

export function get (ctx, id) {
  return this.$api.get(`app/${id}`)
}

export function save (ctx, { id, data }) {
  if (!id) {
    return this.$api.post(`app`, data)
  } else {
    return this.$api.put(`app/${id}`, data)
  }
}

export function remove (ctx, id) {
  return this.$api.delete(`app/${id}`)
}
