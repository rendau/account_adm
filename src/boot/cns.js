import { boot } from 'quasar/wrappers'

const cns = {
  ApiUrl: 'https://google.kz',
  AuthUrl: 'https://google.kz',

  LocaleRu: 'ru-ru',

  DefaultLocale: 'ru-ru',

  StorageTokenKey: 'auth.token',

  ErrSystem: 'system_error',
  ServiceNotAvailable: 'service_not_available',
  ErrNotAuthorized: 'not_authorized',
  PermissionDenied: 'permission_denied',
  ErrFormValidate: 'form_validate',

  authRouteName: 'auth',

  DefaultPageSize: 10,

  PermAll: 'acc:*',
  PermMApp: 'acc:m_app',
  PermMPerm: 'acc:m_perm',
  PermMRole: 'acc:m_role',
  PermMUsr: 'acc:m_usr',

  RoleCodeSuperAdmin: 'acc:super_admin',
}

cns.ApiUrl = window.API_URL || cns.ApiUrl
cns.AuthUrl = window.AUTH_URL || cns.AuthUrl

if (process.env.API_URL) {
  cns.ApiUrl = process.env.API_URL
}

if (process.env.AUTH_URL) {
  cns.AuthUrl = process.env.AUTH_URL
}

export default boot(async ({ app, store }) => {
  console.log('ApiUrl:', cns.ApiUrl)
  console.log('AuthUrl:', cns.AuthUrl)
  app.config.globalProperties.$cns = cns
  store.$cns = cns
})

export { cns }
