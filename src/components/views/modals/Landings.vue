<template>
  <v-form ref="form" v-model="validate" lazy-validation>
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
          Edit Landings
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Landings</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table class="table-move-highlighting">
            <template v-slot:default>
              <thead>
                <tr>
                  <th
                    class="text-left"
                    style="width: 400px;"
                  >
                    Name
                  </th>
                  <th class="text-left">
                    Url
                  </th>
                  <th
                    class="text-left"
                    style="width: 50px;"
                  >
                    Default
                  </th>
                  <th style="width: 50px;"></th>
                </tr>
              </thead>
              <tbody>
              <tr
                v-for="(lp, index) in landingsEdit"
                :key="index"
              >
                <td>
                  <v-text-field outlined v-model="lp.name" :rules="rules.name"/>
                </td>
                <td>
                  <v-text-field outlined v-model="lp.url" :rules="rules.url"/>
                </td>
                <td>
                  <input
                    class="move-to-top"
                    type="radio"
                    :checked="lp.isDefault"
                    name="defaultLP"
                    @change="defaultLpChanged(lp)"
                  />
                </td>
                <td>
                  <v-btn
                    class="move-to-top"
                    @click="removeLanding(lp)"
                    small
                    text
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-btn
            class="primary"
            @click="add"
          >
            Add Landing Page
          </v-btn>
          <v-simple-table class="table-move-highlighting">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  Geo
                </th>
                <th class="text-left">
                  Landing page
                </th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(lp, index) in customLandingsEdit"
                :key="index"
              >
                <td>
                  <v-autocomplete
                    outlined
                    :rules="rules.geo"
                    :items="countries"
                    item-text="countryName"
                    item-value="iso"
                    v-model="lp.country"
                  />
                </td>
                <td>
                  <v-autocomplete
                    outlined
                    :rules="rules.lp"
                    :items="landingsEdit"
                    item-text="name"
                    item-value="name"
                    :value="lp.name"
                    @change="onChangeLanding(lp, $event)"
                  />
                </td>
                <td>
                  <v-btn
                    class="move-to-top"
                    @click="removeCustomLanding(lp)"
                    small
                    text
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-btn
            class="primary"
            @click="addGeo"
          >
            Add Geo
          </v-btn>
        </v-card-text>
        <v-card-actions>
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
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import { Currency, getAllISOCodes } from 'iso-country-currency';
import { Offer_getOffer_customLandings, Offer_getOffer_landings } from '@/graphql/__generated__/Offer';

export default Vue.extend({
  props: {
    landings: Array,
    customLandings: Array,
    change: Function,
  },
  data() {
    return {
      validate: false,
      isVisible: false,
      landingsEdit: [] as any,
      customLandingsEdit: [] as any,
      countries: [] as Currency[],
      rules: {
        name: [
          (v: string) => !!v.trim() || 'Name is required',
        ],
        geo: [
          (v: string) => !!v.trim() || 'Geo must be selected',
        ],
        lp: [
          (v: string) => !!v.trim() || 'Landing page must be selected',
        ],
        url: [
          (v: string) => /^(?:http(s)?:\/\/)/.test(v) || 'Url should to have "http" or "https".',
          (v: string) => {
            const exp = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gm;
            return exp.test(v) || 'Url must to be "https://[Your domain].com".';
          },
        ],
      },
    };
  },
  mounted() {
    this.landingsEdit = [...this.landings];
    this.customLandingsEdit = [...this.customLandings];
    this.countries = getAllISOCodes().sort((i, j) => {
      if (i.countryName > j.countryName) {
        return 1;
      }
      if (i.countryName < j.countryName) {
        return -1;
      }
      return 0;
    });
  },
  methods: {
    onOk() {
      if ((this.$refs.form as HTMLFormElement).validate()) {
        this.isVisible = false;
        if (this.change) {
          this.change(this.landingsEdit, this.customLandingsEdit);
        }
      }
    },
    onCancel() {
      this.isVisible = false;
      this.landingsEdit = [...this.landings];
    },
    add() {
      this.landingsEdit.push({
        id: null,
        name: '',
        url: '',
        isDefault: this.landingsEdit.length === 0,
      });
    },
    addGeo() {
      this.customLandingsEdit.push({
        name: '',
        url: '',
        pos: 0,
        country: '',
        id: 0,
      });
    },
    defaultLpChanged(landing: Offer_getOffer_landings) {
      this.landingsEdit = this.landingsEdit.map((lp: Offer_getOffer_landings) => {
        const newVal = { ...lp };
        if (newVal.name === landing.name && newVal.url === landing.url) {
          newVal.isDefault = true;
        } else {
          newVal.isDefault = false;
        }
        return newVal;
      });
    },
    removeLanding(lp: Offer_getOffer_landings) {
      if (!lp.isDefault) {
        const i = this.landingsEdit.indexOf(lp);
        this.landingsEdit.splice(i, 1);
      }
    },
    removeCustomLanding(lp: Offer_getOffer_customLandings) {
      const i = this.customLandingsEdit.indexOf(lp);
      this.customLandingsEdit.splice(i, 1);
    },
    onChangeLanding(clp: Offer_getOffer_customLandings, lpName: string) {
      const lp = this.landingsEdit.find((l: Offer_getOffer_landings) => l.name === lpName)!;
      clp.name = lp.name;
      clp.url = lp.url;
      clp.id = lp.id;
    },
  },
});
</script>
