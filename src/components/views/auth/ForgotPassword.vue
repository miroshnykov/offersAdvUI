<template>
  <div>
    <h2 class="text-center mb-4">Restore Password</h2>
    <v-alert dense text v-if="error" type="error">{{error}}</v-alert>
    <v-form
      v-if="!loading && !sentConfirmation"
      ref="form"
      v-model="valid"
      lazy-validation
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
      <div class="text-center">
        <v-btn
          block
          depressed
          :disabled="!valid"
          color="primary"
          @click="submitHandler"
        >
          Restore Password
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
      </div>
    </v-form>
    <div v-if="loading" class="text-center py-4">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-if="!loading && sentConfirmation">
      <h3>Email is sent:</h3>
      Check your email and click on restore password link.<br>
      <small>You can close this page.</small>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ForgotPasswordMutation } from '@/graphql/ForgotPassword';
import { ForgotPassword, ForgotPasswordVariables } from '@/graphql/__generated__/ForgotPassword';

export default Vue.extend({
  name: 'ForgotPassword',

  data() {
    return {
      valid: true,
      error: '',
      sentConfirmation: false,
      loading: false,
      email: '' as string,
      emailRules: [
        (v: string) => !!v || 'E-mail is required',
        (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    };
  },
  methods: {
    async submitHandler(): Promise<void> {
      this.error = '';
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.loading = true;
        try {
          const result = await this.$apollo.mutate<ForgotPassword, ForgotPasswordVariables>({
            mutation: ForgotPasswordMutation,
            variables: {
              email: this.email,
            },
          });
          if (!result.data!.forgotPassword) {
            this.error = 'This user was not found in our database.';
          } else {
            this.sentConfirmation = true;
          }
        } catch (error) {
          if (error.graphQLErrors[0].message) {
            this.error = error.graphQLErrors[0].message;
          } else {
            this.error = error.message;
          }
          return;
        } finally {
          this.loading = false;
        }
      }
    },
  },
});
</script>
