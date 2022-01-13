<template>
  <div v-if="!isLoading">
    <div class="d-flex align-items-center mb-4">
      <h1 class="h2 mb-0">
        Lists
      </h1>
      <button
        class="btn btn-success ms-4"
        type="button"
        @click="$router.push({ name: 'ListCreate' })"
      >
        Create new
      </button>
    </div>

    <p
      v-if="!todoLists.length"
      class="h4 mb-0"
    >
      No lists yet.
    </p>
    <template v-else>
      <div class="d-flex align-items-center mb-4">
        <p class="font-weight-bold mb-0 me-4 flex-shrink-0">
          Sort by:
        </p>
        <select
          v-model="sorting"
          class="form-select"
        >
          <option
            v-for="option in sortOptions"
            :key="option"
            :value="option"
            :selected="option === sorting"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <ul class="list-unstyled">
        <li
          v-for="list in todoLists"
          :key="list.id"
          class="mb-2"
        >
          <router-link
            class="d-inline-flex align-items-center text-decoration-none"
            :to="{
              name: 'ListView',
              params: { id: list.id }
            }"
          >
            <img
              class="me-3"
              height="24"
              :src="getImageUrl(list.icon)"
              style="width: 24px; height: 24px;"
              width="24"
            />
            {{ list.title }}
          </router-link>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
} from '@vue/composition-api';
import {
  EListActionTypes,
  IList,
} from '../store';
import { getImageUrl } from '../helpers';

const SORTING = {
  CREATION_DATE_ASC: 'Creation Date ASC',
  CREATION_DATE_DESC: 'Creation Date DESC',
};

export default defineComponent({
  name: 'Homepage',
  setup(_props, { root: { $store } }) {
    const isLoading = computed<boolean>(() => {
      return $store.state.lists.isLoading;
    });
    const todoLists = computed<IList[] | null>(() => {
      return $store.state.lists.lists.sort((a: IList, b: IList) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();

        if (sorting.value === SORTING.CREATION_DATE_ASC) {
          return aDate - bDate;
        }

        return bDate - aDate;
      });
    });

    const getLists = async () => {
      await $store.dispatch(`lists/${EListActionTypes.GET_LISTS}`);
    };

    const sortOptions = Object.values(SORTING);
    const sorting = ref('Creation Date ASC');

    onMounted(getLists);

    return {
      getImageUrl,
      isLoading,
      sortOptions,
      sorting,
      todoLists,
    };
  },
});
</script>
