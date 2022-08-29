import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
// import firebase from "firebase";

// import { collection, doc, getDoc } from "firebase/firestore";
import { collection, doc, setDoc, db } from "firebase/firestore"; 



import { ref, onUnmounted, computed } from "vue";

import { getDatabase, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDBW8ohHEoNghcNLEpEI0FrXAlAKg_vZBU",
  authDomain: "vue-chat-app-58d15.firebaseapp.com",
  projectId: "vue-chat-app-58d15",
  storageBucket: "vue-chat-app-58d15.appspot.com",
  messagingSenderId: "629935957995",
  appId: "1:629935957995:web:1b75a0c7e95460ea531bae",
};
firebase.initializeApp(firebaseConfig);



const auth = firebase.auth()

export function useAuth() {
  const user = ref(null)
  const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
  onUnmounted(unsubscribe)
  const isLogin = computed(() => user.value !== null)

  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(googleProvider)
  }
  const signOut = () => auth.signOut()

  return { user, isLogin, signIn, signOut }
}

export function addFile() {
      console.log("addFile: start");
      const db = getDatabase();
      const post = {
        photo: 'this.img1',
        caption: 'this.caption',
      };
      // set(ref(db, `lolkek/${this.user.uid}`), post);
      set(ref(db, "messages"), post);
      console.log("addFile: finish");
}

export function echo(text){
  console.log('text:', text)
}
export async function firestoreNew(){

  const firestore = firebase.firestore();
  // const messagesCollection = firestore.collection("messages");
  // const messagesDb = collection(db, "messages");
  // // const docRef = doc(db, "messages", "SF");

  // const doc = await getDoc(messagesDb)
  // console.log("Document data:", doc);

  const citiesRef = collection(db, "cities");
  console.log(firestore);

  await setDoc(doc(citiesRef, "SF"), {
    name: "San Francisco",
    state: "CA",
    country: "USA",
    capital: false,
    population: 860000,
    regions: ["west_coast", "norcal"],
  });
}
export function addNewFolder(currentUser, name) {
  firebase
    .database()
    .ref(`${currentUser}/${name}`)
    .push({ name: `${name}` })
    .then(response => {
      console.log(response);
    });
}
export function onUpload(name, data) {

      const storageRef = firebase
        .storage()
        .ref(`${name}`)
        .put(data);
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
            console.log('url:', url);
          });
        }
      ) 
}


// const firestore = firebase.firestore()
// const photoGalleryCollection = firestore.collection("PhotoGallery");