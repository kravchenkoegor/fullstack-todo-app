import Vue from 'vue';
import vueCompositionApi from '@vue/composition-api';
import 'bootstrap/scss/bootstrap.scss';

import App from './App.vue';
import router from './router';
import store from './store';

import {
  Breadcrumbs,
  Spinner,
} from '@/components';

Vue.use(vueCompositionApi);

Vue.component('Breadcrumbs', Breadcrumbs);
Vue.component('Spinner', Spinner);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
