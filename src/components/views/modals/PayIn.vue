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
        Edit Custom Geo Pay In
      </v-btn>
    </template>
    <v-form
      ref="form"
      v-model="validate"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Custom GEO Pay In</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table
            class="table-move-highlighting"
          >
            <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Geo
              </th>
              <th class="text-left">
                Pay In
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="(cpi, index) in customPatInEdit"
              :key="index"
            >
              <td>
                <v-autocomplete
                  outlined
                  :rules="rules.geo"
                  :items="listOfCountries"
                  item-text="countryName"
                  item-value="iso"
                  v-model="cpi.geo"
                />
              </td>
              <td>
                <v-text-field
                  outlined
                  :rules="rules.payin"
                  v-model="cpi.payin"
                  type="number"
                />
              </td>
            </tr>
            </tbody>
          </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="primary"
            @click="add"
          >
            Add
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
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Currency, getAllISOCodes } from 'iso-country-currency';

export default Vue.extend({
  props: {
    customPayIn: {
      type: Array,
      default: () => [],
    },
    change: Function,
  },
  data() {
    return {
      validate: true,
      isVisible: false,
      customPatInEdit: [] as any,
      listOfCountries: new Array<Currency>(),
      rules: {
        geo: [
          (v: string) => !!v.trim() || 'Geo must be selected',
        ],
        payin: [
          (v: number) => v > 0 || 'Pay in must be more then 0',
        ],
      },
    };
  },
  mounted() {
    this.customPatInEdit = [...this.customPayIn];
    this.listOfCountries = getAllISOCodes();
  },
  methods: {
    onOk() {
      if ((this.$refs.form as HTMLFormElement).validate()) {
        this.isVisible = false;
        if (this.change) {
          this.change(this.customPatInEdit);
        }
      }
    },
    onCancel() {
      this.isVisible = false;
      this.customPatInEdit = [...this.customPayIn];
    },
    add() {
      this.customPatInEdit.push({
        id: null,
        geo: '',
        payin: 0,
      });
    },
  },
});
</script>
