import Vue from 'vue';
import LoginDialogVue from './LoginDialog.vue';
import './index.scss';

const LoginDialogComponent = Vue.extend(LoginDialogVue);

// 每次调用都重新创建新的组件, 该变量仅为保证始终只有一个实例存在
let instanceLoginDialog: any;

export interface LoginDialogConfig {
  /**
   * 毛玻璃效果所施加的元素, eg: '#app'
   */
  blurAppElement?: string,
  /**
   * 自定义 class
   */
  customClass?: string,

  login: (userName: string, password: string, close: Function, done: Function) => void,
  cancel?: () => void
}

export default function LoginDialog(config: LoginDialogConfig) {
  if (!config) throw new Error('config 参数缺失');
  if (!config.login) throw new Error('config.login 参数缺失');
  if (typeof config.login !== 'function') throw new Error('config.login 参数必须是函数类型');

  if (instanceLoginDialog && instanceLoginDialog.visible) return instanceLoginDialog;

  instanceLoginDialog = new LoginDialogComponent({
    el: document.createElement('div'),
    data: {
      customClass: config.customClass || '',
      blurAppElement: config.blurAppElement || '',
    },
    methods: {
      login: config.login,
      cancel: config.cancel || function empty() {},
    },
  });
  document.body.appendChild(instanceLoginDialog.$el);

  Vue.nextTick(() => {
    instanceLoginDialog.show();
  });
}

Vue.prototype.$login = LoginDialog;

declare module 'vue/types/vue' {
  interface Vue {
    $login: (config: LoginDialogConfig) => void;
  }
}
