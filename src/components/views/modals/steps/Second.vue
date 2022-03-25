<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="3">
        <v-select
          label="Protocol"
          :items="['https://', 'http://']"
          v-model="protocol"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Landing page"
          v-model="value"
          :rules="rules.url"
        >
        <template slot="append">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <div
                class="info-btn primary"
                v-bind="attrs"
                v-on="on"
              >
                i
              </div>
            </template>
            <span>
              The landing page is the webpage where your product exists.<br/>
              This is where our publishers will send their traffic to purchase your product,<br/>
              thus generating conversions
            </span>
          </v-tooltip>
        </template>
      </v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  props: {
    offer: Object,
  },
  data() {
    return {
      isHttps: false,
      protocol: 'https://',
      value: '',
      rules: {
        url: [
          (v: string) => {
            const exp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gm;
            return exp.test(v) || 'Url must be "https://[Your domain].com".';
          },
        ],
      },
    };
  },
  mounted() {
    this.offer.landings[0].name = 'default';
    this.updateOfferValue();
  },
  watch: {
    offer() {
      this.updateOfferValue();
    },
  },
  methods: {
    updateOfferValue() {
      if (this.offer.landings[0].url) {
        if (this.offer.landings[0].url.indexOf('https://') === 0) {
          this.value = this.offer.landings[0].url.slice(8);
          this.protocol = 'https://';
        } else if (this.offer.landings[0].url.indexOf('http://') > -1) {
          this.value = this.offer.landings[0].url.slice(7);
          this.protocol = 'http://';
        } else {
          this.value = this.offer.landings[0].url;
        }
      }
    },
    validate() {
      this.offer.landings[0].url = `${this.protocol}${this.value}`;
      return (this.$refs.form as HTMLFormElement).validate();
    },
  },
});
</script>
