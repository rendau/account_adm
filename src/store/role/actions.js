export function list (ctx, params = {}) {
  return this.$api.get('role', { params })
}

export function get (ctx, id) {
  return this.$api.get(`role/${id}`)
}

export function save (ctx, { id, data }) {
  let pr
  if (!id) {
    pr = this.$api.post(`role`, data)
  } else {
    pr = this.$api.put(`role/${id}`, data)
  }
  return pr.then(resp => ctx.dispatch('dic/getDic', null, { root: true }).then(() => resp))
}

export function remove (ctx, id) {
  return this.$api.delete(`role/${id}`).then(resp => ctx.dispatch('dic/getDic', null, { root: true }).then(() => resp))
}
