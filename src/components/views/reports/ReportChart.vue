<template>
  <div class="about">
    <div v-if="graphLoading" class="graph-loader">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <apexchart v-else type="line" height="300px" :options="chartOptions" :series="series"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ReportsQuery } from '@/graphql/Reports';
import { Reports, ReportsVariables } from '@/graphql/__generated__/Reports';

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
  },
  data: () => ({
    graphLoading: true,
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
      colors: [
        '#188D83',
        '#171E66',
      ],
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
  }),
  watch: {
    reportPeriod() {
      if (this.reportPeriod === 'custom' && this.dates.length < 2) {
        return;
      }
      this.getChartReports();
    },
    dates() {
      if (this.reportPeriod !== 'custom' || this.dates.length < 2) {
        return;
      }
      this.getChartReports();
    },
  },
  mounted() {
    this.getChartReports();
  },
  methods: {
    async getChartReports() {
      type Variables = {
        periodType: string,
        customPeriod?: string[]
      };
      const variables:Variables = {
        periodType: this.reportPeriod,
      };
      if (this.reportPeriod === 'custom') {
        if (this.dates.length >= 2) {
          variables.customPeriod = this.dates;
        } else {
          return;
        }
      }
      try {
        this.graphLoading = true;
        const response = await this.$apollo.query<Reports, ReportsVariables>({
          query: ReportsQuery,
          variables,
        });
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories: response.data.reports!.dates,
            },
          },
        };
        const series = [...this.series];
        series[0].data = response.data.reports!.clicks;
        series[1].data = response.data.reports!.conversions;
        this.series = [...series];
      } catch (error) {
        console.error(error);
      } finally {
        this.graphLoading = false;
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.graph-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 315px;
}
</style>
