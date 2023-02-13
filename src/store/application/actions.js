export function list (ctx, params={}) {
  return this.$api.get('app', { params })
}

export function get (ctx, id) {
  return this.$api.get(`app/${id}`)
}

export function save (ctx, { id, data }) {
  let pr
  if (!id) {
    pr = this.$api.post(`app`, data)
  } else {
    pr = this.$api.put(`app/${id}`, data)
  }
  return pr.then(resp => ctx.dispatch('dic/getDic', null, { root: true }).then(() => resp))
}

export function remove (ctx, id) {
  return this.$api.delete(`app/${id}`).then(resp => ctx.dispatch('dic/getDic', null, { root: true }).then(() => resp))
}
