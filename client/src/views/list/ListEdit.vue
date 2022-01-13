<template>
  <div v-if="currentList">
    <Breadcrumbs :items="breadcrumbs" />
    <div class="d-flex align-items-center mb-4">
      <h1 class="h2 mb-0">
        Edit list:
        <span class="font-weight-bold">
          {{ currentList.title }}
        </span>
      </h1>
    </div>
    <div class="mb-4 row">
      <label class="col-12 col-md-2 col-form-label">
        List title:
      </label>
      <div class="col-12 col-md-10">
        <input
          v-model="title"
          class="form-control"
          placeholder="Enter list title"
        >
        <div
          v-if="title.length > 50"
          class="form-text text-danger"
        >
          List title can't be longer than 50 symbols
        </div>
      </div>
    </div>
    <div class="mb-5">
      <p class="mb-2">
        Edit items:
      </p>
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="row mb-2"
      >
        <div class="col-9 col-md-10">
          <input
            v-model="todo.title"
            class="form-control"
            placeholder="Enter todo title"
          >
          <div
            v-if="todo.title.length> 50"
            class="form-text text-danger"
          >
            Todo title can't be longer than 50 symbols
          </div>
        </div>
        <div class="col-3 col-md-2 ps-0">
          <button
            class="btn btn-outline-danger w-100"
            :disabled="todos.length === 1"
            type="button"
            @click="deleteTodo(todo)"
          >
            Delete
          </button>
        </div>
      </div>
      <button
        class="btn btn-outline-primary w-100"
        :disabled="addNewItemDisabled"
        type="button"
        @click="addTodo"
      >
        Add new item
      </button>
    </div>
    <button
      class="btn btn-success w-100"
      :disabled="submitDisabled"
      type="button"
      @click="updateList"
    >
      Save
    </button>
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
  useRouter,
  useVuexListModule,
} from '../../composition';
import {
  EListActionTypes,
  TListUpdate,
} from '../../store';

interface ITodo {
  id?: number;
  title: string;
  done: boolean;
  createdAt: Date;
  listId: number;
}

const cloneObject = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export default defineComponent({
  name: 'ListEdit',
  setup(_, { root }) {
    const { router } = useRouter(root);
    const {
      clearCurrentList,
      currentList,
      getListById,
      listId,
    } = useVuexListModule(root);

    const initialCurrentList = cloneObject(currentList.value);
    const todos = ref<ITodo[]>(
      cloneObject(currentList.value?.items ?? []),
    );
    const title = ref(currentList.value?.title ?? '');

    const addTodo = () => {
      todos.value.push({
        title: '',
        done: false,
        createdAt: new Date(),
        listId: listId.value,
      });
    };

    const deletedTodos = ref<number[]>([]);
    const deleteTodo = (todo: ITodo) => {
      if (todo.id) {
        deletedTodos.value.push(todo.id);
      }

      todos.value = todos.value.filter(item => item !== todo);
    };

    const updateList = async () => {
      if (!currentList.value) {
        return;
      }

      const payload = {} as TListUpdate;
      if (title.value !== initialCurrentList?.title) {
        payload.title = title.value;
      }

      if (JSON.stringify(todos.value) !== JSON.stringify(initialCurrentList?.items)) {
        payload.items = todos.value;
      }

      if (deletedTodos.value.length) {
        await root.$store.dispatch(
          `lists/${EListActionTypes.DELETE_TODOS}`,
          deletedTodos.value,
        );
      }

      await root.$store.dispatch(
        `lists/${EListActionTypes.UPDATE_LIST}`,
        {
          listId: currentList.value.id,
          payload,
        },
      );

      await getListById();

      await router.push({
        name: 'ListView',
        params: {
          id: `${currentList.value.id}`,
        },
      });
    };

    const addNewItemDisabled = computed<boolean>(() => {
      if (!todos.value.length) {
        return false;
      }

      const lastTodo = todos.value[todos.value.length - 1];
      return !lastTodo.title;
    });

    const submitDisabled = computed<boolean>(() => {
      if (!title.value) {
        return true;
      }

      if (!todos.value.length) {
        return false;
      }

      return todos.value.some(todo => {
        return !todo.title || todo.title.length > 50;
      });
    });

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
          path: {
            name: 'ListView',
            params: {
              id: currentList.value?.id,
            },
          },
        },
        {
          title: `Edit list "${currentList.value?.title}"`,
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
      addNewItemDisabled,
      addTodo,
      breadcrumbs,
      currentList,
      deleteTodo,
      deletedTodos,
      submitDisabled,
      title,
      todos,
      updateList,
    };
  },
});
</script>
