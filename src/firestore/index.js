import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDBW8ohHEoNghcNLEpEI0FrXAlAKg_vZBU",
  authDomain: "vue-chat-app-58d15.firebaseapp.com",
  databaseURL: "https://vue-chat-app-58d15-default-rtdb.firebaseio.com",
  projectId: "vue-chat-app-58d15",
  storageBucket: "vue-chat-app-58d15.appspot.com",
  messagingSenderId: "629935957995",
  appId: "1:629935957995:web:1b75a0c7e95460ea531bae",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}