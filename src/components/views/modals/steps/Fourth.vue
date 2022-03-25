<template>
  <v-form ref="form">
    <v-row>
      <v-col>
        <v-row class="bg-gray">
          <v-col>
            <v-row>
              <v-col>
                <h3 class="text-primary">Visits</h3>
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
                    Visits: [Optional] This is how you control the amount of traffic you
                    will receive.<br/>
                    You can set caps per day, week or month or any combination of the three.<br/>
                    Leaving a field empty means there is no limit for it.
                  </span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0">
                <v-text-field
                  v-model="offer.caps.clicks_day"
                  type="number"
                  min="0"
                  label="Daily"
                />
              </v-col>
              <v-col class="pt-0">
                <v-text-field
                  v-model="offer.caps.clicks_week"
                  type="number"
                  min="0"
                  label="Weekly"
                />
              </v-col>
              <v-col class="pt-0">
                <v-text-field
                  v-model="offer.caps.clicks_month"
                  type="number"
                  min="0"
                  label="Monthly"
                />
              </v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col class="pt-0">
                <h3 class="text-primary float-left">Conversions</h3>
              </v-col>
              <v-col class="pt-0">
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
                    Conversions: [Optional] This is how you control how many purchases are made on
                    your offer.<br/>
                    You can set caps per day, week or month or any combination of the three.<br/>
                    Leaving a field empty means there is no limit for it.
                  </span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col class="pt-0">
                <v-text-field
                  v-model="offer.caps.sales_day"
                  type="number"
                  min="0"
                  label="Daily"
                />
              </v-col>
              <v-col class="pt-0">
                <v-text-field
                  v-model="offer.caps.sales_week"
                  type="number"
                  min="0"
                  label="Weekly"
                />
              </v-col>
              <v-col class="pt-0">
                <v-text-field
                  v-model="offer.caps.sales_month"
                  type="number"
                  min="0"
                  label="Monthly"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <h3 class="text-primary pb-6">Activity Period</h3>
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
                    Activity Period: [Optional] You can decide when your offer is active,<br>
                    meaning ready to receive traffic.
                    You can choose when it starts being active, when it stops or both.<br/>
                    Leaving both fields empty means the status of this offer is determined by
                    the Network.
                  </span>
                </v-tooltip>
              </v-col>
            </v-row>
            <date-picker
              title="From"
              :date="start_date"
              :max="end_date"
              :change="setStartDate"
            />
            <div class="mt-5">
              <date-picker
                title="To"
                :date="end_date"
                :min="start_date"
                :change="setEndDate"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="text-primary">
              <h3 class="float-left daily_budget">Estimated Daily Budget</h3>
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    class="info-btn primary out-of-input float-left"
                    v-bind="attrs"
                    v-on="on"
                  >
                    i
                  </div>
                </template>
                <span>
                  Estimated Daily Budget: This is calculated by multiplying your<br/>
                  Daily Conversion limit and your default Price for this offer.
                </span>
              </v-tooltip>
            </span>
            <div class="clearB">
              {{
                offer.caps.sales_day > 0
                  ? '$ ' + (Math.round(offer.payin * offer.caps.sales_day * 100) / 100)
                  : 'N/A'
              }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">

import Vue from 'vue';
import { DateTime } from 'luxon';
import DatePicker from '@/components/inputs/DatePicker.vue';

export default Vue.extend({
  components: {
    DatePicker,
  },
  props: {
    offer: Object,
  },
  data() {
    return {
    };
  },
  computed: {
    start_date(): string | null {
      if (this.offer.caps.start_date) {
        return DateTime.fromMillis(this.offer.caps.start_date).toISODate();
      }
      return null;
    },
    end_date(): string | null {
      if (this.offer.caps.end_date) {
        return DateTime.fromMillis(this.offer.caps.end_date).toISODate();
      }
      return null;
    },
  },
  methods: {
    setStartDate(date: string) {
      this.offer.caps.start_date = DateTime.fromISO(date, { zone: 'utc' }).valueOf();
    },
    setEndDate(date: string) {
      this.offer.caps.end_date = DateTime.fromISO(date, { zone: 'utc' }).valueOf();
    },
    validate() {
      return (this.$refs.form as HTMLFormElement).validate();
    },
  },
});
</script>
<style>
.daily_budget {
  line-height: 1.7;
  margin-right: 10px;
}
.clearB {
  clear:both;
  width: 100%;
}

</style>
