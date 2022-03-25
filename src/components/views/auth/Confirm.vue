<template>
  <div>
    <h2 class="text-center">Email Confirmation</h2>
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
    <div v-if="!loading && confirmed">
      <h4>Your email is confirmed!</h4>
      If you were verified by our managers you can try to
      <router-link to="/auth/login">login</router-link>.<br>
      Otherwise wait for email notification. Usually it takes several hours.
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ConfirmUserMutation } from '@/graphql/ConfirmUserMutation';
import { ConfirmUser, ConfirmUserVariables } from '@/graphql/__generated__/ConfirmUser';

export default Vue.extend({
  name: 'Confirm',

  components: {
  },
  data: () => ({
    error: '',
    loading: true,
    confirmed: false,
  }),

  async mounted() {
    this.loading = true;
    try {
      const result = await this.$apollo.mutate<ConfirmUser, ConfirmUserVariables>({
        mutation: ConfirmUserMutation,
        variables: {
          token: this.$route.params.token,
        },
      });
      if (!result.data!.confirmUser) {
        this.error = 'This link has expired or user already confirmed.';
      } else {
        this.confirmed = true;
      }
    } catch (error) {
      if (error.graphQLErrors[0].message) {
        this.error = error.graphQLErrors[0].message;
      } else {
        this.error = error.message;
      }
    } finally {
      this.loading = false;
    }
  },
});
</script>
