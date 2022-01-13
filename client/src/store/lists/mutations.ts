import Vue from 'vue';
import { MutationTree } from 'vuex';
import { IListState } from './get_state';

export enum EListMutationTypes {
  SET_LISTS = 'SET_LISTS',
  SET_CURRENT_LIST = 'SET_CURRENT_LIST',
  ADD_LIST = 'ADD_LIST',
  UPDATE_LIST = 'UPDATE_LIST',
  REMOVE_LIST = 'REMOVE_LIST',
  SET_LOADING = 'SET_LOADING',
  UPDATE_TODO = 'UPDATE_TODO',
  DELETE_TODOS = 'DELETE_TODOS'
};

export const mutations: MutationTree<IListState> = {
  [EListMutationTypes.SET_LISTS](state, lists) {
    state.lists = lists;
  },

  [EListMutationTypes.SET_CURRENT_LIST](state, list) {
    state.currentList = list;
  },

  [EListMutationTypes.ADD_LIST](state, list) {
    state.lists?.push(list);
  },

  [EListMutationTypes.UPDATE_LIST](state, { title, items }) {
    const list = state.currentList;
    if (list) {
      if (title) {
        Vue.set(list, 'title', title);
      }

      if (items) {
        Vue.set(list, 'items', items);
      }
    }
  },

  [EListMutationTypes.REMOVE_LIST](state, listId) {
    if (state.lists) {
      state.lists = state.lists.filter(({ id }) => id !== listId);
    }
  },

  [EListMutationTypes.SET_LOADING](state, isLoading) {
    state.isLoading = isLoading;
  },

  [EListMutationTypes.UPDATE_TODO](state, { todoId, done }) {
    const list = state.currentList;
    if (list) {
      const todo = list.items.find(({ id }) => id === todoId);
      todo.done = done;
    }
  },

  [EListMutationTypes.DELETE_TODOS](state, todoIds: number[]) {
    const list = state.currentList;
    if (list) {
      list.items = list.items.filter(({ id }) => {
        return !todoIds.includes(id);
      });
    }
  },
};
