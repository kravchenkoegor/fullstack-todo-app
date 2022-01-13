<template>
  <Spinner
    v-if="!currentList"
    :size="64"
  />
  <div v-else>
    <Breadcrumbs :items="breadcrumbs" />

    <div class="title-wrapper">
      <h1 class="h2 text-truncate mw-100 mb-0">
        <img
          class="me-2"
          height="32"
          :src="getImageUrl(currentList.icon)"
          style="width: 32px; height: 32px;"
          width="32"
        />
        {{ currentList.title }}
      </h1>
      <div class="buttons-wrapper">
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="$router.push({
            name: 'ListEdit',
            params: currentList.id
          })"
        >
          Edit
        </button>
        <button
          class="btn btn-outline-danger ms-3"
          type="button"
          @click="deleteList"
        >
          Delete
        </button>
      </div>
    </div>

    <p
      v-if="!todos.length"
      class="h4 mb-0"
    >
      No todos in this list yet.
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

      <div
        v-for="item in todos"
        :key="item.id"
        class="form-check"
      >
        <input
          :id="`list-item-${item.id}`"
          v-model="item.done"
          class="form-check-input"
          type="checkbox"
          @change="updateTodo({ todoId: item.id, done: item.done })"
        >
        <label
          class="form-check-label"
          :for="`list-item-${item.id}`"
        >
          {{ item.title }}
        </label>
      </div>
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
import { EListActionTypes } from '../../store';
import {
  useRouter,
  useVuexListModule,
} from '../../composition';
import { getImageUrl } from '../../helpers';

const SORTING = {
  CREATION_DATE_ASC: 'Creation Date ASC',
  CREATION_DATE_DESC: 'Creation Date DESC',
  STATUS_ASC: 'Status ASC',
  STATUS_DESC: 'Status DESC',
};

export default defineComponent({
  name: 'ListView',
  setup(_, { root }) {
    const { router } = useRouter(root);
    const {
      clearCurrentList,
      currentList,
      getListById,
      listId,
    } = useVuexListModule(root);

    const deleteList = async () => {
      await root.$store.dispatch(
        `lists/${EListActionTypes.DELETE_LIST}`,
        listId.value,
      );
      await router.push({ name: 'Home' });
    };

    const todos = computed(() => {
      if (!currentList.value) {
        return [];
      }

      return currentList.value.items.sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();

        switch (sorting.value) {
          case SORTING.CREATION_DATE_ASC:
            return aDate - bDate;
          case SORTING.CREATION_DATE_DESC:
            return bDate - aDate;
          case SORTING.STATUS_ASC:
            return Number(b.done) - Number(a.done);
          case SORTING.STATUS_DESC:
            return Number(a.done) - Number(b.done);
          default: return 0;
        }
      });
    });

    const sortOptions = Object.values(SORTING);
    const sorting = ref('Creation Date ASC');

    const updateTodo = async ({ todoId, done }: { todoId: number; done: boolean; }) => {
      await root.$store.dispatch(
        `lists/${EListActionTypes.UPDATE_TODO}`,
        { todoId, done },
      );
    };

    const breadcrumbs = computed(() => {
      return [
        {
          title: 'Home',
          path: {
            name: 'Home',
          },
        },
        {
          title: `View list "${currentList.value?.title}"`,
        },
      ];
    });

    onMounted(async () => {
      if (currentList.value?.id !== listId.value) {
        await clearCurrentList();
        await getListById();
      }
    });

    return {
      breadcrumbs,
      currentList,
      deleteList,
      getImageUrl,
      sorting,
      sortOptions,
      todos,
      updateTodo,
    };
  },
});
</script>

<style lang="scss" scoped>
.title-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  @media screen and (min-width: 768px) {
    align-items: center;
    flex-direction: row;
  }
}

.buttons-wrapper {
  display: flex;
  margin-top: 1rem;
  width: 100%;

  @media screen and (min-width: 768px) {
    margin-left: auto;
    margin-top: 0;
    width: auto;
  }

  .btn {
    flex-grow: 1;

    @media screen and (min-width: 768px) {
      flex-grow: initial;
    }
  }
}
</style>
