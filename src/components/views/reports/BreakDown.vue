<template>
  <v-data-table
    :loading="breakdownLoading"
    :headers="headers"
    :items="items"
    :page.sync="page"
    :items-per-page.sync="itemsPerPage"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :must-sort="true"
    @update:page="updateBreakdown"
    @update:sort-by="updateBreakdown"
    @update:sort-desc="updateBreakdown"
    @update:items-per-page="updateBreakdown"
    :footer-props="{'items-per-page-options': [5, 10, 25, 50]}"
    :server-items-length="itemsCount"
    class="elevation-0 mt-2"
    :hide-default-footer="hideDetails"
  >
    <template v-slot:item.revenue="{ item }">
      ${{ item.revenue }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';

import { BreakDownQuery } from '@/graphql/BreakDownQuery';
import {
  Breakdown,
  Breakdown_breakdown_data,
  BreakdownVariables,
} from '@/graphql/__generated__/Breakdown';

export default Vue.extend({
  name: 'ReportChart',

  props: {
    reportPeriod: {
      type: String,
      default: 'last7days',
    },
    dates: {
      default: () => [],
    },
    breakdown: {
      type: String,
      default: 'offer',
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    sortBy: ['conversions'],
    sortDesc: [true],
    page: 1,
    itemsPerPage: 5,
    breakdownLoading: true,
    breakdownsList: [
      {
        value: 'offer',
        text: 'Offer',
      },
      {
        value: 'day',
        text: 'Day',
      },
      {
        value: 'device',
        text: 'Device',
      },
      {
        value: 'geo',
        text: 'GEO',
      },
    ],
    headers: [
      {
        text: 'Offer',
        align: 'start',
        sortable: true,
        value: 'offer',
      },
      { text: 'Clicks', value: 'clicks' },
      { text: 'Conversions', value: 'conversions' },
      { text: 'Cost', value: 'revenue' },
    ],
    items: new Array<Breakdown_breakdown_data>(),
    itemsCount: -1,
  }),
  watch: {
    reportPeriod() {
      if (this.reportPeriod === 'custom' && this.dates.length < 2) {
        return;
      }
      this.updateBreakdown();
    },
    dates() {
      if (this.reportPeriod !== 'custom' || this.dates.length < 2) {
        return;
      }
      this.updateBreakdown();
    },
    breakdown() {
      this.updateBreakdown();
    },
  },
  mounted() {
    this.updateBreakdown();
  },
  methods: {
    async updateBreakdown() {
      const breakdown = this.breakdownsList.find((bd) => bd.value === this.breakdown);
      if (!breakdown) {
        return;
      }
      this.headers.splice(0, 1, {
        text: breakdown.text,
        align: 'start',
        sortable: true,
        value: breakdown.value,
      });
      this.items = [];
      this.breakdownLoading = true;
      try {
        const response = await this.$apollo.query<Breakdown, BreakdownVariables>({
          query: BreakDownQuery,
          variables: {
            customPeriod: this.dates,
            entity: this.breakdown,
            periodType: this.reportPeriod,
            page: this.page,
            limit: this.itemsPerPage,
            orderBy: this.sortBy[0],
            orderAsc: !this.sortDesc[0],
          },
          fetchPolicy: 'network-only',
        });
        if (!response.data.breakdown) {
          return;
        }
        this.itemsCount = response.data.breakdown.count;
        this.items = response.data.breakdown.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.breakdownLoading = false;
      }
    },
  },
});
</script>
