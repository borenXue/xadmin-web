import Vue from 'vue';
import Vuex from 'vuex';
import VuexPluginLogger from 'vuex/dist/logger';

import auth from './module/auth';
import userPreference from './module/user-preference';

Vue.use(Vuex);

const isDev = process.env.NODE_ENV === 'development';

const getters = {
  // 用户偏好设置模块: userPreference
  sidebar: (state: any) => state.userPreference.sidebar,
  // 登录用户信息、路由 相关: auth
  userId: (state: any) => state.auth.userId,
  userLogo: (state: any) => state.auth.userLogo,
  beforeLoginPage: (state: any) => state.auth.beforeLoginPage,
  authRouters: (state: any) => state.auth.router.authRouters,
};

export default new Vuex.Store({
  modules: {
    auth,
    userPreference,
  },
  getters,
  plugins: isDev ? [VuexPluginLogger()] : [],
});
