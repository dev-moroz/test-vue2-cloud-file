<template>
  <div>
    <router-link to="/" class="text-decoration-none grey--text d-flex link-back mt-5">
      <v-icon>mdi-chevron-double-left</v-icon>
    </router-link>

    <ContentFile :data="getFbData" :size="getSizeData" :extension="getExtension" />

    <AppAddBtnVue :path="getPath" :foldersize="getSizeData" />
  </div>
</template>

<script>
import AppAddBtnVue from "@/components/AppAddBtn.vue"
import { mapActions, mapGetters } from "vuex"
import ContentFile from "@/components/ContentFile.vue"
export default {
  name: "FolderView",
  data() {
    return {
      nameFolder: ''
    }
  },
  components: {
    AppAddBtnVue,
   ContentFile
  },
  computed: {
    ...mapGetters(["getCurrentUser", "getFbData", 'getSizeData', 'getExtension']),
    getPath() {
      return this.$route.path.split("/")[2]
    }
  },
  mounted() {
    this.getData( this.getPath )
  },
  methods: {
    ...mapActions(["getData"]),
  },
}
</script>
<style>
  .link-back{
    position: absolute;
  }
</style>

