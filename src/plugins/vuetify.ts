import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#188D83', // #188D83
        secondary: '#188D83', // #FFCDD2
        middle: '#126698', // #FFCDD2
        accent: '#171E66', // #171E66
      },
    },
  },
});
