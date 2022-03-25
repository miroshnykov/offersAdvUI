<template>
  <div style="margin-top: -50px" class="flex right">
    <v-menu
      v-if="showFilter"
      offset-y
      top
      :close-on-content-click="false"
      v-model="filtersMenu"
      content-class="bg-white"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mx-2" icon v-bind="attrs" v-on="on">
          <v-icon color="secondary">mdi-filter-remove{{filtersMenu ? '' : '-outline'}}</v-icon>
        </v-btn>
      </template>
      <template>
        <v-card>
          <v-card-subtitle>Are you sure you want clear all filters?</v-card-subtitle>
          <v-card-actions>
            <v-btn text color="secondary" @click="filtersMenu = false">NO</v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="removeAllFilters">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-menu>
    <v-btn icon :disabled="rowHeight > 63" @click="rowHeight += 3">
      <v-icon size="24"  color="#7F98A5">mdi-magnify-plus-outline</v-icon>
    </v-btn>
    <v-btn icon :disabled="rowHeight <= 33" @click="rowHeight -= 3">
      <v-icon size="24"  color="#7F98A5">mdi-magnify-minus-outline</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'DataTableBottomBar',
  props: {
    showFilter: {
      default: false,
    },
    value: {
      type: Number,
      default: 45,
    },
  },
  data: () => ({
    rowHeight: 45,
    filtersMenu: false,
  }),
  mounted() {
    this.rowHeight = this.value;
  },
  methods: {
    removeAllFilters() {
      this.$emit('clearFilters');
      this.filtersMenu = false;
    },
  },
  watch: {
    rowHeight() {
      this.$emit('input', this.rowHeight);
    },
  },
};
</script>

<style scoped>

</style>
