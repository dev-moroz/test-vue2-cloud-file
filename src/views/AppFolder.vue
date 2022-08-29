<template>
  <div>
    <h1>folder</h1>
    <router-link to="/">back</router-link>

    <v-layout row>
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
    </v-layout>

    <v-layout row>
      <v-flex class="text-center">
        <v-btn elevation="2" @click="create">upload</v-btn>
      </v-flex>
    </v-layout>

    <!-- <template v-if="fbData.length"> -->
      <!-- <br />
      <hr />
      <br /> -->

      <v-layout row>
        <v-flex md6 offset-sm3>
          <div v-for="(item, i) in fbData[0]" :key="i">
            <v-img
              class="shrink mb-2"
              contain
              :src="item.photo"
              transition="scale-transition"
              width="100"
            />
            <p>{{ item.size }}b</p>
          </div>
        </v-flex>
      </v-layout>
    <!-- </template> -->
    <AppAddBtnVue />
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/storage";
import AppAddBtnVue from "@/components/AppAddBtn.vue";
export default {
  data() {
    return {
      fbData: "",
      caption: "",
      img1: "",
      imageData: null,
      fileNewWithInput: null,
      size: "",
    };
  },
  components: {
    AppAddBtnVue,
  },
  computed: {
    getPath() {
      return this.$route.path.split("/")[2];
    },
  },
  mounted() {
    this.getDatesFB();
  },
  methods: {
    getDatesFB() {
      const dbRef = firebase.database().ref();
      dbRef
        .child(`currentUser/${this.getPath}`)
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

    create() {
      const post = {
        photo: this.img1,
        caption: this.caption,
        size: this.size,
      };
      firebase
        .database()
        .ref(`currentUser/${this.getPath}`)
        .push(post)
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    previewImage() {
      this.uploadValue = 0;
      this.img1 = null;
      // this.imageData = event.target.files[0];
      this.imageData = this.fileNewWithInput[0];
      this.onUpload();

      // console.log("previewImage", this.fileNewWithInput[0].data);
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
          storageRef.snapshot.ref.getMetadata().then(meta => {
            this.size = meta.size;
            console.log("meta:", this.size);
          });
        }
      );
    },
  },
};
</script>