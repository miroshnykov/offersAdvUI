<template>
  <div>
    <v-stepper v-model="e1" elevation="0">
      <v-stepper-items>
<!--     Profile Step   -->
        <v-stepper-content step="1" class="py-0">
          <div class="px-4">
            <v-form ref="formStep1" v-model="validStep1" lazy-validation>
              <h2 class="text-center mb-4">Your Profile</h2>
              <div class="mb-4">
                <div class="my-field-group">
                  <label :for="`text_first_name`"><strong>First Name</strong></label>
                  <v-text-field
                    :solo="!step1.firstName"
                    :outlined="!!step1.firstName"
                    flat
                    id="text_first_name"
                    v-model="step1.firstName"
                    :rules="step1Rules.firstName"
                    placeholder="Your First Name"
                    required
                  ></v-text-field>
                </div>
                <div class="my-field-group">
                  <label :for="`text_last_name`"><strong>Last Name</strong></label>
                  <v-text-field
                    :solo="!step1.lastName"
                    :outlined="!!step1.lastName"
                    flat
                    id="text_last_name"
                    v-model="step1.lastName"
                    :rules="step1Rules.firstName"
                    placeholder="Your Last Name"
                    required
                  ></v-text-field>
                </div>
                <div class="my-field-group">
                  <label :for="`text_last_name`"><strong>Business Name or DBA</strong></label>
                  <v-text-field
                    :solo="!step1.businessName"
                    :outlined="!!step1.businessName"
                    flat
                    id="text_last_name"
                    v-model="step1.businessName"
                    :rules="step1Rules.businessName"
                    placeholder="Your Business Name"
                    required
                  ></v-text-field>
                </div>
                <div class="my-field-group">
                  <label>
                    <strong>What are your websites?</strong>
                  </label>
                  <template v-for="(n, i) in fieldsCount.websites">
                    <div :key="`field-websites-${i}`">
                      <v-text-field
                        @change="() => $refs.formStep1.validate()"
                        solo
                        flat
                        v-model="step1.websites[i].site"
                        :rules="[
                          () => isSiteValid(step1.websites[i].site, step1.websites[i].desc)
                        ]"
                        placeholder="Enter your website"
                      >
                        <template slot="append-outer">
                          <v-btn
                            v-if="i === fieldsCount.websites - 1"
                            color="primary"
                            height="48"
                            depressed
                            :class="{
                              hidden_signup: !isDisabledAddButton(
                                step1.websites[i].site,
                                step1.websites[i].desc
                              )
                            }"
                            @click="addWebSite">
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                          <v-btn v-else
                                 height="48"
                                 depressed
                                 @click="step1.websites.pop() && fieldsCount.websites--">
                            <v-icon>mdi-minus</v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                      <v-textarea
                        @change="() => $refs.formStep1.validate()"
                        v-model="step1.websites[i].desc"
                        :rules="[
                          () => isDescValid(step1.websites[i].desc, step1.websites[i].site)
                        ]"
                        solo
                        flat
                        placeholder="Describe the offer"
                      />
                    </div>
                  </template>
                </div>
                <div class="my-field-group">
                  <label>
                    <strong>What are other network(s) you worked with?</strong>
                  </label>
                  <v-text-field
                    v-for="(n, i) in fieldsCount.otherNetworks"
                    :key="`field-otherNetworks-${i}`"
                    :solo="!step1.otherNetworks[i]"
                    :outlined="!!step1.otherNetworks[i]"
                    flat
                    v-model="step1.otherNetworks[i]"
                    :rules="step1Rules.otherNetworks"
                    placeholder="Network name"
                  >
                    <template slot="append-outer">
                      <v-btn v-if="i === fieldsCount.otherNetworks - 1" color="primary"
                             height="48"
                             depressed
                             @click="step1.otherNetworks[i] && fieldsCount.otherNetworks++">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn v-else
                             height="48"
                             depressed
                             @click="fieldsCount.otherNetworks--">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
                <div class="my-field-group">
                  <label :for="`text_top_offers`">
                    <strong>Describe the products you would like to offer</strong>
                  </label>
                  <v-text-field
                    :solo="!step1.offeredProducts"
                    :outlined="!!step1.offeredProducts"
                    flat
                    id="text_top_offers"
                    v-model="step1.offeredProducts"
                    :rules="step1Rules.offeredProducts"
                    placeholder="example : Sweepstakes, "
                    required
                  ></v-text-field>
                </div>
              </div>
              <StepProgress name="Next: Our Terms & Conditions" step="1" steps-count="2"/>
              <v-row>
                <v-col>
                  <v-btn
                    block
                    color="primary"
                    depressed
                    :disabled="!validStep1"
                    @click="processStep1"
                  >
                    Continue
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-stepper-content>
        <!--   END  Profile Step   -->
        <!--  Terms and conditions  -->
        <v-stepper-content step="3" class="py-0">
          <div class="px-4">
            <v-form ref="formStep3" v-model="validStep3" lazy-validation>
              <h2 class="text-center mb-2">Our Terms & Conditions</h2>
              <p>You must review the Ad-Firm Terms & Conditions before
                you can continue working with Ad-Firm.
              </p>
              <v-card
                class="mb-4 text-card-scrollable"
                height="245px"
                color="#f6f6f6"
                elevation="0"
              >
                <v-card-text>
                  <h3 class="mb-2">Advertiser Agreement</h3>
                  <div @click="termsOfUse = true" style="cursor: pointer">
                    <TermsOfUse/>
                  </div>
                  <v-checkbox
                    @change="(e) => {
                        step3.readAgreements = e;
                        additional.isAgreementError = false;
                      }"
                    label="I have read and accept the Terms"
                  />
                </v-card-text>
              </v-card>

              <h4 class="mb-0">
                Please note that all products should adhere to our <br/>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a href="/" @click.stop.prevent="termsOfUse = true"
                       v-on="on"
                    >
                      Advertiser Terms
                    </a>
                  </template>
                  Opens in dialog
                </v-tooltip>,
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a href="/" @click.stop.prevent="privacyPolicy = true"
                       v-on="on"
                    >
                      Privacy Policy
                    </a>
                  </template>
                  Opens in dialog
                </v-tooltip>
                and
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a href="/" @click.stop.prevent="gdprPolicy = true"
                       v-on="on"
                    >
                      Cookies Policy
                    </a>
                  </template>
                  Opens in dialog
                </v-tooltip>
                Cookie Policy. In addition:</h4>
              <v-checkbox v-model="step3['safeData']" required :rules="step3Rules">
                <template v-slot:label>
                  <div>
                    All user data collected by the Advertiser will be protected,
                    according to privacy laws
                  </div>
                </template>
              </v-checkbox>
              <v-checkbox v-model="step3['safeGuidelines']" required :rules="step3Rules">
                <template v-slot:label>
                  <div>
                    All products and offers submitted by the Advertiser shall be in compliance with
                    all applicable consumer protection, regulatory and fair trade guidelines
                    as well as the policies supplied by the network
                  </div>
                </template>
              </v-checkbox>
              <v-checkbox v-model="step3['safeNetwork']" required :rules="step3Rules">
                <template v-slot:label>
                  <div>
                    The Advertiser must measure and alert the network of any problems with traffic
                    sources and/or complaints received relative to traffic sources.
                    The advertiser is responsible for blocking and must block any traffic
                    sources it does not want
                  </div>
                </template>
              </v-checkbox>
              <v-checkbox v-model="step3['selfTrademark']" required :rules="step3Rules">
                <template v-slot:label>
                  <div>
                    All trademarks, products, IPs must be owned and/or fully
                    licensed for use by the advertiser
                  </div>
                </template>
              </v-checkbox>
              <v-dialog
                v-model="gdprPolicy"
                width="600px"
              >
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Cookies Policy</span>
                  </v-card-title>
                  <v-card-text>
                    <GdprPolicy/>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="gdprPolicy = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog
                v-model="privacyPolicy"
                width="600px"
              >
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Privacy Policy</span>
                  </v-card-title>
                  <v-card-text>
                    <PrivacyPolicy/>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="privacyPolicy = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog
                v-model="termsOfUse"
                width="600px"
              >
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Advertiser Agreement</span>
                  </v-card-title>
                  <v-card-text>
                    <TermsOfUse/>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="termsOfUse = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <div class="v-messages theme--light error--text" v-if="additional.isAgreementError">
                Please read the Advertiser terms and confirm your acceptance of the terms
              </div>
              <StepProgress name="Our Terms & Conditions" step="2" steps-count="2"/>
              <v-row>
                <v-col>
                  <v-btn block
                         color="primary"
                         text
                         class="bg-gray mb-2"
                         depressed
                         @click="e1 = 1"
                  >
                    Refuse
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    block
                    color="primary"
                    depressed
                    @click="processStep3"
                    :disabled="!validStep3 || step3.isAgreementError"
                  >
                    Accept
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-stepper-content>
        <!-- END Terms and conditions  -->
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StepProgress from '@/components/includes/StepProgress.vue';
import TermsOfUse from '@/components/includes/TermsOfUse.vue';
import PrivacyPolicy from '@/components/includes/PrivacyPolicy.vue';
import GdprPolicy from '@/components/includes/GdprPolicy.vue';

