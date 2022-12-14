import Vue from "vue"
import Vuex from "vuex"

import firebase from "firebase"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: localStorage.id,
    fileUrl: "",
    fbData: "",
    filteredFbData: "",
    loading: true,
    testGoogleId: "",
  },
  getters: {
    testGoogleId: s => s.testGoogleId,
    getCurrentUser: s => s.currentUser,
    getFileUrl: s => s.fileUrl,
    getFbData: s => s.filteredFbData ? s.filteredFbData : s.fbData,
    getFilteredFbData: s => s.filteredFbData,
    getSizeData: s =>
      s.fbData.reduce((arr, item) => {
        if (item.size) {
          arr += item.size
        }
        return arr
      }, 0),
    loading: s => s.loading,
    getExtension: s =>
      s.fbData.reduce((arr, item) => {
        if (item.extension) {
          arr.push(item.extension)
        }
        return [...new Set(arr)]
      }, []),
  },
  mutations: {
    setUrl(state, url) {
      state.fileUrl = url
    },
    clearUrl(state) {
      state.fileUrl = ""
    },
    setDataFromFB(state, data) {
      state.fbData = Object.keys(data).map(key => data[key])
      state.loading = false
    },
    loading(state) {
      state.loading = true
    },
    setAuth(state, userId) {
      if (userId) {
        localStorage.id = userId
        state.currentUser = localStorage.id
      } else {
        localStorage.id = ""
        state.currentUser = localStorage.id
      }
    },
    setSortFbData(state, ex) {
      ex === 'all'
      ? state.filteredFbData = state.fbData
      : state.filteredFbData = state.fbData.filter(
          item => item.extension === ex
        )
    },
  },
  actions: {
    onUpload({ commit }, { name, data }) {
      const storageRef = firebase.storage().ref(`${name}`).put(data)

      storageRef.on(
        `state_changed`,
        snapshot => {
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        error => {
          console.log(error.message)
        },

        () => {
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            commit("setUrl", url)
          })
        }
      )
    },

    addFile({ dispatch, commit, state }, { post, path, foldersize }) {
      firebase
        .database()
        .ref(`${state.currentUser}/${path}/${post.id}`)
        .set({ ...post, url: state.fileUrl })
        .then(() => {
          commit("clearUrl")
          dispatch("getData", path)
        })
        .catch(err => {
          console.log(err)
        })

      if (path != "") {
        firebase
          .database()
          .ref(`${state.currentUser}/${path}`)
          .update({ size: post.size + foldersize })
          .then(() => {
            commit("clearUrl")
            dispatch("getData", path)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    addFolder({ dispatch, commit, state }, { name }) {
      firebase
        .database()
        .ref(`${state.currentUser}/${name}`)
        .set({ name: name, size: 0, folder: name })
        .then(() => {
          commit("clearUrl")
          dispatch("getData", "")
        })
    },

    getData({ commit, state }, path) {
      commit("setDataFromFB", [])
      commit("loading")
      firebase
        .database()
        .ref()
        .child(`${state.currentUser}/${path}`)
        .get()
        .then(snapshot => {
          if (snapshot.exists()) {
            commit("setDataFromFB", snapshot.val())
          } else {
            console.log("No data available")
            commit("setDataFromFB", [])
          }
        })
        .catch(error => {
          console.error(error)
        })
    },

    removeFile({ dispatch, state }, { name, path }) {
      firebase
        .database()
        .ref(`${state.currentUser}/${path}${name}`)
        .remove()
        .then(() => {
          dispatch("getData", path)
        })
        .catch(err => {
          console.log(err)
        })
    },

    updateFile({ dispatch, state }, { path, newName, fileId }) {
      firebase
        .database()
        .ref(`${state.currentUser}/${path}${fileId}`)
        .update({ name: `${newName}` })
        .then(() => {
          dispatch("getData", path)
        })
        .catch(err => {
          console.log(err)
        })
    },

    authGoogle({ dispatch, commit }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(res => {
          /** @type {firebase.auth.OAuthCredential} */
          commit("setAuth", res.user.uid)
          dispatch("getData", {})
        })
        .catch(error => {
          console.log(error)
        })
    },

    logoutGoogle({ dispatch, commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("setAuth")
          commit("setDataFromFB", [])
          dispatch("getData", {})
        })
        .catch(error => {
          console.log(error)
        })
    },

    registerGoogle({ dispatch, commit }, { email, password }) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          console.log("user: ", res.user.uid)
          commit("setAuth", res.user.uid)
          dispatch("getData", { path: "/" })
        })
        .catch(e => {
          console.log(e)
          commit("clearUrl")
        })
    },

    loginGoogle({ dispatch, commit }, { email, password }) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          console.log("user: ", res.user.uid)
          commit("setAuth", res.user.uid)
          dispatch("getData", {})
        })
        .catch(e => {
          console.log(e.message)
          commit("clearUrl")
        })
    },

    sortFbData({ commit }, ex) {
      commit("setSortFbData", ex)
    },
  },
})