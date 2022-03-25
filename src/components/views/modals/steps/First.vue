<template>
  <v-form ref="form">
    <v-row>
      <v-col>
        <v-text-field
          label="Name"
          v-model="offer.name"
          :rules="rules.name"
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
              <span>This name should describe your offer in a concise way,<br/>
                as it will be visible by the network agents as well as the publishers.<br/>
                You can always change the name in the Offers page afterwards.
              </span>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
      <v-col offset="1">
        <v-select
          label="Category"
          :items="verticals"
          :rules="rules.vertical"
          item-text="name"
          item-value="id"
          v-model="offer.sfl_vertical_id"
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
              <span>Select the category that best represents your offer.</span>
            </v-tooltip>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          label="Description"
          v-model="offer.descriptions"
          rows="1"
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
                A little description of your product,<br/>
                as well as a more detailed category if you selected “Other”
              </span>
            </v-tooltip>
          </template>
        </v-textarea>
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">

import Vue from 'vue';
import { QueryVerticals } from '@/graphql/QueryVerticals';

export default Vue.extend({
  props: {
    offer: Object,
  },
  apollo: {
    verticals: {
      query: QueryVerticals,
      update: (data) => data.getVerticals,
    },
  },
  data() {
    return {
      rules: {
        name: [
          (v: string) => !!v.trim() || 'Name is required',
        ],
        vertical: [
          (v: number) => !!v || 'Category must be set',
        ],
      },
    };
  },
  methods: {
    validate() {
      return (this.$refs.form as HTMLFormElement).validate();
    },
  },
});
</script>
