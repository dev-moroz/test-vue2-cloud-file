<template>
  <v-container>
    <v-layout row>
      <v-flex class="text-center font-weight-black">
        <h1>Upload a photo</h1>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-sm3>
        <!-- <v-btn color="pink" @click="newEcho()">loool</v-btn> -->
        <v-btn color="pink" @click="newFirebaseFunc()">newFirebaseFunc</v-btn>
        <div>
          <div>
            <v-btn @click="click1" v-if="imageData == null">choose photo</v-btn>
            <template v-else>
              <img class="preview" height="268" width="auto" :src="img1" />
              <!-- <v-btn color="pink" @click="addFileNew()">Send</v-btn> -->
              <!-- size: {{ size }} -->
            </template>
            <input
              type="file"
              ref="input1"
              style="display: none"
              @change="previewImage"
              accept="image/*"
            />
          </div>
        </div>
      </v-flex>
    </v-layout>
    <!-- <p>{{ $store.state.count }}</p> -->
    <button @click="pageTokenExample()">pageTokenExample</button>
  </v-container>
</template>

<script>
import { useAuth, addFile, echo, firestoreNew } from "@/firebase";

// import { getStorage, ref, list } from "firebase/storage";
// import { mapActions } from "vuex";
export default {
  setup() {
    const { user } = useAuth();
    // const addFile = addFile();
    return { user };
  },
  comments: {
    AppAddBtnVue,
  },
  data() {
    return {
      caption: "",
      img1: "",
      imageData: null,
    };
  },
  methods: {
    addFileNew() {
      addFile();
    },
    newEcho() {
      echo("pop");
    },
    newfirestoreNew() {
      firestoreNew();
    },

    create() {
      const post = {
        photo: this.img1,
        caption: this.caption,
      };
      firebase
        .database()
        .ref(`PhotoGallery/${this.user.uid}`)
        .push(post)
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    click1() {
      this.$refs.input1.click();
    },
    previewImage(event) {
      this.uploadValue = 0;
      this.img1 = null;
      this.imageData = event.target.files[0];
      this.onUpload();
    },
    onUpload() {
      this.img1 = null;
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        snapshot => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            this.img1 = url;
            console.log(this.img1);
          });
        }
      );
    },
    async newFirebaseFunc() {
      var adaRef = await firebase.database().ref(`messages`);
      // var lol = await JSON.parse(adaRef)
      console.log("adaRef:", adaRef.database);
    },
  },
  computed: {
    //  ...mapGetters(["getMsg"]),
    // size() {
    //   return this.img1.size();
    // },
  },
  // mounted() {
  //   addFile();
  // },
};
</script>