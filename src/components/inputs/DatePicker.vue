<template>
  <v-menu
    ref="menu"
    v-model="isVisible"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        outlined
        v-model="dateEdit"
        :label="title"
        prepend-icon="mdi-calendar"
        readonly
        @click:clear="() => change(null)"
        v-bind="attrs"
        :disabled="disabled"
        clearable
        :rules="rules"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      outlined
      v-model="dateEdit"
      no-title
      :disabled="disabled"
      :min="minEdit"
      :max="maxEdit"
      @change="() => change(dateEdit)"
      scrollable
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="isVisible = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="$refs.menu.save(date)"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    rules: Array,
    title: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    min: {
      type: String,
      default: '',
    },
    max: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000))
        .toISOString().substr(0, 10),
    },
    change: Function,
  },
  data() {
    return {
      isVisible: false,
      dateEdit: '',
      minEdit: '',
      maxEdit: '',
    };
  },
  mounted() {
    this.dateEdit = this.date;
    this.minEdit = this.min;
    this.maxEdit = this.max;
  },
  updated() {
    this.minEdit = this.min;
    this.maxEdit = this.max;
  },
});
</script>