export default Vue.extend({
  name: 'SignUpSteps',
  components: {
    StepProgress,
    TermsOfUse,
    PrivacyPolicy,
    GdprPolicy,
  },
  data() {
    return {
      privacyPolicy: false,
      termsOfUse: false,
      gdprPolicy: false,
      appName: process.env.VUE_APP_TITLE,
      validStep1: true,
      validStep2: true,
      validStep3: true,
      step1: {
        firstName: '',
        lastName: '',
        businessName: '',
        topCountries: '',
        websites: [
          { site: '', desc: '' },
        ],
        otherNetworks: [],
        offeredProducts: '',
      },
      fieldsCount: {
        websites: 1,
        otherNetworks: 1,
      },
      step1Rules: {},
      step3: {
        safeData: false,
        safeGuidelines: false,
        safeNetwork: false,
        selfTrademark: false,
        readAgreements: false,
      },
      additional: {
        isAgreementError: false,
      },
      step3Rules: [
        (v: boolean) => v || 'You have to read and accept this condition.',
      ],
      e1: 1,
    };
  },
  mounted() {
    this.step1Rules = this.validationRules();
  },
  methods: {
    isDisabledAddButton(site: string, desc: string) {
      const isSite = this.isSiteValid(site);
      const isDesc = this.isDescValid(desc);
      return isSite === true || isDesc === true;
    },
    isSiteValid(site: string, desc?: string): boolean | string {
      const isSite = (!!site && /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/.test(site));
      if (desc) {
        if (!site && this.isDescValid(desc) === true) {
          return true;
        }
        return isSite || 'Provide valid URL';
      }
      return isSite || 'Please enter a website or describe your offer';
    },
    isDescValid(desc: string, site?: string): boolean | string {
      const isDesc = !!desc;
      if (site) {
        return (this.isSiteValid(site) === true || isDesc)
          || 'Please enter a website or describe your offer';
      }
      return isDesc || 'Please enter a website or describe your offer';
    },
    addWebSite() {
      if ((this.$refs.formStep1 as HTMLFormElement).validate()) {
        this.step1.websites.push({
          site: '',
          desc: '',
        });
        this.fieldsCount.websites += 1;
      }
      this.validStep1 = false;
    },
    validationRules() {
      return {
        firstName: [(v: string) => !!v || 'First Name is required'],
        lastName: [(v: string) => !!v || 'Last Name is required'],
        businessName: [(v: string) => !!v || 'Business Name or DBA is required'],
        expectedMonthlyRevenue: [],
        topCountries: [],
        otherNetworks: [],
        topPromotedBrands: [],
        learnSource: [],
      };
    },
    processStep1() {
      if ((this.$refs.formStep1 as Vue & { validate: () => boolean }).validate()) {
        this.e1 = 3;
      }
    },
    processStep3() {
      this.additional.isAgreementError = !this.step3.readAgreements;
      if (
        (this.$refs.formStep3 as Vue & { validate: () => boolean }).validate()
        && !this.additional.isAgreementError
      ) {
        this.$emit('update', {
          profileData: this.step1,
          agreements: this.step3,
        });
      }
    },
  },
});
</script>

<style scoped>
.hidden_signup {
  visibility: hidden;
}
</style>
