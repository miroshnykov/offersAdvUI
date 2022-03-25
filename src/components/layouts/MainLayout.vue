<template>
  <div class="main-layout">
    <Header v-model="navigation"/>
    <CreateOffer/>
    <v-container fluid>
      <v-row class="mt-2">
        <v-col cols="12" md="3" lg="2">
          <Navigation v-model="navigation"/>
        </v-col>
        <v-col cols="12" md="9" lg="10" class="content-card">
          <v-expand-transition>
            <router-view/>
          </v-expand-transition>
        </v-col>
      </v-row>
      <v-alert
        v-if="!!alertMessage"
        dismissible
        class="alert-position-fixed"
        :type="alertType"
        border="left"
        elevation="2"
        colored-border
        @input="clearAlert"
      >
        {{ alertMessage }}
      </v-alert>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@/components/layouts/main/Header.vue';
import Navigation from '@/components/layouts/main/Navigation.vue';
import { event } from '@/utils/eventBus';
import CreateOffer from '@/components/views/modals/CreateOffer.vue';

interface IAlert {
  type: 'success' | 'info' | 'error' | 'warning',
  message: string,
  ttl?: number
}

export default Vue.extend({
  name: 'MainLayout',
  components: { Navigation, Header, CreateOffer },
  created(): void {
    event.$on('alert', ({ type, message, ttl }: IAlert) => {
      console.log(ttl);
      if (ttl) {
        this.alertMessage = message;
        this.alertType = type;
        setTimeout(this.clearAlert, ttl);
      } else {
        this.alertMessage = message;
        this.alertType = type;
      }
    });
  },
  mounted() {
    if (!localStorage.getItem('notFirstLogin')) {
      event.$emit('createOffer');
      localStorage.setItem('notFirstLogin', 'true');
    }
  },
  data() {
    return {
      alertMessage: '',
      alertType: 'info',
      navigation: false,
    };
  },
  methods: {
    clearAlert(state: boolean) {
      if (!state) {
        this.alertMessage = '';
        this.alertType = 'info';
      }
    },
  },
});
</script>

<style lang="scss" scoped>
  .alert-position-fixed {
    position: fixed;
    left: 50%;
    top: 70px;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    z-index: 1000;
  }
  .content-card {
    max-height: 86vh;
    overflow: auto;
  }
</style>
