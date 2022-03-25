<template>
  <div>
    <v-alert dense text v-if="error" type="error">{{error}}</v-alert>
    <div v-if="!loading && !registered">
      <SignUpIndex v-if="!step0passed" @update="updateStepZero"/>
      <SignUpSteps v-else @update="submitHandler"/>
    </div>
    <div v-if="loading" class="text-center py-4">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-if="!loading && registered">
      <h3>Two more steps to proceed:</h3>
      <ol>
        <li>Check your email and confirm your account.</li>
        <li>Wait until our managers accept you in our platform.<br>
          (Usually it takes several hours. We will notify you in additional email)
        </li>
      </ol>
      Then you will be able to <router-link to="/auth/login">login</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SignUpIndex from '@/components/views/auth/signup/SignUpIndex.vue';
import SignUpSteps from '@/components/views/auth/signup/SignUpSteps.vue';

import { SignUpMutation } from '@/graphql/Signup';
import { SignUp, SignUpVariables } from '@/graphql/__generated__/SignUp';

type StepZero = {
  email: string
  password: string
  repeatPassword: string
};

export default Vue.extend({
  name: 'SignUp',
  components: { SignUpIndex, SignUpSteps },
  data() {
    return {
      step0passed: false,
      valid: true,
      error: '',
      registered: false,
      loading: false,
      data: {
        email: '',
        password: '',
        repeatPassword: '',
      },
    };
  },
  methods: {
    updateStepZero({ email, password, repeatPassword }: StepZero): void {
      this.data.email = email;
      this.data.password = password;
      this.data.repeatPassword = repeatPassword;
      this.step0passed = true;
    },
    async submitHandler({ profileData, agreements }: any): Promise<void> {
      this.error = '';
      // save to storage and show another page
      this.loading = true;
      try {
        await this.$apollo.mutate<SignUp, SignUpVariables>({
          mutation: SignUpMutation,
          variables: {
            email: this.data.email,
            password: this.data.password,
            repeatPassword: this.data.repeatPassword,
            profileData,
            agreements,
          },
        });
        this.registered = true;
      } catch (error) {
        this.step0passed = false;
        if (error.graphQLErrors[0].message) {
          this.error = error.graphQLErrors[0].message;
        } else {
          this.error = error.message;
        }
        return;
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
