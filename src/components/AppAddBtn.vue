<template>
  <div>
    <v-layout row v-if="opened" class="newFolder" v-click-outside="changeVisible">
      <v-flex>
        <div>
          <v-btn v-if="folder" block color="cyan" dark @click="showOverlayFolder">
            folder</v-btn>
        </div>
        <div>
          <v-btn block color="cyan" dark @click="showOverlayFile">file</v-btn>
        </div>
      </v-flex>
    </v-layout>

    <v-overlay :value="visibleFolder">
      <v-card elevation="5" class="mx-auto" mix-width="600">
        <v-flex v-click-outside="hideOverlayFolder" class="addCard">
          <v-text-field v-model="nameFolder" label="name folder"></v-text-field>
          <v-btn @click="addFolder({ name :`${nameFolder}` }), hideOverlayFolder()" :disabled="!nameFolder.length">Add
            folder
          </v-btn>
        </v-flex>
      </v-card>
    </v-overlay>

    <v-overlay :value="visibleFile">
      <v-card elevation="5" class="mx-auto" mix-width="600">
        <v-flex class="addCard" v-click-outside="hideOverlayFile">
          <v-file-input @change="onUploadFile(newFile)" counter multiple show-size v-model="newFile"
            prepend-icon="mdi-file" :rules="[ rules.extensionRule, rules.maxSizeRule, rules.permittedRule ]">
          </v-file-input>
          <v-btn elevation="2" @click="addFile({ post, path, foldersize }), hideOverlayFile()"
            :disabled="!fileIsUploaded">upload
          </v-btn>
        </v-flex>
      </v-card>
    </v-overlay>

    <v-btn class="mx-2 newFolderBtn" fab dark color="cyan" @click="changeVisible">
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import ClickOutside from "vue-click-outside"
import { v4 as uuidv4 } from 'uuid'

export default {
  name: "AddBtn",
  props: {
    folder: Boolean,
    path: {type: String, default: ''},
    foldersize: Number
  },

  data() {
    return {
      nameFolder: "",
      newFile: null,
      fileData: "",
      nameFile: "",
      extensionFile: '',
      opened: false,
      size: 0,
      maxFileSize: 20971520,

      allowedUpload: false,

      visibleFolder: false,
      visibleFile: false,

      rules: {
        maxSizeRule: v => (v && v[0]) ? v[0].size <= this.maxFileSize || this.maxSizeRule() : true,
        extensionRule: v => {
          if(v && v[0]){
            const smash = v[0].name.split(".")
            return smash[1] !== 'php' || this.unsupExtension() 
          }else{
            return true
          }
        },
        permittedRule: () => (!this.maxSizeRule && !this.extensionRule) || this.permitted()
      }
    }
  },

  methods: {
    ...mapActions(["onUpload", "addFile", "addFolder", "newFolder"]),
    uuidv4,

    changeVisible() {
      this.opened = !this.opened
    },

    onUploadFile(e) {
      if (e && e[0]){

        this.fileData = e[0]
        const smash = e[0].name.split(".")
        this.nameFile = smash[0]
        this.extensionFile = smash[1]
        this.size = e[0].size

        if (this.extensionFile !== 'php' && this.size <= this.maxFileSize){
          this.onUpload({
            name: this.nameFile,
            data: this.fileData,
            extension: this.extensionFile
          })
        }

      }
    },

    showOverlayFolder() {
      this.visibleFolder = true
      this.changeVisible()
    },

    showOverlayFile() {
      this.visibleFile = true
      this.changeVisible()
    },

    hideOverlayFolder() {
      this.visibleFolder = false
      this.nameFolder = ''
    },

    hideOverlayFile() {
      this.visibleFile = false
      this.newFile = null
    },

    maxSizeRule(){
      this.allowedUpload = false
      return 'Max size 20mb'
    },

    unsupExtension() {
      this.allowedUpload = false
      return 'File php not supported'
    },

    permitted() {
      this.allowedUpload = true
      return true
    }
  },
  computed: {
    ...mapGetters(["getCurrentUser", 'getFileUrl']),

    post() {
      return {
        name: this.nameFile,
        size: this.size,
        extension: this.extensionFile,
        id: this.uuidv4()
      }
    },

    send(){
      return this.getFileUrl.length>0
    },

    fileIsUploaded(){
      return this.fileData
        ? this.nameFile !== '' && this.send && this.allowedUpload
        : false
    }
  },
  directives: {
    ClickOutside,
  }
}
</script>

<style>
.newFolderBtn {
  position: fixed;
  bottom: 30px;
  right: 30px;
}

.newFolder {
  position: fixed;
  border-radius: 10px;
  bottom: 100px;
  right: 50px;
}

.newFolder div:first-child {
  margin-bottom: 10px;
}

.showAddCard-card {
  position: relative;
  margin: 0 auto;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 20px;
}

.showAddCard {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  background-color: gray;
  opacity: 0.7;
}

.addCard {
  min-width: 300px;
  padding: 15px;
  border-radius: 15px;
}
</style>