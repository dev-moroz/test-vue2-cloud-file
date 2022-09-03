<template>
   <v-container>
      <v-form ref="form" v-model="valid" lazy-validation class="text-center">
         <v-text-field v-model="name" :rules="nameRules" label="Login or Email" required></v-text-field>

         <v-text-field v-model="password" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]" :type="show ? 'text' : 'password'" name="input-10-1" label="Password"
            hint="At least 8 characters" counter @click:append="show = !show">
         </v-text-field>

         <v-btn :disabled="!valid" color="success" class="mr-4 mb-3"
            @click="loginGoogle({ email: name, password: password })">
            Login
         </v-btn>
         <v-btn :disabled="!valid" color="error" class="mr-4 mb-3"
            @click="registerGoogle({email: name, password: password})">
            Register
         </v-btn>
         <v-btn color="primary mr-4 mb-3" @click="authGoogle">
            Login with Google
         </v-btn>
      </v-form>

   </v-container>
</template>

<script>
import { mapActions } from "vuex"
export default {
   data: () => ({
      valid: true,
      show: false,
      name: '',
      nameRules: [
         v => !!v || 'Name is required',
         v => (v && v.length >= 4) || 'Name must be more than 4 characters',
      ],
      password: '',
      rules: {
         required: value => !!value || 'Required.',
         min: v => v.length >= 8 || 'Min length 8 characters',
         emailMatch: () => (`The email and password you entered don't match`),
      },
   }),

   methods: {
      ...mapActions(['authGoogle', 'registerGoogle', 'loginGoogle']),
      validate() {
         this.$refs.form.validate()
      },
      reset() {
         this.$refs.form.reset()
      },
      resetValidation() {
         this.$refs.form.resetValidation()
      },
   },
}
</script>