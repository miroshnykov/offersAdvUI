<template>
  <div>
    <v-container fluid class="bg-theme-gradient auth-layout">
      <v-row align="center" justify="center">
        <v-col cols="12" md="6" class="text-center">
          <div class="text-center d-flex justify-center">
            <v-img max-width="100px" src="@/assets/logo.white.svg"></v-img>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid class="margin-for-footer">
      <v-row align="center" class="bg-white" justify="center">
        <v-col cols="12" md="5" lg="4" class="px-6 px-md-2">
          <v-row justify="center">
            <v-col cols="12" class="pa-6 auth-main-content">
              <router-view/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid class="footer-line px-lg-12 px-4">
      <v-row justify-md="space-between">
        <v-col cols="12" md="6">
          <div class="copyright-string text-center text-md-left">
            © Copyright www.{{getHost()}} 2021. All Rights Reserved.
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="2" xl="1" class="text-center text-md-right">
          <div>
            <v-dialog
              v-model="termsOfUse"
              width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <a
                  v-bind="attrs"
                  v-on="on"
                >
                  Terms of Use
                </a>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Terms of Use</span>
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
          </div>
        </v-col>
        <v-col cols="12" md="2" xl="1" class="text-center text-md-right">
          <div>
            <v-dialog
              v-model="privacyPolicy"
              width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <a
                  v-bind="attrs"
                  v-on="on"
                >
                  Privacy Policy
                </a>
              </template>
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
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TermsOfUse from '@/components/includes/TermsOfUse.vue';
import PrivacyPolicy from '@/components/includes/PrivacyPolicy.vue';

export default Vue.extend({
  name: 'AuthLayout',

  components: {
    PrivacyPolicy,
    TermsOfUse,
  },
  data() {
    return {
      termsOfUse: false,
      privacyPolicy: false,
    };
  },
  methods: {
    getHost() {
      return 'ad-firm.com';
    },
  },
});
</script>
<style scoped lang="scss">
  .auth-layout {
    // background-image: url('../../assets/network.jpeg');
    background-color: #f6f6f6;
    background-size: cover;
    background-position: center;
    padding: 20px;
    .auth-container {
      background-color: rgba(255,255,255, .9);
      border-radius: 30px;
    }
    .auth-main-content {
      background-color: #fff;
      border-radius: 25px;
    }
  }
  .bg-white {
    background-color: white;
  }
  .bg-theme-gradient {
    background: var(--v-primary-base);
    background: linear-gradient(
        89.81deg,
        var(--v-accent-base) -2.68%,
        var(--v-middle-base) 59.67%,
        var(--v-primary-base) 104.2%
    );
  }
  .full-height {
    height: 100%;
  }
  .copyright-string {
    color: #BDBDCA;
  }
  .footer-line {
    font-weight: 600;
    position: absolute;
    bottom: 20px;
  }
  .margin-for-footer {
    margin-bottom: 10rem;
  }
</style>
