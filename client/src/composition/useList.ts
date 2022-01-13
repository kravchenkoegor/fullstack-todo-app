import {
  EListActionTypes,
  EListMutationTypes,
  IList,
} from '@/store';
import { computed } from '@vue/composition-api';

export const useVuexListModule = (root: any) => {
  const { $route, $store } = root;

  const listId = computed(() => Number($route.params.id));

  const currentList = computed<IList | null>(() => {
    return $store.state.lists.currentList;
  });

  const getListById = async () => {
    await $store.dispatch(
        `lists/${EListActionTypes.GET_LIST_BY_ID}`,
        listId.value,
    );
  };

  const clearCurrentList = async () => {
    $store.commit(`lists/${EListMutationTypes.SET_CURRENT_LIST}`, null);
    await getListById();
  };

  return {
    clearCurrentList,
    currentList,
    getListById,
    listId,
  };
};
