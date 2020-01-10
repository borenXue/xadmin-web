import Vue from 'vue';
import App from './Grandson.vue';

Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.config.performance = process.env.NODE_ENV === 'development';

new Vue({
  render: h => h(App),
}).$mount('#app');
