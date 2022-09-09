import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import firebase from "firebase/app"

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyDBW8ohHEoNghcNLEpEI0FrXAlAKg_vZBU",
  authDomain: "vue-chat-app-58d15.firebaseapp.com",
  databaseURL: "https://vue-chat-app-58d15-default-rtdb.firebaseio.com",
  projectId: "vue-chat-app-58d15",
  storageBucket: "vue-chat-app-58d15.appspot.com",
  messagingSenderId: "629935957995",
  appId: "1:629935957995:web:1b75a0c7e95460ea531bae",
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app")
