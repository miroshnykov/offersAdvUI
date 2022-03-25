<template>
  <v-form class="create-offer">
    <v-dialog
      v-model="isVisible"
      persistent
      width="838"
      v-if="0 < offer.step && maxStep >= offer.step"
    >
      <v-card class="pa-4">
        <v-card-title>
          <v-row>
            <v-col>
              <span class="text-h4">Create Offer</span>
            </v-col>
            <v-col>
              <StepProgress
                :name="stepNames[offer.step - 1]"
                :steps-count="maxStep"
                :step="offer.step"
              />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text style="min-height: 470px; max-height: 470px;">
          <First v-if="offer.step === 1" :offer="offer" ref="step1"/>
          <Second v-if="offer.step === 2" :offer="offer" ref="step2"/>
          <Third v-if="offer.step === 3" :offer="offer" ref="step3"/>
          <Fourth v-if="offer.step === 4" :offer="offer" ref="step4"/>
          <Fifth v-if="offer.step === 5" :offer="offer" ref="step5"/>
          <Sixth v-if="offer.step === 6" ref="step6"/>
          <Seventh v-if="offer.step === 7" :offer="offer" ref="step7"/>
          <Eighth v-if="offer.step === 8" :offer="offer" ref="step8"/>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            x-large
            @click="showCancel"
            v-if="offer.step !== 8"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            x-large
            to="/offers"
            @click="cancel"
            v-if="offer.step === 8 && $route.path !== '/offers'"
          >
            Go to offers page
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            x-large
            @click="cancel"
            color="primary"
            v-if="offer.step === 8"
          >
            Close
          </v-btn>
          <v-btn
            text
            x-large
            v-if="offer.step === 8"
            @click="createAnother"
          >
            Create another offer
          </v-btn>
          <v-btn
            x-large
            color="primary"
            v-if="offer.step !== 1 && offer.step !== 8"
            @click="prev"
          >&#60;&#60; Back</v-btn>
          <v-btn
            x-large
            color="primary"
            @click="next"
            v-if="offer.step !== 8"
          >
            Next >>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isCancelVisible"
      persistent
      max-width="838px"
    >
      <v-card class="pa-4 cancel-modal">
        <v-card-title class="text-primary">You have barely started!</v-card-title>
        <v-card-text>
          If you cancel now, nothing will be saved. <br/>
          Are you sure?
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="isCancelVisible = false"
            class="xx-large"
            text
          >No, lets resume</v-btn>
          <v-spacer/>
          <v-btn
            @click="cancel"
            color="primary"
            class="xx-large"
          >Yes, i'm sure</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isNotFinished"
      persistent
      max-width="838px"
    >
      <v-card class="pa-4 cancel-modal">
        <v-card-title class="text-primary">You’re not finished!</v-card-title>
        <v-card-text style="font-size: 24px !important;">
          The partial offer you have created will be available in the<br/>
          Offers page. You can always click edit and finalize it later.<br/>
          <br/>
          Are you sure you want to pause now?
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="isNotFinished = false"
            class="xx-large"
            text
          >No, lets resume</v-btn>
          <v-spacer/>
          <v-btn
            @click="cancel"
            color="primary"
            class="xx-large"
          >Yes, i'm sure</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import First from '@/components/views/modals/steps/First.vue';
import Second from '@/components/views/modals/steps/Second.vue';
import Third from '@/components/views/modals/steps/Third.vue';
import Fourth from '@/components/views/modals/steps/Fourth.vue';
import Fifth from '@/components/views/modals/steps/Fifth.vue';
import Sixth from '@/components/views/modals/steps/Sixth.vue';
import Seventh from '@/components/views/modals/steps/Seventh.vue';
import Eighth from '@/components/views/modals/steps/Eighth.vue';
import { CreateOfferMutation } from '@/graphql/CreateOfferMutation';
import { UpdateOfferMutation } from '@/graphql/UpdateOfferMutation';
import { event } from '@/utils/eventBus';
import { OneOfferQuery } from '@/graphql/OfferQuery';
import StepProgress from '@/components/includes/StepProgress.vue';

