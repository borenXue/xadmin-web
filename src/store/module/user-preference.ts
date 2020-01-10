import { Module } from 'vuex';

const keyCookieSidebar = 'sidebar-opened';

interface StateUserPreferenceModule {
  sidebar: {
    opened: boolean
  }
}

const UserPreferenceModule: Module<StateUserPreferenceModule, any> = {
  state: {
    sidebar: {
      opened: window.localStorage.getItem(keyCookieSidebar) === 'true',
    },
  },
  mutations: {
    TOOGGLE_SIDEBAR_OPENED: (state) => {
      state.sidebar.opened = !state.sidebar.opened;
      if (state.sidebar.opened) {
        window.localStorage.setItem(keyCookieSidebar, 'true');
      } else {
        window.localStorage.setItem(keyCookieSidebar, 'false');
      }
    },
  },
  actions: {
    TOOGGLE_SIDEBAR_OPENED: ({ commit }) => {
      commit('TOOGGLE_SIDEBAR_OPENED');
    },
  },
};

export default UserPreferenceModule;
