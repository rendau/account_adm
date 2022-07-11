import { boot } from 'quasar/wrappers'
import _ from 'lodash'
import moment from 'moment'

let _store

let util = {
  fmtDate (v) {
    if (!v) return ''
    return moment(v).format('LL')
  },
  fmtDateLite (v) {
    if (!v) return ''
    return moment(v).format('ll')
  },
  fmtDateSimple (v) {
    if (!v) return ''
    return moment(v).format('DD.MM.YYYY')
  },
  fmtDatetime (v) {
    if (!v) return ''
    return moment(v).format('LL | LT')
  },
  fmtDatetimeSimple (v) {
    if (!v) return ''
    return moment(v).format('DD MMMM LTS')
  },
  fmtDatetimeMini (v) {
    if (!v) return ''
    return moment(v).format('DD.MM.YY LT')
  },
  fmtSec2Min (v) {
    return Math.round(moment.duration(v || 0, 'seconds').as('minutes'))
  },
  fmtTime (v) {
    if (!v) return ''
    return moment(v).format('LT')
  },
  fmtPhone (v) {
    if (!v) return ''
    // return v.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')
    return v.replace(/(\d{3})(\d{3})(\d{4})/, '+7 $1 $2 $3')
  },
  fmtNum (v, ext, vIfNil) {
    if (_.isNil(v)) return vIfNil || 0
    return v.toLocaleString() + (ext || '')
  },

  verScrollBarStyle () {
    return {
      bar: {
        width: '8px',
        'border-radius': '4px',
        'background-color': '#e5e4d8',
        opacity: 1,
      },
      thumb: {
        width: '8px',
        'border-radius': '4px',
        'background-color': '#a76301',
        opacity: 1,
      },
    }
  },
}

export default boot(async ({ app, store }) => {
  app.config.globalProperties.$u = util
  store.$u = util

  _store = store
})

export { util }
