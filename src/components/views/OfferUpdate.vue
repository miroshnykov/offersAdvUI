<template>
  <div v-if="!$apollo.queries.getOffer.loading">
    <v-row>
      <v-col>
        <h1>Edit Offer</h1>
      </v-col>
      <v-col>
        <v-btn color="primary float-right" @click="save">Save</v-btn>
      </v-col>
    </v-row>
    <v-form ref="form">
      <v-card>
        <v-card-text>
          <v-row align="center">
            <v-col class="id_block">Id: {{ getOffer.id }}</v-col>
            <v-col align="center">
              <v-text-field
                outlined
                style="width: 150px;"
                label="Name"
                :rules="rules.name"
                v-model="getOffer.name"
              />
            </v-col>
            <v-col class="status_block">
              <div>
                Offer manager:
                <span style="text-transform: capitalize;">
                {{ getOffer.advertiser_manager }}
              </span>
              </div>
              <div>
                Status:
                <Status :status="getOffer.status"/>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card style="margin-top: 20px;">
        <v-card-title>General</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-textarea
                outlined
                hide-details
                label="Description"
                v-model="getOffer.descriptions"
              />
              <v-row>
                <v-col>
                  Default LP: {{display_lp}}
                  <v-text-field
                    class="hidden-text-field"
                    hidden
                    :value="getDefaultLanding"
                    :rules="rules.landing"
                  />
                </v-col>
              </v-row>
              <Landings
                :landings="getOffer.landings"
                :customLandings="getOffer.customLandings"
                :change="onChangeLandings"
              />
            </v-col>
            <v-col>
              <div>
                <v-select
                  outlined
                  label="Vertical"
                  :items="getOffer.verticals"
                  item-text="name"
                  item-value="id"
                  v-model="getOffer.sfl_vertical_id"
                />
              </div>
              <div>
                Conversion Flow Type:
                <v-radio-group v-model="getOffer.conversion_type" row>
                  <v-radio label="CPI" value="cpi"/>
                  <v-radio label="CPA" value="cpa"/>
                  <v-radio label="CPC" value="cpc"/>
                </v-radio-group>
              </div>

              <v-row style="flex-wrap: nowrap;">
                <v-col style="flex: 1 1 auto;">
                  <v-text-field
                    outlined
                    hide-details
                    label="Postback url"
                    class="text-grey lighten-1"
                    v-model="getOffer.token"
                    disabled
                  />
                </v-col>
                <v-col>
                  <v-btn large color="primary" @click="copy(getOffer.token)">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card style="margin-top: 20px;">
        <v-card-title>Pay</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-select
                outlined
                label="Currency"
                :items="getOffer.currencies"
                item-text="abbr"
                item-value="id"
                v-model="getOffer.currency_id"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                label="Pay in"
                v-model="getOffer.payin"
                :rules="rules.payin"
                min="0"
                type="number"
              />
            </v-col>
          </v-row>
          <PayIn
            :customPayIn="getOffer.customPayin"
            :change="onChangeCustomPayIn"
          />
        </v-card-text>
      </v-card>
      <v-card style="margin-top: 20px;">
        <v-card-title>GEO Settings</v-card-title>
        <v-card-text>
          Banned Countries: {{ countryList.length ? countryList.join(', ') : '-' }}
          <div>
            <Country :list="countryList" :change="onChangeCountry"/>
          </div>
        </v-card-text>
      </v-card>
      <v-card style="margin-top: 20px;">
        <v-card-title>Caps</v-card-title>
        <v-card-text>
          <span v-if="getOffer.caps.enabled">
            Sales cap: Daily - {{ getOffer.caps.sales_day }},
              Weekly - {{ getOffer.caps.sales_week }},
              Monthly - {{ getOffer.caps.sales_month }}
            <br/>
            Clicks cap: Daily - {{ getOffer.caps.clicks_day }},
              Weekly - {{ getOffer.caps.clicks_week }},
              Monthly - {{ getOffer.caps.clicks_month }}
            <br/>
            <span v-if="getOffer.caps.use_start_end_date">
              Date cap: Start ({{toFormat(getOffer.caps.start_date)}})
              <span v-if="getOffer.caps.end_date">
                End ({{ toFormat(getOffer.caps.end_date) }})
              </span>
            </span>

          </span>
          <span v-else>
            Caps disabled
          </span>
          <div>
            <Caps :caps="getOffer.caps" :change="onChangeCaps"/>
          </div>
        </v-card-text>
      </v-card>
      <v-card style="margin-top: 20px;">
      <v-card-text>
        <v-row>
          <v-col>
            <v-checkbox
              label="Use date"
              v-model="getOffer.use_start_end_date"
              @change="() => $refs.form.validate()"
            />
          </v-col>
          <v-col>
            <DatePicker
              title="Start date"
              :date="start_date"
              :rules="rules.start_date"
              :max="end_date"
              :disabled="!getOffer.use_start_end_date"
              :change="setStartDate"
            />
          </v-col>
          <v-col>
            <DatePicker
              title="End date"
              :date="end_date"
              :min="start_date"
              :disabled="!getOffer.use_start_end_date"
              :change="setEndDate"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    </v-form>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { DateTime } from 'luxon';
