<template>
  <div>
    <h2 class="text-center mb-4">Login To Your Account</h2>
    <v-alert dense text v-if="error" type="error">{{error}}</v-alert>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="submitHandler"
    >
      <label :for="`text_field_email`"><strong>Email</strong></label>
      <v-text-field
        solo
        flat
        id="text_field_email"
        v-model="email"
        :rules="emailRules"
        placeholder="Your Email Address"
        required
      ></v-text-field>
      <label :for="`text_field_password`"><strong>Password</strong></label>
      <v-text-field
        solo
        flat
        id="text_field_password"
        type="password"
        v-model="password"
        :rules="passwordRules"
        placeholder="Your password"
        required
      ></v-text-field>
      <div class="text-center">
        <v-btn
          :disabled="!valid"
          color="primary"
          block
          depressed
          type="submit"
          @click="submitHandler"
        >
          Login
        </v-btn>
      </div>
      <div class="text-center my-2">
        <span> or </span>
      </div>
      <div class="text-center">
        <v-btn
          color="primary"
          text
          class="bg-gray mb-2"
          block
          depressed
          to="/auth/signup"
        >
          Create your account
        </v-btn>
        <router-link v-if="error" to="/auth/forgot-password">Forgot password?</router-link>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onLogin } from '@/vue-apollo';
import { LoginMutation } from '@/graphql/Login';
import { Login, LoginVariables } from '@/graphql/__generated__/Login';
import { UserQuery } from '@/graphql/User';

export default Vue.extend({
  name: 'Login',

  components: {
  },
  data: () => ({
    error: '',
    botMessage: '',
    valid: true,
    password: '',
    passwordRules: [
      (v: string) => !!v || 'Password is required',
    ],
    email: '',
    emailRules: [
      (v: string) => !!v || 'Email is required',
      (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
  }),

  methods: {
    async submitHandler(event: Event): Promise<void> {
      event.preventDefault();
      this.error = '';
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        try {
          await this.$apollo.mutate<Login, LoginVariables>({
            mutation: LoginMutation,
            variables: {
              email: this.email,
              password: this.password,
            },
            update: async (store, { data }) => {
              const { login } = data!;
              const client = this.$apollo.getClient();
              await onLogin(client, login!.accessToken);
              const response = await client.query({ query: UserQuery });
              store.writeData({ data: { user: response.data.currentUser } });
              if (this.$route.query.o) {
                this.botMessage = 'Success! We can go now chat with NameBrand on the go!';
                localStorage.setItem('flash', 'Success! We can go now chat with NameBrand on the go!');
              }
              // get current user here by token and put it into store
              await this.$router.push({ name: 'Home' });
            },
          });
        } catch (error) {
          if (error.graphQLErrors[0].message) {
            this.error = error.graphQLErrors[0].message;
          } else {
            this.error = error.message;
          }
        }
      }
    },
  },
});
</script>
