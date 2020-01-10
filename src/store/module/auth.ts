import { Module } from 'vuex';
import { login, logout, isLogin } from '@/api/auth';
import AuthRouterModule from './auth-router';

interface StateAuthModule {
  beforeLoginPage: string

  loginName: string,
  userName: string,
  userId: string,
  userLogo: string,

  rolesList: [], // 角色列表
  rightsList: [], // 权限列表
}

const AuthModule: Module<StateAuthModule, any> = {
  modules: {
    router: AuthRouterModule,
  },
  state: {
    beforeLoginPage: '/',

    loginName: '',
    userName: '',
    userId: '',
    userLogo: '//media.wyins.net/autoUpload/common/f778738c-e4f8-4870-b634-56703b4acafe_55fd0508d8f05b3.gif',

    rolesList: [],
    rightsList: [],
  },
  mutations: {
    SET_BEFORE_LOGIN_PAGE: (state, to: string) => {
      state.beforeLoginPage = to;
    },

    SET_USER_INFO: (state, data) => {
      state.loginName = data.loginName || '';
      state.userName = data.userName || '';
      state.userId = data.userId || '';
    },
    SET_RIGHTS_LIST: (state, data = []) => {
      state.rightsList = data.rightsList;
    },
    SET_ROLES_LIST: (state, data = []) => {
      state.rolesList = data.rolesList;
    },
  },
  actions: {
    SET_BEFORE_LOGIN_PAGE: ({ commit }, to) => {
      commit('SET_BEFORE_LOGIN_PAGE', to);
    },

    ActionLogin({ commit, dispatch }, loginInfo: { userName: string, password: string }) {
      return new Promise((resolve, reject) => {
        if (!loginInfo.userName) reject(new Error('用户名缺失'));
        if (!loginInfo.password) reject(new Error('登录密码缺失'));
        login(loginInfo.userName, loginInfo.password)
          .then((res) => {
            const { data } = res.data;
            commit('SET_USER_INFO', {
              loginName: data.loginName,
              userName: data.userName,
              userId: data.id,
            });
            commit('SET_RIGHTS_LIST', data.rights);
            commit('SET_ROLES_LIST', data.roles);
            dispatch('GenerateRouters', data.rights).then(() => {
              resolve(res);
            });
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    },
    ActionLogout({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        logout()
          .then((res: any) => {
            commit('SET_USER_INFO', {});
            commit('SET_RIGHTS_LIST', []);
            commit('SET_ROLES_LIST', []);
            dispatch('GenerateRouters', []).then(() => {
              resolve(res);
            });
          })
          .catch((err: any) => reject(err));
      });
    },
    ActionIsLogin({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        isLogin()
          .then((res: any) => {
            const { data } = res.data;
            commit('SET_USER_INFO', {
              loginName: data.loginName,
              userName: data.userName,
              userId: data.id,
            });
            commit('SET_RIGHTS_LIST', data.rights);
            commit('SET_ROLES_LIST', data.roles);
            dispatch('GenerateRouters', data.rights).then(() => {
              resolve(res);
            });
          })
          .catch((err: any) => reject(err));
      });
    },
  },
};

export default AuthModule;
