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
        Caps
      </v-btn>
    </template>
    <v-form ref="form" v-model="validate">
      <v-card>
        <v-card-title>
          <span class="text-h5">Caps</span>
        </v-card-title>
        <v-card-text>
          <v-checkbox
            label="Use caps"
            v-model="capsEdit.enabled"
          />
          <span class="text-h6 text--secondary text--lighten-3">Conversion Cap</span>
          <v-row>
            <v-col>
              <v-text-field
                outlined
                :disabled="!capsEdit.enabled"
                v-model="capsEdit.sales_day"
                type="number"
                label="Amount(Day)"
                min="0"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                :disabled="!capsEdit.enabled"
                v-model="capsEdit.sales_week"
                type="number"
                label="Amount(Week)"
                min="0"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                :disabled="!capsEdit.enabled"
                v-model="capsEdit.sales_month"
                type="number"
                label="Amount(Month)"
                min="0"
              />
            </v-col>
          </v-row>
          <span class="text-h6 text--secondary text--lighten-3">Clicks Cap</span>
          <v-row>
            <v-col>
              <v-text-field
                outlined
                :disabled="!capsEdit.enabled"
                v-model="capsEdit.clicks_day"
                type="number"
                label="Amount(Day)"
                min="0"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                :disabled="!capsEdit.enabled"
                v-model="capsEdit.clicks_week"
                type="number"
                label="Amount(Week)"
                min="0"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                :disabled="!capsEdit.enabled"
                v-model="capsEdit.clicks_month"
                type="number"
                label="Amount(Month)"
                min="0"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-checkbox
                label="Use date"
                :disabled="!capsEdit.enabled"
                v-model="capsEdit.use_start_end_date"
                @change="() => $refs.form.validate()"
              />
            </v-col>
            <v-col>
              <DatePicker
                title="Start date"
                :date="start_date"
                :max="end_date"
                :rules="rules.start_date"
                :disabled="!capsEdit.use_start_end_date"
                :change="setStartDate"
              />
            </v-col>
            <v-col>
              <DatePicker
                title="End date"
                :date="end_date"
                :min="start_date"
                :disabled="!capsEdit.use_start_end_date"
                :change="setEndDate"
              />
            </v-col>
          </v-row>
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
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { DateTime } from 'luxon';
import { Offer_getOffer_caps } from '@/graphql/__generated__/Offer';
import DatePicker from '@/components/inputs/DatePicker.vue';

export default Vue.extend({
  props: {
    caps: Object,
    change: Function,
  },
  components: {
    DatePicker,
  },
  data() {
    return {
      validate: true,
      isVisible: false,
      capsEdit: {} as Offer_getOffer_caps,
      rules: [] as any,
    };
  },
  mounted() {
    this.capsEdit = { ...this.caps };
    this.rules = this.setRules();
  },
  computed: {
    start_date(): string | null {
      if (this.capsEdit.start_date) {
        // TODO: hotfix must to be moved.
        if (this.capsEdit.start_date.toString().length === 10) {
          return DateTime.fromSeconds(this.capsEdit.start_date).toISODate();
        }
        return DateTime.fromMillis(this.capsEdit.start_date).toISODate();
      }
      return null;
    },
    end_date(): string | null {
      if (this.capsEdit.end_date) {
        // TODO: hotfix must to be moved.
        if (this.capsEdit.end_date.toString().length === 10) {
          return DateTime.fromSeconds(this.capsEdit.end_date).toISODate();
        }
        return DateTime.fromMillis(this.capsEdit.end_date).toISODate();
      }
      return null;
    },
  },
  methods: {
    setRules() {
      return {
        start_date: [
          (v: string) => !(this.capsEdit.use_start_end_date && !v) || 'Start Date is required',
        ],
      };
    },
    setStartDate(date: string) {
      this.capsEdit.start_date = DateTime.fromISO(date, { zone: 'utc' }).valueOf();
    },
    setEndDate(date: string) {
      this.capsEdit.end_date = DateTime.fromISO(date, { zone: 'utc' }).valueOf();
    },
    onOk() {
      if ((this.$refs.form as HTMLFormElement).validate()) {
        this.isVisible = false;
        if (this.change) {
          this.change(this.capsEdit);
        }
      }
    },
    onCancel() {
      this.isVisible = false;
      this.capsEdit = { ...this.caps };
      this.capsEdit.start_date = this.caps.start_date;
      this.capsEdit.end_date = this.caps.end_date;
    },
  },
});
</script>
