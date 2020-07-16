import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'mdi-home'
  },
  {
    path: '/model',
    name: 'Build Model',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Model.vue'),
    icon: 'model_training'
  },
    {
      path: '/rocklibrary',
      name: 'Rock Library',
      component: () => import(/* webpackChunkName: "about" */ '../views/RockLibrary.vue'),
      icon: 'public'
    }
]

const router = new VueRouter({
  routes
})

export default router
