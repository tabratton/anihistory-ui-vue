import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('./views/Home')

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'Home' }
    },
    {
      path: '/user/:username',
      name: 'user-page',
      meta: { title: 'User - ' },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "user" */ './views/UserPage.vue')
    }/*,*/
    // {
    //   path: '/:pathMatch(.*)',
    //   component: NotFoundComponent
    // }
  ]
})

router.afterEach(to => {
  document.title = `${to.meta.title}${to.params.username ? to.params.username : ''}` || 'AniHistory'
})

export default router
