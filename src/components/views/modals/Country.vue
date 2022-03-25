<template>
  <v-dialog
    v-model="isVisible"
    persistent
    max-width="1000px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        Ban countries: ({{ listEdit.length }})
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Banned country list</span>
      </v-card-title>
      <v-card-text>
        <div style="overflow-x: scroll; height: 350px;">
          <div
            class="country-list"
            v-for="country in listOfCountries"
            :key="country.iso"
          >
            <v-checkbox
              hide-details
              :label="country.countryName"
              :value="country.iso"
              v-model="listEdit"
            />
          </div>
        </div>
        <div>
          Banned GEOs selected:
          <div>
            {{ this.listEdit.join(', ') }}
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="red lighten-1"
          dark
          @click="banAll"
        >
          Ban All
        </v-btn>
        <v-btn
          dark
          color="green lighten-1"
          @click="allowAll"
        >
          Allow All
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="onCancel"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="onOk"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Currency, getAllISOCodes } from 'iso-country-currency';

export default Vue.extend({
  props: {
    list: {
      type: Array,
      default: () => new Array<string>(),
    },
    change: Function,
  },
  data() {
    return {
      isVisible: false,
      listOfCountries: getAllISOCodes(),
      listEdit: new Array<string>(),
    };
  },
  mounted() {
    this.listEdit = [...this.list as Array<string>];
  },
  methods: {
    onCancel() {
      this.isVisible = false;
      this.listEdit = [...this.list as Array<string>];
    },
    onOk() {
      this.isVisible = false;
      if (this.change) {
        this.change(this.listEdit);
      }
    },
    allowAll() {
      this.listEdit = [];
    },
    banAll() {
      this.listEdit = this.listOfCountries.map((i: Currency) => i.iso);
    },
  },
});
</script>

<style lang="scss">
.country-list {
  width: 50%;
  display: inline-block;
  .v-input--selection-controls {
    margin-top: 0px;
  }
}
</style>
