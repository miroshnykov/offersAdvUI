<template>
  <span v-if="status === 'pending'">
    <v-icon class="orange--text">mdi-circle-medium</v-icon>
    Pending
  </span>
  <span v-else-if="status === 'inactive'">
    <v-icon class="red--text">mdi-circle-medium</v-icon>
    Inactive
  </span>
  <span v-else-if="status === 'draft'">
    <v-icon class="orange--text">mdi-circle-medium</v-icon>
    Draft
  </span>
  <span v-else>
    <v-icon class="green--text">mdi-circle-medium</v-icon>
    Active
  </span>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    status: String,
  },
});
</script>
