<template>
  <div>
    <!-- <p>{{ $store.state.count }}</p> -->
    <v-layout row>
      <v-flex class="text-center font-weight-black">
        <h1>Cloud file</h1>
      </v-flex>
    </v-layout>

    <!-- <v-layout row>
      <v-flex md6 offset-sm3>
        <div>
          <v-file-input
            @change="previewImage()"
            accept="image/*"
            counter
            multiple
            show-size
            v-model="fileNewWithInput"
          ></v-file-input>
        </div>
      </v-flex>
    </v-layout> -->

    <!-- <v-layout row>
      <v-flex md6 offset-sm3 class="text-center">
        <input solo v-model="caption" label="Caption goes here" />
      </v-flex>
    </v-layout> -->
    <!-- <v-layout row>
      <v-flex class="text-center">
        <v-btn elevation="2" @click="create" :disabled="!fileNewWithInput"
          >upload</v-btn
        >
      </v-flex>
    </v-layout> -->

    <temaplate v-if="fbData.length">
      <br />
      <hr />
      <br />

      <v-layout row>
        <v-flex v-for="(v, i) in fbData[0]" :key="i">
          <template v-if="v.photo">
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              :src="v.photo"
              transition="scale-transition"
              width="100"
            />
          </template>
          <template v-else>
            <router-link :to="folderPage(i)"> {{ i }} </router-link>
          </template>
        </v-flex>
      </v-layout>
    </temaplate>
    <!-- btn add folder -->
    <AppAddBtnVue :folder="true" />
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/storage";
// import { mapGetters } from "vuex";
import AppAddBtnVue from "@/components/AppAddBtn.vue";

export default {
  data() {
    return {
      caption: "",
      img1: "",
      imageData: null,
      fileNewWithInput: null,
      size: "",
      fbData: null,
    };
  },
  components: {
    AppAddBtnVue,
  },
  mounted() {
    this.getDatesFB();
  },
  methods: {
    folderPage(url) {
      return `/folder/${url}`;
    },

    async getDataFromFB() {
      const post = {
        photo: this.img1,
        caption: this.caption,
        size: this.size,
      };

      const res = await firebase
        .firestore()
        .collection("currentUser")
        .add(post);
      console.log("res", res);
    },
    // create() {
    //   const post = {
    //     photo: this.img1,
    //     caption: this.caption,
    //     size: this.size,
    //   };
    //   firebase
    //     .database()
    //     .ref("currentUser")
    //     .push(post)
    //     .then(response => {
    //       console.log(response);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // previewImage() {
    //   this.uploadValue = 0;
    //   this.img1 = null;
    //   this.imageData = this.fileNewWithInput[0];
    //   this.onUpload();

    //   // console.log("previewImage", this.fileNewWithInput[0].data);
    // },
    // onUpload() {
    //   this.img1 = null;
    //   const storageRef = firebase
    //     .storage()
    //     .ref(`${this.imageData.name}`)
    //     .put(this.imageData);
    //   storageRef.on(
    //     `state_changed`,
    //     snapshot => {
    //       this.uploadValue =
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     },
    //     error => {
    //       console.log(error.message);
    //     },

    //     () => {
    //       this.uploadValue = 100;
    //       storageRef.snapshot.ref.getDownloadURL().then(url => {
    //         this.img1 = url;
    //         console.log(this.img1);
    //       });
    //       storageRef.snapshot.ref.getMetadata().then(meta => {
    //         this.size = meta.size;
    //         console.log("meta:", this.size);
    //       });
    //     }
    //   );
    // },
    getDatesFB() {
      // firebase
      //   .firestore()
      //   .collection("currentUser")
      //   .onSnapshot(querySnapshot => {
      //     var cities = [];
      //     querySnapshot.forEach(doc => {
      //       // cities.push(doc.data());
      //       cities.push(doc.data());
      //     });
      //     //  console.log('Current cities in CA: ', cities.join(', '))
      //     console.log("Current cities in CA: ", cities);
      //     this.fbData = cities;
      //   });

      // var starCountRef = firebase
      //   .database()
      //   .ref("PhotoGallery");
      // starCountRef.on("value", snapshot => {
      //   const data = snapshot.val();
      //   updateStarCount(postElement, data);
      // });

      const dbRef = firebase.database().ref();
      dbRef
        //   .child("PhotoGallery")
        .child("currentUser")
        .get()
        .then(snapshot => {
          var cities = [];
          if (snapshot.exists()) {
            console.log(snapshot.val());
            cities.push(snapshot.val());
          } else {
            console.log("No data available");
          }
          this.fbData = cities;
        })
        .catch(error => {
          console.error(error);
        });
    },
    convertSize(size) {
      return `${Math.round(size / 1024)}kb`;
    },
  },
  computed: {
    // ...mapGetters(["getCurrentUser"]),
  },
};
</script>

<style scoped>
.constainer-form {
  background-color: antiquewhite;
  width: 90%;
  margin: 0 auto;
}
</style>