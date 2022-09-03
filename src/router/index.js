import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from "@/views/HomeView"
import FolderView from "@/views/FolderView"
import LoginView from "@/views/LoginView"

Vue.use(VueRouter)

const routes = [
  {
    path: "/folder/:id",
    name: "folder",
    component: FolderView,
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { auth: true }
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === "login" && localStorage.id) next({ name: "home" })
  else if(to.name !== "login" && !localStorage.id) next({ name: "login" })
  else next()
})

export default router
