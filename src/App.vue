<template>
  <v-app>
    <v-main class="main">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  // background-image: url('./assets/network.jpeg');
  background-color: #F6F6FB;
  background-size: cover;
  background-position: center;
  padding: 20px;
}
</style>
