import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import app from './app'
import dic from './dic'
import config from './config'
import profile from './profile'
import application from './application'
import perm from './perm'
import role from './role'
import user from './user'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      app,
      dic,
      config,
      profile,
      application,
      perm,
      role,
      user,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  })

  return Store
})
