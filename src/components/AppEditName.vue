<template>
   <v-overlay :value="show">
      <v-card elevation="5" class="mx-auto" mix-width="600">
         <v-flex class="addCard" v-click-outside="hide">
            <v-text-field v-model="newName" label="new name"></v-text-field>
            <v-btn @click="updateFile({ path, newName, fileId}), $emit('change')" :disabled="!newName.length">update
            </v-btn>
         </v-flex>
      </v-card>
   </v-overlay>
</template>

<script>
import ClickOutside from "vue-click-outside"
import { mapActions } from "vuex"
export default {
   props:{
      path: String,
      fileId: String,
      show: Boolean
   },
   methods: {
      ...mapActions(['updateFile']),
      hide(){
         this.$emit('change')
      }
   },
   data(){
      return{
         newName: ''
      }
   },
   directives: {
      ClickOutside,
   }
}
</script>

<style>
   .addCard {
      min-width: 400px;
      padding: 15px;
      border-radius: 15px;
   }
</style>