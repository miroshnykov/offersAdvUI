<template>
  <div>
    <v-row class="mt-3">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Last 7 Days</v-card-title>
          <v-card-text>
            <ReportChart />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <div>Top 5 Offers</div>
            <div>
              <v-btn
                color="primary"
                dark
                @click="createOffer"
              >
                Create
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <BreakDown hide-details/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ReportChart from '@/components/views/reports/ReportChart.vue';
import BreakDown from '@/components/views/reports/BreakDown.vue';
import { event } from '@/utils/eventBus';

export default Vue.extend({
  name: 'Home',
  components: { ReportChart, BreakDown },
  data() {
    return {
      headers: [
        {
          text: 'Campaigns',
          align: 'start',
          sortable: true,
          value: 'campaign',
        },
        { text: 'Clicks', value: 'clicks' },
        { text: 'Conversions', value: 'conversions' },
        { text: 'Ratio', value: 'ratio' },
        { text: 'Revenue', value: 'revenue' },
      ],
      campaigns: [
        {
          campaign: 'Multimedia AllMedia',
          clicks: 159,
          conversions: 80,
          ratio: '50%',
          revenue: 880,
        },
        {
          campaign: 'VPN Solutions',
          clicks: 80,
          conversions: 30,
          ratio: '37%',
          revenue: 300,
        },
        {
          campaign: 'E-Book Library',
          clicks: 69,
          conversions: 45,
          ratio: '75%',
          revenue: 348.58,
        },
        {
          campaign: 'Software Activation Codes',
          clicks: 542,
          conversions: 54,
          ratio: '10%',
          revenue: 212.43,
        },
        {
          campaign: 'IPTV Playlists',
          clicks: 120,
          conversions: 15,
          ratio: '10%',
          revenue: 150,
        },
      ],
      chartOptions: {
        chart: {
          id: 'reports',
          toolbar: {
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            },
          },
        },
        xaxis: {
          categories: ['2021-07-03', '2021-07-14', '2021-07-15', '2021-07-16', '2021-07-17', '2021-07-18', '2021-07-19'],
        },
        colors: ['#61b0ea', '#eb9e0b'],
      },
      series: [
        {
          name: 'Clicks',
          data: [15, 54, 68, 71, 55, 62, 67],
        },
        {
          name: 'Conversions',
          data: [5, 32, 40, 41, 30, 38, 37],
        },
      ],
    };
  },
  created() {
    if (localStorage.getItem('flash')) {
      event.$emit('alert', {
        type: 'success',
        message: localStorage.getItem('flash') || '',
      });
      localStorage.removeItem('flash');
    }
  },
  methods: {
    createOffer() {
      event.$emit('createOffer');
    },
  },
});
</script>
