<template>
  <v-form ref="form">
    <v-row>
      <v-col>
        <v-text-field
          v-model="offer.payin"
          label="Default Price"
          :rules="rules.payin"
          type="number"
          min="0"
        >
          <template slot="append">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="info-btn primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  i
                </div>
              </template>
              <span>
                The amount you will pay for every purchase/conversion made on this offer.
              </span>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
      <v-col offset="1">
        <v-select
          v-model="offer.currency_id"
          label="Currency"
          :items="currencies"
          :rules="rules.currency"
          item-value="id"
          item-text="display"
        >
          <template slot="append">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="info-btn primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  i
                </div>
              </template>
              <span>
                The currency in which you will pay for every purchase/conversion made on this offer.
              </span>
            </v-tooltip>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pb-0">
        <h3 class="text-primary">Custom Price(s)</h3>
      </v-col>
      <v-col class="pb-0">
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
            [Optional] If you want to assign different prices per country, this is how.<br/>
            Enter the amount (the same currency as entered above will be used)
            and select the matching country.<br/>
            Click the (+) icon to add more combinations and (-) to remove them.
          </span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="scrollable bg-gray">
          <v-row v-for="(cpi, index) in offer.customPayin" :key="index">
            <v-col cols="3">
              <v-text-field
                type="number"
                v-model="cpi.payin"
                min="0"
              />
            </v-col>
            <v-col cols="7">
              <v-autocomplete
                placeholder="Start typing a country"
                :items="listOfCountries"
                v-model="cpi.geo"
                item-text="display"
                item-value="iso"
              />
            </v-col>
            <v-col cols="1">
              <div
                v-if="offer.customPayin.length !== 1"
                @click="minus(index)"
                class="info-btn primary info-button float-right"
              >-</div>
            </v-col>
            <v-col cols="1">
              <div
                v-if="index === offer.customPayin.length - 1 || offer.customPayin.length === 0"
                @click="plus"
                class="info-btn primary info-button" style="padding-left: 10px;"
              >+</div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">

import Vue from 'vue';
import { Currency, getAllISOCodes } from 'iso-country-currency';
import { QueryCurrencies } from '@/graphql/QueryCurrencies';

export default Vue.extend({
  props: {
    offer: Object,
  },
  apollo: {
    currencies: {
      query: QueryCurrencies,
      update: (data) => data.getCurrencies,
      result(res) {
        this.currencies = res.data.getCurrencies.map((cur: any) => {
          cur.display = `${cur.symbol} - ${cur.abbr}`;
          return cur;
        });
      },
    },
  },
  data() {
    return {
      currencies: new Array<any>(),
      listOfCountries: new Array<Currency>(),
      rules: {
        payin: [
          (v: number) => !!v || 'Price must be set',
        ],
        currency: [
          (v: number) => !!v || 'Currency must be set',
        ],
      },
    };
  },
  mounted() {
    this.listOfCountries = getAllISOCodes().map((country: any) => {
      country.display = `${country.iso} - ${country.countryName}`;
      return country;
    });
  },
  methods: {
    plus() {
      this.offer.customPayin.push({
        id: null,
        geo: '',
        payin: '',
      });
    },
    minus(i: number) {
      this.offer.customPayin.splice(i, 1);
    },
    validate() {
      return (this.$refs.form as HTMLFormElement).validate();
    },
  },
});
</script>
