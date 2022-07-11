const routes = [
  {
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
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
    meta: {
      requiresAuth: true,
    },
    children: [
      { path: '', component: () => import('pages/Index.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    redirect: '/',
  },
]

export default routes
