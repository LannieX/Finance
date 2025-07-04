import { createRouter, createWebHistory } from 'vue-router'
import Finance from '../views/Finance.vue'
import ManageCar from '../views/ManageCar.vue'
import Login from '../views/Login.vue'
import ManaegRole from '../views/ManageRole.vue'

const routes = [
  { path: '/', redirect: '/Finance' },
  { path: '/Finance', component: Finance },
  { path: '/ManageCar', component: ManageCar },
  { path: '//ManageRole', component: ManaegRole },
  { path: '/Login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/Login']
  const authRequired = !publicPages.includes(to.path)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (authRequired && !user) {
    return next('/Login')
  }

  next()
})

export default router
