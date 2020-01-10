import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN';
import ElementUI, { Message } from 'element-ui';
/* eslint-disable-next-line */
import { ElMessageBoxShortcutMethod } from 'element-ui/types/message-box';


// ElementUI 组件的一些默认属性值重置
(ElementUI.Dialog as any).props.closeOnClickModal.default = false;
(ElementUI.Dialog as any).props.closeOnPressEscape.default = true;
(ElementUI.Dialog as any).props.appendToBody.default = true;
(ElementUI.Table as any).props.showHeader.default = true;
(ElementUI.Select as any).props.filterable.default = true;


Vue.use(ElementUI, {
  zIndex: 1000,
  locale,
  size: '',
});

/**
 * 重置 ElMessage 的 showClose 属性默认值
 * 错误提示: 添加默认的提示信息 && 屏蔽401和请求取消的提示信息
 */
const notShowMessageList = ['response code is 401', 'request cancel'];
const originError = Vue.prototype.$message.error;
Vue.prototype.$message.error = (textOrOpts: any) => {
  // textOrOpts: string | ElMessageOptions
  const opts: any = typeof textOrOpts === 'object' ? textOrOpts : { message: textOrOpts || '请求失败, 请重试' };
  if (textOrOpts && notShowMessageList.indexOf(opts.message as string) >= 0) return;

  opts.showClose = true;
  originError(opts);
};

const originSuccess = Vue.prototype.$message.success;
Vue.prototype.$message.success = (textOrOpts: any) => {
  const opts: any = typeof textOrOpts === 'string' ? { message: textOrOpts } : textOrOpts;
  opts.showClose = true;
  originSuccess(opts);
};

const originWarning = Vue.prototype.$message.warning;
Vue.prototype.$message.warning = (textOrOpts: any) => {
  const opts: any = typeof textOrOpts === 'string' ? { message: textOrOpts } : textOrOpts;
  opts.showClose = true;
  originWarning(opts);
};

const originInfo = Vue.prototype.$message.info;
Vue.prototype.$message.info = (textOrOpts: any) => {
  const opts: any = typeof textOrOpts === 'string' ? { message: textOrOpts } : textOrOpts;
  opts.showClose = true;
  originInfo(opts);
};


Vue.prototype.$xconfirm = (...rest: any) => new Promise((resolve) => {
  Vue.prototype.$confirm(...rest).then((...res: any[]) => {
    resolve(...res);
  }).catch(() => {});
});

declare module 'vue/types/vue' {
  interface Vue {
    $xconfirm: ElMessageBoxShortcutMethod
  }
}
