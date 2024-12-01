import { createStore } from 'vuex'; // 使用 Vuex 4.x 的创建方法
import pageHeader from './modules/pageHeader';

const state = {
  disUser: '',
  user: '',
  pasteArr: '',
};

export default createStore({  // 使用 createStore 替代 Vuex.Store
  modules: {
    pageHeader,
  },
  state,
  getters: {},
  mutations: {
    $_setDisUser(state, value) {
      state.disUser = value;
      localStorage.setItem('disUser', JSON.stringify(value));
    },
    $_setUser(state, value) {
      state.user = value;
      localStorage.setItem('user', JSON.stringify(value));
    },
    $_setPasteOrder(state, value) {
      state.pasteArr = value;
      localStorage.setItem('pasteArr', JSON.stringify(value));
    },
  },
});
