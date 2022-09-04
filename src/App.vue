<template>
   <v-app>
      <v-main>
         <div class="constainer-form">

            <v-app-bar app>
               <router-link to="/" class="text-decoration-none black--text">
                  <v-toolbar-title>
                     Cloud file store
                     <!-- <v-icon>mdi-weather-cloudy</v-icon> -->
                  </v-toolbar-title>
               </router-link>

               <v-spacer></v-spacer>

               <v-btn color="error mr-4" @click="logoutGoogle()" v-if="getCurrentUser">loguot</v-btn>
            </v-app-bar>

            <div class="white mt-5">
               <router-view />
            </div>


         </div>
      </v-main>
   </v-app>
</template>


<script>
import { mapActions, mapGetters } from "vuex"

export default {
   name: "App",
   methods: {
      ...mapActions(['logoutGoogle', 'authGoogle']),
   },
   computed: {
      ...mapGetters(['getCurrentUser','testGoogleId']),
   },
   watch:{
      getCurrentUser(){
         // location.reload()

         // need for git pages 
         this.getCurrentUser !== ''
         ? this.$router.push({path: '/'})
         : this.$router.push({ path: '/login' })
      }
   }
}
</script>

<style>
.constainer-form {
   background-color: antiquewhite;
   width: 90%;
   margin: 0 auto;
}
</style>