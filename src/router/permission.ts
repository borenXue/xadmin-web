import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Message } from 'element-ui';
import Axios from 'axios';
import appRouter from '@/router/index';
import appStore from '@/store/index';
import { httpGet, clearRequest } from '@/utils/ajax';

// 免登录白名单的 path 列表: 字符串 && 正则表达式
const whiteList = [
  '/login',
  '/404',
];

// 根据 to.path 判断该页面是否属于 whiteList
function inWhiteList(target: string) {
  for (const item of whiteList) { // eslint-disable-line no-restricted-syntax
    if (typeof item === 'string' && item === target) {
      return true;
    }
    if (typeof item === 'object' && (item as any) instanceof RegExp && (item as any).test(target)) {
      return true;
    }
  }
  return false;
}

/**
 * 1、目标路由 在免登录白名单内, 则直接跳转
 * 2、目标路由 不在免登录白名单内
 *    2.1、hash 跳转: 直接跳转
 *    2.2、页面强制刷新或新打开页面
 *      a、调用 is-login 接口判断登录是否过期
 *        a.1、已过期: 跳转登录页
 *        a.2、未过期: 更新用户、权限、路由信息 && 继续跳转工作
 */
appRouter.beforeEach((to, from, next) => {
  NProgress.start();

  if (clearRequest.source.cancel) clearRequest.source.cancel();
  clearRequest.source = Axios.CancelToken.source();

  // step 1
  if (inWhiteList(to.path)) return next();

  // step 2.1
  if (appStore.getters.userId) return next();

  // step 2.2
  appStore.dispatch('ActionIsLogin')
    .then(() => next({ ...to }))
    .catch(async () => {
      await appStore.dispatch('SET_BEFORE_LOGIN_PAGE', to);
      Message.error('登录已失效, 请重新登录');
      next({ path: '/login' });
    });
});

appRouter.afterEach(() => {
  NProgress.done();
});
