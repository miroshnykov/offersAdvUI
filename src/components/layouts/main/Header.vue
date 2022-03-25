<template>
  <v-app-bar
    app
    color="white"
    height="50"
    class="mx-3 mt-3"
    elevation="1"
    rounded
  >
    <v-app-bar-nav-icon v-if="$vuetify.breakpoint.mobile" @click.stop="navigation = !navigation">
    </v-app-bar-nav-icon>
    <v-spacer v-if="$vuetify.breakpoint.mobile"></v-spacer>
    <div style="width: 200px">
      <v-img
        alt="Main Logo"
        class="shrink"
        contain
        src="@/assets/logo.png"
        height="40"
        transition="scale-transition"
      />
    </div>
    <v-spacer></v-spacer>
    <HelloWorld v-if="!$vuetify.breakpoint.mobile"/>
    <div>
      <v-menu v-if="user"
        bottom
        left
        :offset-y="true"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="!$vuetify.breakpoint.mobile"
            v-bind="attrs"
            v-on="on"
            text
            class="px-1"
          >
            <span>{{user.name}}</span>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          <v-btn v-else
                 v-bind="attrs"
                 v-on="on"
                 icon
                 class="px-1">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logoutHandler">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { onLogout } from '@/vue-apollo';
import { UserQuery } from '@/graphql/User';
import HelloWorld from '../../HelloWorld.vue';

export default Vue.extend({
  name: 'Header',
  props: ['value'],
  components: {
    HelloWorld,
  },
  apollo: {
    user: {
      query: UserQuery,
      error: async (error: Error, vm: any) => {
        if (error.message.toLowerCase().includes('not authorized')) {
          await vm.logoutHandler();
        }
      },
    },
  },
  data() {
    return {
      navigation: false,
    };
  },
  methods: {
    async logoutHandler() {
      await onLogout(this.$apollo.getClient());
      this.$router.push({ name: 'Login' });
    },
  },
  watch: {
    value() {
      this.navigation = this.value;
    },
    navigation() {
      this.$emit('input', this.navigation);
    },
  },
});
</script>
