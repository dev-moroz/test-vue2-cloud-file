<template>
   <div>
      <div v-if="loading" class="text-center">
         <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else>
         <div v-if="showIs">
            <ContentFile :data="getFbData" :size="getSizeData" />
         </div>
         <v-container v-else>
            <v-row>
               <v-col class="mt-2 text-center" cols="12">
                  <strong>Storage is empty</strong>
               </v-col>
            </v-row>
         </v-container>
      </div>

      <AppAddBtnVue :folder="true" />
   </div>

</template>

<script>
import { mapGetters, mapActions } from "vuex"
import AppAddBtnVue from "@/components/AppAddBtn.vue"
import ContentFile from "@/components/ContentFile.vue"

export default {
   name: "HomeView",
   data() {
      return {
         drawer: null,
         isLogin: false
      }
   },
   components: {
      AppAddBtnVue,
      ContentFile
   },
   mounted() {
      this.getData("")
   },
   methods: {
      ...mapActions(["getData", 'checkUid']),
      folderPage(url) {
         return `/folder/${url}`
      },
   },
   computed: {
      ...mapGetters(["getCurrentUser", "getFbData", 'getSizeData', 'loading']),
      showIs() {
         return this.getFbData.length>0
      }
   }
}
</script>
