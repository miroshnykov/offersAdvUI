<template>
  <div class="mb-3">
    <div class="d-flex justify-space-between mb-2 signup-steps">
      <div>{{name}}</div>
      <div>{{step}}/{{stepsCount}}</div>
    </div>
    <v-progress-linear
      background-color="#f6f6f6"
      background-opacity="1"
      rounded
      class="progress-line"
      height="8" :value="Math.round(step / stepsCount * 100)">
    </v-progress-linear>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'StepProgress',
  props: {
    name: {
      type: String,
      default: '',
    },
    step: {
      default: 1,
    },
    stepsCount: {
      default: 1,
    },
  },
  data() {
    return {};
  },
});
</script>

<style scoped>

</style>
