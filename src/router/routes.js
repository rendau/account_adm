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
      { path: 'users', name: 'users', component: () => import('pages/Users.vue') },
      { path: 'roles', name: 'roles', component: () => import('pages/Roles.vue') },
      { path: 'perms', name: 'perms', component: () => import('pages/Perms.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    redirect: '/',
  },
]

export default routes
