import Vue from 'vue';
import { Message } from 'element-ui';
import '@/style/reset.scss';
import '@/utils/element-init';
import App from './App.vue';
import appRouter from './router';
import appStore from './store';
import '@/router/permission';
import '@/utils/filter';
import '@/components/dialog/change-password/index';
import RequestLoginEvent from './utils/RequestLoginEvent';

Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.config.performance = process.env.NODE_ENV === 'development';

window.addEventListener(RequestLoginEvent.name, (event: Event) => {
  appStore.dispatch('ActionLogin', (event as RequestLoginEvent).loginParams).then(() => {
    Message.success('登录成功, 请继续操作');
    (event as RequestLoginEvent).loginClose();
  }).catch((err: any) => {
    Message.error(err.message || '登录失败, 请重试');
    (event as RequestLoginEvent).loginDone();
  });
});

new Vue({
  router: appRouter,
  store: appStore,
  render: h => h(App),
}).$mount('#app');
