<template>
  <div class="apollo-example">

    <div v-if="$apollo.queries.user.loading">Loading...</div>
    <div v-else>
      {{ partOfDay }},
    </div>

    <!-- Apollo watched Graphql query -->
<!--    <ApolloQuery
      :query="require('../graphql/Health.gql')"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        &lt;!&ndash; Loading &ndash;&gt;
        <div v-if="loading" class="loading apollo">Loading...</div>

        &lt;!&ndash; Error &ndash;&gt;
        <div v-else-if="error" class="error apollo">An error occured</div>

        &lt;!&ndash; Result &ndash;&gt;
        <div v-else-if="data" class="result apollo">{{ data.health }}</div>

        &lt;!&ndash; No result &ndash;&gt;
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>-->
  </div>
</template>

<script>
import Vue from 'vue';
import { UserQuery } from '@/graphql/User';

export default Vue.extend({
  data() {
    return {
      health: '',
    };
  },

  computed: {
    partOfDay() {
      const currentHour = new Date().getHours();
      const dayParts = [
        {
          name: 'Good Morning',
          hours: [4, 11],
        },
        {
          name: 'Hello',
          hours: [12, 16],
        },
        {
          name: 'Good Evening',
          hours: [17, 23],
        },
        {
          name: 'Good Night',
          hours: [0, 3],
        },
      ];
      const part = dayParts.find((dp) => currentHour > dp.hours[0] && currentHour <= dp.hours[1]);

      return part ? part.name : 'Hello';
    },
  },

  apollo: {
    user: UserQuery,
  },

  methods: {
  },
});
</script>

<style scoped>
.form,
.input,
.apollo,

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.image-input {
  margin: 20px;
}
</style>
