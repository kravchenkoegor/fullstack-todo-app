import { AxiosInstance } from 'axios';
import {
  getState,
  IList,
  TListCreate,
  TListUpdate,
} from './get_state';
import {
  mutations,
  EListMutationTypes,
} from './mutations';
import {
  getActions,
  EListActionTypes,
} from './actions';

export const listsModule = (axiosInstance: AxiosInstance) => ({
  namespaced: true,
  state: getState(),
  mutations,
  actions: getActions(axiosInstance),
});

export {
  IList,
  TListCreate,
  TListUpdate,
  EListActionTypes,
  EListMutationTypes,
};
