<template>
  <div>
    <Breadcrumbs :items="breadcrumbs" />
    <h1 class="h2 mb-4">
      Create new list
    </h1>
    <div class="mb-4 row">
      <label class="col-md-2 col-form-label">
        List title:
      </label>
      <div class="col-md-10">
        <input
          v-model="title"
          class="form-control"
        >
        <div
          v-if="title.length > 50"
          class="form-text text-danger"
        >
          List title can't be longer than 50 symbols
        </div>
      </div>
    </div>
    <button
      class="btn btn-success w-100"
      :disabled="!title || title.length > 50"
      type="button"
      @click="createList"
    >
      Create new
    </button>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
} from '@vue/composition-api';
import { useRouter } from '../../composition';
import { EListActionTypes } from '../../store';

const icons = [
  'car',
  'cherry',
  'flame',
  'graduate',
  'trophy',
];

export default defineComponent({
  name: 'ListCreate',
  setup(_, { root }) {
    const { router } = useRouter(root);

    const title = ref('');

    const createList = async () => {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      await root.$store.dispatch(`lists/${EListActionTypes.CREATE_LIST}`, {
        title: title.value,
        icon: randomIcon,
      });
      await router.push({ name: 'Home' });
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
          title: 'Create new list',
        },
      ];
    });

    return {
      breadcrumbs,
      createList,
      title,
    };
  },
});
</script>
