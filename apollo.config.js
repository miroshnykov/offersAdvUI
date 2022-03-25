// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path');
// // Load .env files
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { loadEnv } = require('vue-cli-plugin-apollo/utils/load-env');
//
// const env = loadEnv([
//   path.resolve(__dirname, '.env'),
//   path.resolve(__dirname, '.env.local'),
// ]);

// console.log('!!!!!', env);
module.exports = {
  client: {
    service: {
      name: '1 Click Away',
      // localSchemaFile: './schema.local.graphql',
    },
    includes: ['src/**/*.{js,jsx,ts,tsx,vue,gql,graphql}'],
  },

  // engine: {
  //   endpoint: process.env.APOLLO_ENGINE_API_ENDPOINT,
  //   apiKey: env.VUE_APP_APOLLO_ENGINE_KEY,
  // },
};
