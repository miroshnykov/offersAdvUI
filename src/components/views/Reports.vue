<template>
  <v-card>
    <v-card-text>
      <v-row align="center" class="mb-3">
        <v-col cols="12" sm="5">
          <h1>Analytics</h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col v-if="reportPeriod === 'custom'" cols="12" sm="4" md="3">
          <v-menu
            ref="menu"
            v-model="datePicker"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-bind="attrs"
                v-on="on"
                v-model="dateRangeText"
                label="Date range"
                prepend-inner-icon="mdi-calendar"
                dense
                hide-details
                readonly
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" no-title scrollable range>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="updateDates">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-select
            :items="reportPeriodItems"
            v-model="reportPeriod"
            dense
            label="Period"
            hide-details
          ></v-select>
        </v-col>
      </v-row>
      <ReportChart :report-period="reportPeriod" :dates="reportDates"/>
      <div class="mt-5">
        <v-row align="center" class="mb-3">
          <v-col cols="12" sm="auto" class="pr-0">
            <h3 class="mb-0">Breakdown by</h3>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="breakdown"
              :items="breakdownsList"
              dense
              hide-details
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <BreakDown :report-period="reportPeriod" :dates="reportDates" :breakdown="breakdown"/>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import ReportChart from '@/components/views/reports/ReportChart.vue';
import BreakDown from '@/components/views/reports/BreakDown.vue';

export default Vue.extend({
  name: 'Reports',
  components: { ReportChart, BreakDown },
  data: () => ({
    datePicker: false,
    dates: [] as string[],
    reportPeriod: 'last7days',
    reportDates: [] as string[],
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
    breakdown: 'offer',
    reportPeriodItems: [
      { text: 'Last 7 Days', value: 'last7days' },
      { text: 'Last 30 Days', value: 'last30days' },
      { text: 'This Month', value: 'thisMonth' },
      { text: 'Last Month', value: 'lastMonth' },
      { text: 'Custom Period', value: 'custom' },
    ],
  }),
  methods: {
    updateDates() {
      (this.$refs.menu as Vue & { save: (dates: string[]) => void }).save(this.dates);
      this.reportDates = this.dates;
    },
  },
  watch: {
    reportPeriod() {
      if (this.reportPeriod === 'custom') {
        this.datePicker = true;
      }
    },
  },
  computed: {
    dateRangeText(): string {
      return this.dates.join(' ~ ');
    },
  },
});
</script>
