<template>
  <v-card>
    <v-navigation-drawer
      floating
      :permanent="!$vuetify.breakpoint.mobile"
      :temporary="$vuetify.breakpoint.mobile"
      v-model="open"
      :fixed="$vuetify.breakpoint.mobile"
    >
      <v-list
        dense
        rounded
        flat
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
          color="primary"
          active-class="active"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Navigation',
  props: ['value'],
  data() {
    return {
      open: false,
      items: [
        { title: 'Home', to: '/', icon: 'mdi-view-dashboard' },
        { title: 'Analytics', to: '/reports', icon: 'mdi-chart-bell-curve-cumulative' },
        { title: 'Offers', to: '/offers', icon: 'mdi-bullhorn-outline' },
        // { title: 'About', to: '/about', icon: 'mdi-forum' },
      ],
    };
  },
  watch: {
    value() {
      this.open = this.value;
    },
    open() {
      this.$emit('input', this.open);
    },
  },
});
</script>
