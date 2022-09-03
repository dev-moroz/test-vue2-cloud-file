 <template>
    <div class="text-center ma-4">
       <v-slide-y-transition>
          <v-card v-show="show" width="200" class="blue lighten-2 mx-auto mt-4 notification">
             <v-card-text v-text="text" class="white--text"></v-card-text>
          </v-card>
       </v-slide-y-transition>
    </div>
 </template>

<script>
export default {
  props:{
   show: Boolean,
   text: String
  }
}
</script>
<style>
   .notification{
      position: absolute;
      top: 10px;
      right: 20px;
   }
</style>