export default Vue.extend({
  components: {
    Eighth,
    Seventh,
    First,
    Second,
    Third,
    Fourth,
    Fifth,
    Sixth,
    StepProgress,
  },
  data() {
    return {
      isValid: true,
      isVisible: false,
      isCancelVisible: false,
      isNotFinished: false,
      maxStep: 8,
      offer: {} as any,
      stepNames: [
        'Main info',
        'Landing',
        'Pricing',
        'Budget Limit',
        'Allow/Block Countries',
        'Integration',
        'Review info',
        'Congratulations',
      ],
    };
  },
  mounted() {
    const json = localStorage.getItem('offers');
    if (!json) {
      localStorage.setItem('offers', '{}');
    }

    this.offer = this.nullify();
    event.$on('createOffer', () => {
      this.isVisible = true;
      this.offer = this.nullify();
    });
    event.$on('updateOffer', async (id: number) => {
      const res = await this.$apollo.query({
        query: OneOfferQuery,
        variables: {
          id,
        },
      });

      this.isVisible = true;
      this.updateOfferData(res.data.getOffer);
    });
  },
  methods: {
    parseGeo(geo: string): Array<any> {
      try {
        let json = JSON.parse(geo).geo;
        if (!json.length) {
          json = [{
            country: '',
            include: true,
          }];
        }
        return json;
      } catch (e) {
        return [{
          country: '',
          include: true,
        }];
      }
    },
    nullify() {
      return {
        // Vue fields
        blockCountries: 'Block',
        integration: 'Milkbox',
        // DB fields
        name: '',
        descriptions: '',
        sfl_vertical_id: 0,
        currency_id: 1,
        payin: 0,
        step: 1,
        landings: [
          {
            name: '',
            url: '',
            isDefault: true,
          },
        ],
        caps: {
          sales_day: '',
          sales_week: '',
          sales_month: '',

          clicks_day: '',
          clicks_week: '',
          clicks_month: '',

          start_date: null,
          end_date: null,
        },
        countries: [{
          country: '',
          include: true,
        }],
        customPayin: [{
          id: null,
          geo: '',
          payin: 0,
        }],
        use_start_end_date: false,
      };
    },
    next() {
      const a = this.$refs[`step${this.offer.step}`] as any;
      if (this.offer.step <= 5) {
        if (a.validate()) {
          if (this.offer.step < this.maxStep) {
            this.offer.step += 1;
            this.$nextTick(() => this.save());
          }
        }
      } else if (this.offer.step < this.maxStep) {
        this.offer.step += 1;
        this.$nextTick(() => this.save());
      }
    },
    prev() {
      this.offer.step -= 1;
    },
    cancel() {
      this.isCancelVisible = false;
      this.isNotFinished = false;
      this.isVisible = false;
      this.offer = this.nullify();
      this.offer.step = 1;
      event.$emit('reloadOffers');
    },
    showCancel() {
      if (this.offer.step === 1) {
        this.isCancelVisible = true;
      } else {
        this.isNotFinished = true;
      }
    },
    createAnother() {
      this.offer = this.nullify();
      this.offer.step = 1;
    },
    async save() {
      if (!this.offer.id) {
        const res = await this.$apollo.mutate({
          mutation: CreateOfferMutation,
          variables: {
            name: this.offer.name,
            step: this.offer.step,
          },
        });
        this.offer.id = res.data.createOffer.id;
      } else {
        const json = localStorage.getItem('offers')!;
        const offers = JSON.parse(json);
        if (!offers[this.offer.id]) {
          offers[this.offer.id] = {};
        }
        if (this.offer.step === this.maxStep) {
          delete offers[this.offer.id];
        } else {
          offers[this.offer.id].blockCountries = this.offer.blockCountries;
          offers[this.offer.id].integration = this.offer.integration;
        }
        localStorage.setItem('offers', JSON.stringify(offers));

        await this.$apollo.mutate({
          mutation: UpdateOfferMutation,
          variables: {
            offer: {
              ...this.convertedOffer(),
            },
          },
          refetchQueries: (res: any) => {
            res.data.updateOffer.step = this.offer.step;
            this.updateOfferData(res.data.updateOffer);
            return res;
          },
        });
      }
    },
    countryToGeo() {
      let geo = '{"geo":[]}';
      if (this.offer.countries[0].country) {
        geo = JSON.stringify({
          geo: this.offer.countries,
        });
      }
      return geo;
    },
    convertedOffer() {
      return {
        step: this.offer.step,

        id: this.offer.id,
        name: this.offer.name,
        descriptions: this.offer.descriptions,
        sfl_vertical_id: this.offer.sfl_vertical_id,
        currency_id: this.offer.currency_id,
        payin: parseFloat(this.offer.payin),
        landings: this.offer.landings.map((lp: any) => ({
          id: lp.id,
          isDefault: lp.isDefault,
          name: lp.name,
          url: lp.url,
        })),
        conversion_type: 'cpi',
        offer_id_redirect: 0,
        is_cpm_option_enabled: false,
        caps: {
          enabled: this.checkIsEnabled(),
          sales_day: this.safeCaps(this.offer.caps.sales_day),
          sales_week: this.safeCaps(this.offer.caps.sales_week),
          sales_month: this.safeCaps(this.offer.caps.sales_month),

          clicks_day: this.safeCaps(this.offer.caps.clicks_day),
          clicks_week: this.safeCaps(this.offer.caps.clicks_week),
          clicks_month: this.safeCaps(this.offer.caps.clicks_month),

          use_start_end_date: true,
          start_date: this.offer.caps.start_date,
          end_date: this.offer.caps.end_date,
        },
        geoRules: this.countryToGeo(),
        customPayin: this.safeCustomPayin(this.offer.customPayin),
        use_start_end_date: false,
      };
    },
    safeCustomPayin(payins: Array<any>): Array<any> {
      const res = new Array<any>();
      payins.forEach((payin) => {
        if (payin.geo && payin.payin) {
          res.push({
            id: null,
            geo: payin.geo,
            payin: parseFloat(payin.payin),
          });
        }
      });
      return res;
    },
    safeCaps(cap: any): number {
      if (cap) {
        return parseInt(cap, 10);
      }
      return 0;
    },
    checkIsEnabled() {
      return (this.offer.caps.sales_day
        || this.offer.caps.sales_week
        || this.offer.caps.sales_month
        || this.offer.caps.clicks_day
        || this.offer.caps.clicks_week
        || this.offer.caps.clicks_month) ? 1 : 0;
    },
    updateOfferData(offer: any) {
      this.offer = offer;
      this.loadFromLocal(offer.id);
      this.offer.countries = this.parseGeo(offer.geoRules);
      if (!this.offer.landings.length) {
        this.offer.landings.push({
          name: '',
          url: '',
          isDefault: true,
        });
      }
      if (!this.offer.customPayin.length) {
        this.offer.customPayin.push({
          id: null,
          geo: '',
          payin: 0,
        });
      }
    },
    loadFromLocal(id: number) {
      const json = localStorage.getItem('offers')!;
      const offers = JSON.parse(json) as any;
      if (offers[id]) {
        this.offer.blockCountries = offers[id].blockCountries;
        this.offer.integration = offers[id].integration;
      } else {
        this.offer.blockCountries = 'Block';
        this.offer.integration = 'Milkbox';
      }
    },
  },
  computed: {
    progress(): number {
      if (this.offer.step) {
        return (this.offer.step / this.maxStep) * 100;
      }
      return 0;
    },
  },
});
</script>

<style lang="scss">
.stepper {
  font-size: 1.3rem !important;
  text-align: center;
  width: 320px;
  color: var(--v-primary-base) !important;
}
.info-btn {
  font-family: 'Alex Brush', cursive;
  font-size: 25px;
  padding: 1px 10.5px;
  border-radius: 100%;
  color: white;
  position: relative;
  top: -30px;
  cursor: pointer;
  &.info-button {
    top: 18px;
    padding: 7px 11px 5px;
    width: 32px;
  }
}
.out-of-input {
  top: 0;
  padding: 5px 12px;
}

.scrollable {
  height: 270px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 20px;
}
.bg-gray-darken {
  background-color: #C4C4C4 !important;
}
.btn-yellow {
  background-color: #FDCF5A !important;
}
.create-offer {
  font-family: Roboto;
}
.cancel-button {
  background-color: #828988 !important;
  color: #fff !important;
}
.cancel-modal {
  .v-card__text,
  .v-card__title {
    display: block;
    font-size: 36px !important;
    text-align: center;
    line-height: 1 !important;
    font-weight: normal !important;
  }
  .v-card__title {
    padding: 30px 0 !important;
  }
  .v-card__text {
    padding: 44px 0 !important;
    display: block;
  }
}
</style>
