import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import AppFolder from '../views/AppFolder.vue'
// import AppNewPage from "../views/AppNewPage.vue";
import NewPage from "@/components/NewPage.vue";

Vue.use(VueRouter)

const routes = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: HomeView,
  // },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/folder/:id",
    name: "folder",
    component: AppFolder,
  },
  {
    path: "/",
    name: "newpage",
    component: NewPage,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
