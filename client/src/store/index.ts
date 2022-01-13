import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import {
  listsModule,
  IList,
  TListCreate,
  TListUpdate,
  EListActionTypes,
  EListMutationTypes,
} from './lists';

Vue.use(Vuex);

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const store = new Vuex.Store({
  modules: {
    lists: listsModule(axiosInstance),
  },
});

export default store;

export {
  IList,
  TListCreate,
  TListUpdate,
  EListActionTypes,
  EListMutationTypes,
};