import { OneOfferQuery } from '@/graphql/OfferQuery';
import DatePicker from '@/components/inputs/DatePicker.vue';
import {
  Offer_getOffer, Offer_getOffer_caps,
  Offer_getOffer_customLandings,
  Offer_getOffer_customPayin,
  Offer_getOffer_landings,
} from '@/graphql/__generated__/Offer';
import Landings from '@/components/views/modals/Landings.vue';
import Country from '@/components/views/modals/Country.vue';
import Caps from '@/components/views/modals/Caps.vue';
import PayIn from '@/components/views/modals/PayIn.vue';
import Status from '@/components/snipets/status.vue';

import { UpdateOfferMutation } from '@/graphql/UpdateOfferMutation';
import { UpdateOffer_updateOffer } from '@/graphql/__generated__/UpdateOffer';

export default Vue.extend({
  components: {
    DatePicker,
    Landings,
    Country,
    Caps,
    PayIn,
    Status,
  },
  apollo: {
    getOffer: {
      query: OneOfferQuery,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      result(res) {
        this.countryList = this.parseGeo(res.data.getOffer.geoRules);
      },
    },
  },
  data() {
    return {
      getOffer: {} as Offer_getOffer,
      countryList: new Array<string>(),
      valid: true,
      rules: [] as any,
    };
  },
  mounted() {
    this.rules = this.setRules();
  },
  computed: {
    start_date(): string | null {
      if (this.getOffer.start_date) {
        // TODO: hotfix must to be moved.
        if (this.getOffer.start_date.toString().length === 10) {
          return DateTime.fromSeconds(this.getOffer.start_date).toISODate();
        }
        return DateTime.fromMillis(this.getOffer.start_date).toISODate();
      }
      return null;
    },
    end_date(): string | null {
      if (this.getOffer.end_date) {
        // TODO: hotfix must to be moved.
        if (this.getOffer.end_date.toString().length === 10) {
          return DateTime.fromSeconds(this.getOffer.end_date).toISODate();
        }
        return DateTime.fromMillis(this.getOffer.end_date).toISODate();
      }
      return null;
    },
    display_lp(): string {
      if (this.getOffer.landings) {
        const defaultLP = this.getOffer.landings.find((l: Offer_getOffer_landings) => l.isDefault);
        if (defaultLP) {
          return `${defaultLP.name} (${defaultLP.url})`;
        }
      }
      return '-';
    },
    getDefaultLanding(): string {
      if (this.getOffer.landings) {
        const tmp = this.getOffer.landings.find((lp) => lp.isDefault);
        if (tmp) {
          return tmp.name;
        }
      }
      return '';
    },
  },
  methods: {
    toFormat(date: number) {
      // TODO: hot fix must to be moved.
      if (date) {
        if (date.toString().length === 10) {
          date *= 1000;
        }
        const d = new Date(date);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }
      return '';
    },
    setRules() {
      return {
        name: [
          (v: string) => !!v.trim() || 'Name is required',
        ],
        payin: [
          (v: number) => v > 0 || 'Pay in must be more then 0',
        ],
        landing: [
          (v: string) => !!v.trim() || 'Default landing is required',
        ],
        start_date: [
          (v: string) => !(this.getOffer.use_start_end_date && !v) || 'Start Date is required',
        ],
      };
    },
    copy(text: string) {
      if (!navigator.clipboard) {
        this.$toast.error('navigator.clipboard is not available');
        return;
      }
      navigator.clipboard.writeText(text).then(() => {
        this.$toast.info('Successfully copied');
      }, (err) => {
        this.$toast.error(`Async: Could not copy text: ${err}`);
      });
    },
    setStartDate(date: string) {
      this.getOffer.start_date = DateTime.fromISO(date, { zone: 'utc' }).valueOf();
    },
    setEndDate(date: string) {
      this.getOffer.end_date = DateTime.fromISO(date, { zone: 'utc' }).valueOf();
    },
    parseGeo(geo: string): Array<string> {
      try {
        return JSON.parse(geo).geo.map((i: { country: string }) => i.country);
      } catch (e) {
        return [];
      }
    },
    serializeGeo(geo: string[]): string {
      return JSON.stringify({
        geo: geo.map((i: string) => ({
          country: i,
          include: true,
        })),
      });
    },
    onChangeCountry(countries: string[]) {
      this.countryList = countries;
      this.getOffer.geoRules = this.serializeGeo(this.countryList);
    },
    onChangeLandings(
      landings: Offer_getOffer_landings[],
      customLandings: Offer_getOffer_customLandings[],
    ) {
      this.getOffer.landings = landings;
      this.getOffer.customLandings = customLandings;
    },
    onChangeCaps(caps: Offer_getOffer_caps) {
      this.getOffer.caps = caps;
    },
    onChangeCustomPayIn(customPayIn: Offer_getOffer_customPayin[]) {
      this.getOffer.customPayin = customPayIn;
    },
    async save() {
      if (this.$refs.form && (this.$refs.form as HTMLFormElement).validate()) {
        await this.$apollo.mutate({
          mutation: UpdateOfferMutation,
          variables: {
            offer: {
              id: this.getOffer.id,
              name: this.getOffer.name,
              conversion_type: this.getOffer.conversion_type,
              currency_id: this.getOffer.currency_id,
              descriptions: this.getOffer.descriptions,
              start_date: this.getOffer.start_date,
              end_date: this.getOffer.end_date,
              payin: parseFloat(this.getOffer.payin.toString()),
              sfl_vertical_id: this.getOffer.sfl_vertical_id,
              geoRules: this.serializeGeo(this.countryList),
              use_start_end_date: this.getOffer.use_start_end_date,
              customPayin: this.getOffer.customPayin.map((cpi) => ({
                id: cpi.id,
                geo: cpi.geo,
                payin: parseFloat(cpi.payin.toString()),
              })),
              customLandings: this.getOffer.customLandings
                .map((lp: Offer_getOffer_customLandings) => ({
                  id: lp.id,
                  country: lp.country,
                  name: lp.name,
                  pos: lp.pos,
                  url: lp.url,
                })),
              landings: this.sendLp(),
              caps: {
                enabled: this.getOffer.caps.enabled ? 1 : 0,

                clicks_day: parseInt(this.getOffer.caps.clicks_day.toString(), 10),
                clicks_week: parseInt(this.getOffer.caps.clicks_week.toString(), 10),
                clicks_month: parseInt(this.getOffer.caps.clicks_month.toString(), 10),

                sales_day: parseInt(this.getOffer.caps.sales_day.toString(), 10),
                sales_week: parseInt(this.getOffer.caps.sales_week.toString(), 10),
                sales_month: parseInt(this.getOffer.caps.sales_month.toString(), 10),

                end_date: this.getOffer.caps.end_date,
                start_date: this.getOffer.caps.start_date,
                use_start_end_date: this.getOffer.caps.use_start_end_date,
              },

              offer_id_redirect: this.getOffer.offer_id_redirect,
              is_cpm_option_enabled: this.getOffer.is_cpm_option_enabled,
            } as UpdateOffer_updateOffer,
          },
        });
        this.$toast.success('Offer updated!');
      }
    },
    sendLp() {
      if (this.getOffer.landings) {
        return this.getOffer.landings.map((lp: Offer_getOffer_landings) => ({
          isDefault: lp.isDefault,
          name: lp.name,
          id: lp.id,
          url: lp.url,
        }));
      }
      return [];
    },
  },
});
</script>
<style lang="scss">
.hidden-text-field .v-input__slot {
  display: none;
}
.id_block {
  max-width: 300px;
}
.status_block {
  max-width: 300px;
  text-align: right;
}
</style>
