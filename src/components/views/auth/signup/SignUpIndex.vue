<template>
  <div>
    <h2 class="text-center mb-4">Create Your Account</h2>
    <v-alert dense text v-if="error" type="error">{{error}}</v-alert>
    <v-form
      v-if="!loading"
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <div class="my-field-group">
        <label :for="`text_field_email`"><strong>Email</strong></label>
        <v-text-field
          :solo="!email"
          :outlined="!!email"
          flat
          id="text_field_email"
          v-model="email"
          :rules="emailRules"
          placeholder="Your Email Address"
          required
        ></v-text-field>
      </div>
      <div class="my-field-group">
        <label :for="`text_field_password`"><strong>Password</strong></label>
        <v-text-field
          :solo="!password"
          :outlined="!!password"
          flat
          id="text_field_password"
          type="password"
          v-model="password"
          :rules="passwordRules"
          placeholder="Your Password"
          required
        ></v-text-field>
      </div>
      <div class="my-field-group">
        <label :for="`text_field_repeat-password`"><strong>Confirm Password</strong></label>
        <v-text-field
          :solo="!repeatPassword"
          :outlined="!!repeatPassword"
          flat
          id="text_field_repeat-password"
          type="password"
          v-model="repeatPassword"
          :rules="repeatPasswordRules"
          placeholder="Your Password"
          required
        ></v-text-field>
      </div>
      <div class="text-center">
        <v-btn
          :disabled="!valid"
          color="primary"
          block
          depressed
          @click="submitHandler"
        >
          Signup
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
          @click="submitHandler"
          to="/auth/login"
        >
          Login
        </v-btn>
        <router-link v-if="userExists" to="/auth/forgot-password">Restore password</router-link>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { UserExistsQuery } from '@/graphql/UserExistsQuery';
import { UserExists, UserExistsVariables } from '@/graphql/__generated__/UserExists';

export default Vue.extend({
  name: 'SignUpIndex',

  data() {
    return {
      valid: true,
      error: '',
      userExists: false,
      loading: false,
      password: '' as string,
      passwordRules: [
        (v: string) => !!v || 'Password is required',
        (v: string) => v.length >= 8 || 'Password should be minimum 8 symbols',
      ],
      repeatPassword: '' as string,
      email: '' as string,
      emailRules: [
        (v: string) => !!v || 'E-mail is required',
        (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    };
  },
  computed: {
    repeatPasswordRules() {
      const rules = [];
      rules.push((v: string) : boolean | string => !!v || 'Repeat the Password');
      if (this.password) {
        const rule = (v: string) : boolean | string => (!!v && v) === this.password || 'Passwords do not match';

        rules.push(rule);
      }

      return rules;
    },
  },
  methods: {
    async submitHandler(): Promise<void> {
      this.error = '';
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.loading = true;
        try {
          // check if user already exists
          const response = await this.$apollo.query<UserExists, UserExistsVariables>({
            query: UserExistsQuery,
            variables: {
              email: this.email,
            },
            fetchPolicy: 'no-cache',
          });
          if (response.data.userExists) {
            this.userExists = true;
            this.error = 'This email was already registered';
          } else {
            this.$emit('update', {
              email: this.email,
              password: this.password,
              repeatPassword: this.repeatPassword,
            });
          }
          // not exists  emit event to parrent
        } catch (error) {
          // exists show frogot password link
          this.error = error.message;
          return;
        } finally {
          this.loading = false;
        }
      }
    },
  },
});
</script>
