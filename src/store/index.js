import Vue from "vue";
import Vuex from "vuex";

import firebase from "firebase";
import "firebase/storage"; 
import "firebase/firestore";

// import { getDatabase, ref, set } from "firebase/database";



// import { getStorage, ref, getMetadata } from "firebase/storage";
// import { getStorage, ref, list } from "firebase/storage";



// import { getDatabase, ref, child, get } from "firebase/database"
// import { getDatabase, ref, child, get } from "firebase/database";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: "000",
    tasks: null,
    currentUser: "currentUser",
    fileUrl: "",
  },
  getters: {
    tasks: s => s.tasks,
    getCurrentUser: s => s.currentUser,
    getFileUrl: s => s.fileUrl,
  },
  mutations: {
    setTasks(state, task) {
      state.tasks = task;
    },
    setUrl(state, url) {
      state.fileUrl = url;
    },
    clearUrl(state) {
      state.fileUrl = "";
    },
  },
  actions: {
    getTasks({ commit }) {
      // console.log('lolkek')
      // const dbRef = ref(getDatabase());
      // get(child(dbRef, "PhotoGallery"))
      //   .then(res => {
      //     if (res.exists()) {
      //       const obj = res.val();
      //       const array = Object.keys(obj).map(key => obj[key]);
      //       commit("setTasks", array);
      //     }
      //     commit("changeLoad");
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   });
      var database = firebase.database();

      var leadsRef = database.ref("PhotoGallery/Ryd12w8o5ceZLjHAB35Ld4RSIff1");
      var arrFile = [];
      leadsRef.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          arrFile.push(childData);
        });
        commit("setTasks", arrFile);
      });
    },

    onUpload({ commit }, { name, data }) {
      const storageRef = firebase.storage().ref(`${name}`).put(data);

      storageRef.on(
        `state_changed`,
        snapshot => {
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          console.log(error.message);
        },

        () => {
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            console.log("url:", url);
            commit("setUrl", url);
          });
        }
      );
    },

    create({ commit }, post) {
      firebase
        .database()
        .ref("currentUser")
        .push(post)
        .then(response => {
          commit("clearUrl");
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  modules: {},
});
