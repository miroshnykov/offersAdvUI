<template>
  <div>
    <h2 class="text-center mb-4">Restore Password</h2>
    <v-alert dense text v-if="error" type="error">{{error}}<br>
      Click <router-link to="/auth/login">here</router-link> to login.
    </v-alert>
    <div v-if="loading" class="text-center py-4">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-form
      v-if="!loading && confirmed && !restored"
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <label :for="`text_field_password`"><strong>Password</strong></label>
      <v-text-field
        solo
        flat
        id="text_field_password"
        type="password"
        v-model="password"
        :rules="passwordRules"
        placeholder="Your Password"
        required
      ></v-text-field>
      <label :for="`text_field_repeat-password`"><strong>Confirm Password</strong></label>
      <v-text-field
        solo
        flat
        id="text_field_repeat-password"
        type="password"
        v-model="repeatPassword"
        :rules="repeatPasswordRules"
        placeholder="Your Password"
        required
      ></v-text-field>
      <div class="text-center">
        <v-btn
          :disabled="!valid"
          color="primary"
          block
          depressed
          @click="submitHandler"
        >
          Save Password
        </v-btn>
      </div>
    </v-form>
    <div v-if="!loading && confirmed && restored">
      <h4>Your password is restored!</h4>
      You can try to <router-link to="/auth/login">login</router-link> now.<br>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ConfirmUserMutation } from '@/graphql/ConfirmUserMutation';
import { RestorePasswordMutation } from '@/graphql/RestorePassword';
import { RestorePassword, RestorePasswordVariables } from '@/graphql/__generated__/RestorePassword';

export default Vue.extend({
  name: 'Restore',

  components: {
  },
  data: () => ({
    valid: true,
    error: '',
    loading: true,
    restored: false,
    confirmed: false,
    password: '' as string,
    passwordRules: [
      (v: string) => !!v || 'Password is required',
    ],
    repeatPassword: '' as string,
  }),
  computed: {
    // todo: remove duplication
    repeatPasswordRules() {
      const rules = [];
      if (this.password) {
        const rule = (v: string) => (!!v && v) === this.password || 'Passwords do not match';

        rules.push(rule);
      }

      return rules;
    },
  },
  async mounted() {
    this.loading = true;
    try {
      const result = await this.$apollo.mutate({
        mutation: ConfirmUserMutation,
        variables: {
          token: this.$route.params.token,
        },
      });
      if (!result.data.confirmUser) {
        this.error = 'This link has expired or user already confirmed.';
      } else {
        this.confirmed = true;
      }
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async submitHandler(): Promise<void> {
      this.error = '';
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.loading = true;
        try {
          await this.$apollo.mutate<RestorePassword, RestorePasswordVariables>({
            mutation: RestorePasswordMutation,
            variables: {
              token: this.$route.params.token,
              password: this.password,
              repeatPassword: this.repeatPassword,
            },
          });
          this.restored = true;
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
