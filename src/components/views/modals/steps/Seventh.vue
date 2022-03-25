<template>
  <v-row>
    <v-col cols="12">
      <h2 class="text-primary">Almost done! Let’s review if everything is correct:</h2>
    </v-col>
    <v-col
      cols="12"
      style="font-size: 24px;">
      <v-row>
        <v-col cols="10">
          <table>
            <tr>
              <td width="400px">Name:</td>
              <td>{{ offer.name }}</td>
            </tr>
            <tr>
              <td>Landing page:</td>
              <td>{{ offer.landings[0].url }}</td>
            </tr>
            <tr>
              <td>Payout:</td>
              <td>
                {{payinCurrency()}}{{ offer.payin }}
                <v-tooltip right v-if="payoutInfo()">
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="info-btn warn-btn"
                      v-bind="attrs"
                      v-on="on"
                    >
                      !
                    </div>
                  </template>
                  <span>
                    Custom payout per GEO is used
                  </span>
                </v-tooltip>
              </td>
            </tr>
            <tr>
              <td>Conversions limit:</td>
              <td>
                {{
                  offer.caps.sales_day
                    ? `${offer.caps.sales_day} / Day`
                    : 'N/A'
                }}</td>
            </tr>
            <tr>
              <td>Blocked counties:</td>
              <td v-if="offer.blockCountries === 'Block'">
                {{ `${countries().length} out of ${countryList.length}` }}
              </td>
              <td v-else>
                {{ `${countryList.length - countries().length} out of ${countryList.length}` }}
              </td>
            </tr>
            <tr>
              <td>Integration:</td>
              <td>{{ offer.integration }}</td>
            </tr>
          </table>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script lang="ts">

import Vue from 'vue';
import { getAllISOCodes } from 'iso-country-currency';
import { QueryCurrencies } from '@/graphql/QueryCurrencies';

export default Vue.extend({
  props: {
    offer: Object,
  },
  apollo: {
    currencies: {
      query: QueryCurrencies,
      update: (data) => data.getCurrencies,
    },
  },
  data() {
    return {
      currencies: new Array<any>(),
      countryList: getAllISOCodes(),
    };
  },
  methods: {
    payoutInfo() {
      if (this.offer.customPayin.length > 1) {
        return true;
      }
      if (this.offer.customPayin[0].payin && this.offer.customPayin[0].geo) {
        return true;
      }
      return false;
    },
    payinCurrency() {
      if (this.currencies) {
        const curr = this.currencies.filter((curr1: any) => curr1.id === this.offer.currency_id);
        return curr.length ? curr[0].symbol : '';
      }
      return '';
    },
    countries() {
      return this.offer.countries.filter((a: any) => a.country);
    },
  },
});
</script>
<style>
.warn-btn {
  background-color: #ffeb3b;
  width: 25px;
  padding: 1px 5px !important;
  color: black !important;
  border: 1px solid black;
  display: inline-block;
  top: -3px !important;
  left: -3px;
}
</style>
