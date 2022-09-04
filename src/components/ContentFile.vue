<template>
   <v-container v-if="data.length" class="mb-16">


      <v-row v-if="haveFiles">
         <v-col class="filter" cols="12" v-if="this.extension.length > 1">

            <v-select :items="['all', ...extension ]" label="Filter to type">
               <template v-slot:item="{ item, attrs, on }">
                  <v-list-item v-bind="attrs" v-on="on" @change="sortFbData(item)">
                     <v-list-item-content>
                        <v-list-item-title :id="attrs['aria-labelledby']" v-text="item"></v-list-item-title>
                     </v-list-item-content>
                  </v-list-item>
               </template>
            </v-select>
         </v-col>

         <v-col class="mt-4 text-center" cols="12">
            <strong>Files</strong>
         </v-col>

         <template v-for="item,i in data">
            <v-col :key="i" cols="12" md="3" v-if="item.url" class="cards">
               <v-card>
                  <v-card-text v-text="item.name"></v-card-text>
                  <v-divider class="mx-4"></v-divider>
                  <v-card-actions>

                     <v-chip-group column>
                        <v-chip class="deep-purple accent-1 white--text" v-if="item.size">{{ convertSize(item.size)}}
                        </v-chip>
                        <v-chip class="red lighten-3 white--text">{{ item.extension }}</v-chip>
                     </v-chip-group>

                     <v-spacer></v-spacer>

                     <v-btn plain icon :download="item.url" href="#">
                        <v-icon>mdi-download</v-icon>
                     </v-btn>
                     <v-btn plain icon @click="copy(item.url)">
                        <v-icon>mdi-share-variant</v-icon>
                     </v-btn>
                     <v-btn plain icon @click="showChangeOverlay(item.id)">
                        <v-icon>mdi-grease-pencil</v-icon>
                     </v-btn>
                     <v-btn plain icon @click="removeFile({ name: item.id, path: getPath })">
                        <v-icon>mdi-delete</v-icon>
                     </v-btn>
                  </v-card-actions>
               </v-card>
            </v-col>
         </template>
      </v-row>

      <v-row v-if="!isShowFolders && haveFolders">
         <v-divider class="mx-4 mt-5" v-if="haveFiles"></v-divider>
         <v-col class="mt-2 text-center" cols="12">
            <strong>Folders</strong>
         </v-col>

         <template v-for="item,i in data">
            <v-col :key="i" cols="12" md="3" v-if="item.folder" class="cards">
               <v-card>
                  <router-link :to="`/folder/${item.folder}`" class="folder">
                     <v-card-text v-text="item.name"></v-card-text>
                  </router-link>

                  <v-divider class="mx-4"></v-divider>
                  <v-card-actions>

                     <v-chip-group column>
                        <v-chip class="deep-purple accent-1 white--text" v-if="item.size">{{ convertSize(item.size)}}
                        </v-chip>
                     </v-chip-group>

                     <v-spacer></v-spacer>

                     <v-btn plain icon @click="showChangeOverlay(item.folder)">
                        <v-icon>mdi-grease-pencil</v-icon>
                     </v-btn>
                     <v-btn plain icon @click=" removeFile({ name: item.folder, path: getPath })">
                        <v-icon>mdi-delete</v-icon>
                     </v-btn>

                  </v-card-actions>
               </v-card>
            </v-col>
         </template>
      </v-row>

      <v-row v-if="!haveFiles && !haveFolders">
         <v-col class="mt-2 text-center" cols="12">
            <strong>Folder is empty</strong>
         </v-col>
      </v-row>

      <AppEditName :path="getPath" :fileId="itemId" :show="editOverlay" @change="hideChangeOverlay" />

      <v-chip-group column class="mt-10 sizeAll">
         <v-chip class="deep-purple lighten-1 white--text">{{ convertSize(size)}}</v-chip>
      </v-chip-group>

      <AppAlerts :show="showAlert" :text="'link copied'" />

   </v-container>

</template>

<script>
import { mapActions, mapGetters } from "vuex"
import ClickOutside from "vue-click-outside"
import AppEditName from "@/components/AppEditName.vue"
import AppAlerts from "@/components/AppAlerts.vue"
export default {
   props: {
      data: Array,
      size: Number,
      extension: Array
   },
   data(){
      return{
         editOverlay: false,
         newName: '',
         itemId: '',
         showAlert: false
      }
   },
   components: {
      AppEditName,
      AppAlerts
   },
   methods: {
      ...mapActions(['removeFile', 'updateFile', 'sortFbData']),
      convertSize(size){
         return `${Math.round(size / 1024)}kb`
      },
      showChangeOverlay(id){
         this.editOverlay = true 
         this.itemId = id
      },
      hideChangeOverlay() {
         this.editOverlay = false
      },
      copy(url) {
         navigator.clipboard.writeText(url)
            .then(() => {
               this.showAlert = true
               setTimeout(() => {
                  this.showAlert = false
               } ,1500)
            })
            .catch(err => {
               console.error('Error in copying text: ', err)
            })
      }
   },
   computed: {
      ...mapGetters(['getFilteredFbData']),
      isShowFolders(){
         return this.$route.path.length > 1
      },
      getPath() {
         return this.isShowFolders ? this.$route.path.split("/")[2] + '/' : ''
      },
      haveFolders(){
         const folder = this.data.find(item => item.folder)
         return folder ? Object.values(folder).length>1 : false
      },
      haveFiles() {
         const file = this.data.find(item => item.url)
         return file ? Object.values(file).length > 1 : false
      }
   },
   directives: {
      ClickOutside,
   },
}
</script>

<style>
   .sizeAll{
      position: fixed;
      bottom: 30px;
      left: 30px;
   }
   .folder{
      text-decoration: none;
      color: inherit !important;
   }
   .cards{
      min-width: 300px
   }
   .filter{
      max-width: 250px;
      margin: 0 auto;
   }
</style>