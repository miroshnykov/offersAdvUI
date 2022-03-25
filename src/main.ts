import Vue from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueApexCharts from 'vue-apexcharts';
import VueObserveVisibility from 'vue-observe-visibility';
import Toast from 'vue-toastification';
import App from './App.vue';
import router from './router';
import { createProvider } from './vue-apollo';
import vuetify from './plugins/vuetify';

import 'vue-toastification/dist/index.css';
import './styles/main.scss';

Vue.use(Toast, {
  position: 'top-center',
});
Vue.use(VueApexCharts);
Vue.use(VueObserveVisibility);
Vue.component('apexchart', VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider: createProvider(),
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
