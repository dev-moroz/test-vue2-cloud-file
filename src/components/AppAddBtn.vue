<template>
  <div>
    <v-layout row v-if="showAddMenu" class="newFolder">
      <v-flex md6 offset-sm3 v-if="folder">
        <v-text-field v-model="nameFolder" label="new folder"></v-text-field>
        <v-btn @click="addNewFolderThis(getCurrentUser, nameFolder)"
          >addNewFolder</v-btn
        >
      </v-flex>
      <v-flex>
        <h2>add only file</h2>

        <div>
          <v-file-input
            @change="previewImage()"
            accept="image/*"
            counter
            multiple
            show-size
            v-model="fileNewWithInput"
          ></v-file-input>
          <v-btn elevation="2" @click="create(post)">upload</v-btn>
        </div>
      </v-flex>
    </v-layout>
    <button class="newFolderBtn" @click="showAddMenu = !showAddMenu">+</button>
    <!-- fileUrl - {{ getFileUrl }} -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { addNewFolder } from "@/firebase";

export default {
  props: {
    folder: Boolean,
  },
  methods: {
    ...mapActions(["onUpload", "create"]),
    addNewFolderThis(currentUser, name) {
      addNewFolder(currentUser, name);
    },
    previewImage() {
      this.uploadValue = 0;
      this.img1 = null;
      this.imageData = this.fileNewWithInput[0];
      this.nameFile = this.imageData.name.split(".")[0];

      this.onUpload({name: this.nameFile, data: this.imageData});
      console.log("imageData: ", this.imageData);
    },
  },
  computed: {
    ...mapGetters(["getCurrentUser", "getFileUrl"]),
    post() {
      return {
        photo: this.getFileUrl,
        caption: this.nameFile,
        //   size: this.size,
      };
    },
  },
  data() {
    return {
      showAddMenu: false,
      nameFolder: "",
      fileNewWithInput: null,
      uploadValue: "",
      img1: "",
      imageData: "",
      nameFile: "",
      ppoo: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.newFolderBtn {
  position: absolute;
  bottom: 30px;
  right: 30px;
  padding: 15px 23px;
  border-radius: 50%;
  background-color: aquamarine;
}
.newFolder {
  position: absolute;
  border-radius: 10px;
  bottom: 30px;
  right: 90px;
  width: 700px;
  background-color: azure;
}
</style>