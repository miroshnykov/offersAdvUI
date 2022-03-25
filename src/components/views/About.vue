<template>
  <div class="about">
    <h1>About</h1>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(item,i) in items"
        :key="i"
      >
        <v-expansion-panel-header>
          {{ item.question }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ item.answer }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Home',

  data: () => ({
    items: [
      {
        question: 'Where should I start from?',
        answer: 'The only thing you basically need is promotion link. You share the link with your auditory and when some body makes conversion you get money.',
      },
      {
        question: 'Where do I get promotion link?',
        answer: 'Open Campaigns page and select one of the offers you like. Click on Get Campaign Url button and link would be copied to your clipboard.',
      },
      {
        question: 'How to withdraw money from the system?',
        answer: 'We support several payment methods. You need fill payment information on Profile page. And once payments period is ends you will get your money automatically.',
      },
      {
        question: 'Why I can\'t get link on some campaigns?',
        answer: 'If campaign has type "Apply To Run" then you can\'t you don\'t get the link right away however you can request the link and you will get it by email once it is approved for you.',
      },
    ],
  }),
});
</script>
