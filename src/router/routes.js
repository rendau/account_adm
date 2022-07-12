function formatRoutes (routes, idPrefix, lvl) {
  if (!routes || !routes.length) return
  let i, r
  for (i = 0; i < routes.length; i++) {
    r = routes[i]
    r.props = r.props || {}
    r.props.rid = idPrefix + (idPrefix && '_') + (i + 1)
    r.props.zi = 2500 + lvl
    r.meta = r.meta || {}
    r.meta.rid = r.props.rid
    formatRoutes(r.children, r.props.rid, lvl + 1)
  }
}

const routes = [
  {
    path: '/auth',
    component: () => import('layouts/EmptyLayout.vue'),
    meta: {
      restrictAuth: true,
    },
    children: [
      { path: '', name: 'auth', component: () => import('pages/Auth.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    redirect: { name: 'users' },
    children: [
      {
        path: 'users',
        name: 'users',
        component: () => import('pages/Users.vue'),
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('pages/Roles.vue'),
      },
      {
        path: 'perms',
        name: 'perms',
        component: () => import('pages/Perms.vue'),
        children: [
          {
            path: 'ce/:perm_id?',
            name: 'perms-perm_ce',
            component: () => import('pages/PermCE.vue'),
          }
        ],
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    redirect: '/',
  },
]

formatRoutes(routes, '', 1)

export default routes