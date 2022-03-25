<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" class="pb-0 px-6">
        <v-row class="bg-gray">
          <v-col>
            <h2 class="text-primary">Allowed Countries</h2>
          </v-col>
          <v-col>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="info-btn primary out-of-input float-right"
                  v-bind="attrs"
                  v-on="on"
                >
                  i
                </div>
              </template>
              <span>
                First select Allow/Block, to determine if you wish to block all traffic coming from
                <br/>
                the countries listed below, or only allow traffic from the countries below.<br/>
                Then start typing the country code or name and select your first country.<br/>
                Click the (+) icon to add another, or the (-) icon to remove one.
              </span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col>
            <div class="scrollable bg-gray">
            <v-row>
              <v-col cols="6" class="pb-0">
                <v-select
                  :items="['Allow', 'Block']"
                  v-model="offer.blockCountries"
                />
              </v-col>
            </v-row>
              <v-row v-for="(country, index) in displayedCountries" :key="index">
                <v-col class="pb-0 pt-0">
                  <v-autocomplete
                    placeholder="Start typing a country"
                    :items="listOfCountries"
                    v-model="country.country"
                    item-value="iso"
                    item-text="display"
                  />
                </v-col>
                <v-col cols="1" class="pb-0 pt-0">
                  <div
                    v-if="displayedCountries.length !== 1"
                    class="info-btn primary info-button float-left"
                    @click="minus(index)"
                  >-</div>
                </v-col>
                <v-col cols="1" class="pb-0 pt-0">
                  <div
                    class="info-btn primary info-button float-right"
                    v-if="index === displayedCountries.length - 1"
                    style="
                      padding-left: 10px;
                      margin-right: 20px;"
                    @click="plus"
                  >+</div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">

import Vue from 'vue';
import { Currency, getAllISOCodes } from 'iso-country-currency';

export default Vue.extend({
  props: {
    offer: Object,
  },
  data() {
    return {
      listOfCountries: new Array<Currency>(),
      displayedCountries: new Array<any>(),
    };
  },
  mounted() {
    this.listOfCountries = getAllISOCodes().map((country: any) => {
      country.display = `${country.iso} - ${country.countryName}`;
      return country;
    });
    if (this.offer.blockCountries === 'Allow') {
      const revers = getAllISOCodes().map((country) => ({
        country: country.iso,
        include: true,
      }));
      this.offer.countries.forEach((selected: any) => {
        const i = revers.findIndex((c) => selected.country === c.country);
        revers.splice(i, 1);
      });
      this.displayedCountries = revers;
    } else {
      this.displayedCountries = this.offer.countries;
    }
  },
  beforeDestroy() {
    if (this.offer.blockCountries === 'Allow') {
      const revers = getAllISOCodes().map((country) => ({
        country: country.iso,
        include: true,
      }));
      this.displayedCountries.forEach((selected: any) => {
        const i = revers.findIndex((c) => selected.country === c.country);
        revers.splice(i, 1);
      });
      this.offer.countries = revers;
    } else {
      this.offer.countries = this.displayedCountries;
    }
  },
  methods: {
    plus() {
      this.displayedCountries.push({
        country: '',
        includes: true,
      });
    },
    minus(i: number) {
      this.displayedCountries.splice(i, 1);
    },
    validate() {
      return (this.$refs.form as HTMLFormElement).validate();
    },
  },
});
</script>
