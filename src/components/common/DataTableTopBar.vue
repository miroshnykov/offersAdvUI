<template>
  <v-container fluid class="pb-0">
    <v-row class="time_period_wrap justify-end mb-0 align-center rounded-t">
      <v-col cols="12" lg="10">
        <slot name="timePeriod"></slot>
      </v-col>
      <v-col cols="12" lg="2">
        <v-text-field
            @input="debounceSearch"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            dark
            single-line
            hide-details
            class="pt-0 mt-0"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { debounce } from 'debounce';

export default {
  name: 'DataTableTopBar',
  methods: {
    debounceSearch: debounce(function (value) {
      this.$emit('search', value);
    }, 700),
  },
};
</script>

<style scoped>

</style>
