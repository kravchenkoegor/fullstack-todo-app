import { AxiosInstance } from 'axios';
import { ActionTree } from 'vuex';
import { ListProvider } from '@/api';
import { IListState } from './get_state';
import { EListMutationTypes } from './mutations';

export enum EListActionTypes {
  GET_LISTS = 'GET_LISTS',
  GET_LIST_BY_ID = 'GET_LIST_BY_ID',
  CREATE_LIST = 'CREATE_LIST',
  UPDATE_LIST = 'UPDATE_LIST',
  DELETE_LIST = 'DELETE_LIST',
  UPDATE_TODO = 'UPDATE_TODO',
  DELETE_TODOS = 'DELETE_TODOS'
};

export const getActions = (axiosInstance: AxiosInstance): ActionTree<IListState, unknown> => {
  const listProvider = new ListProvider(axiosInstance);

  return {
    async [EListActionTypes.GET_LISTS]({ commit }) {
      const lists = await listProvider.getLists();
      commit(EListMutationTypes.SET_LISTS, lists);
      commit(EListMutationTypes.SET_LOADING, false);
    },

    async [EListActionTypes.GET_LIST_BY_ID]({ commit }, listId) {
      const list = await listProvider.getListById(listId);
      commit(EListMutationTypes.SET_CURRENT_LIST, list);
    },

    async [EListActionTypes.CREATE_LIST]({ commit }, payload) {
      const createdList = await listProvider.createList(payload);
      if (createdList) {
        commit(EListMutationTypes.ADD_LIST, createdList);
      }
    },

    async [EListActionTypes.DELETE_LIST]({ commit }, listId) {
      await listProvider.deleteList(listId);
      commit(EListMutationTypes.REMOVE_LIST, listId);
    },

    async [EListActionTypes.UPDATE_LIST]({ commit }, { listId, payload }) {
      await listProvider.updateList({ listId, payload });
      commit(EListMutationTypes.UPDATE_LIST, payload);
    },

    async [EListActionTypes.UPDATE_TODO]({ commit }, { todoId, done }) {
      await listProvider.updateTodo({ todoId, done });
      commit(EListMutationTypes.UPDATE_TODO, { todoId, done });
    },

    async [EListActionTypes.DELETE_TODOS]({ commit }, todoIds) {
      await listProvider.deleteTodos(todoIds);
      commit(EListMutationTypes.DELETE_TODOS, todoIds);
    },
  };
};
