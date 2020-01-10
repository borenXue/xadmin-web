import Vue from 'vue';
import ChangePasswodDialogVue from './index.vue';
import './index.scss';

const ChangePasswodDialogComponent = Vue.extend(ChangePasswodDialogVue);

// 每次调用都重新创建新的组件, 该变量仅为保证始终只有一个实例存在
let instanceChangePasswodDialog: any;

export interface ChangePasswodDialogConfig {
  userName?: string,
  password?: string,
}

export default function ChangePasswodDialog(config?: ChangePasswodDialogConfig) {
  if (instanceChangePasswodDialog && instanceChangePasswodDialog.visible) return instanceChangePasswodDialog;

  instanceChangePasswodDialog = new ChangePasswodDialogComponent({
    el: document.createElement('div'),
    data: {
      userName: config && config.userName ? config.userName : '',
      password: config && config.password ? config.userName : '',
    },
  });
  document.body.appendChild(instanceChangePasswodDialog.$el);

  Vue.nextTick(() => {
    instanceChangePasswodDialog.visible = true;
  });
}

Vue.prototype.$changePassword = ChangePasswodDialog;

declare module 'vue/types/vue' {
  interface Vue {
    $changePassword: (config?: ChangePasswodDialogConfig) => void;
  }
}
