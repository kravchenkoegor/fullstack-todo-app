<template>
  <nav>
    <ol class="breadcrumb">
      <li
        v-for="item in items"
        :key="item.title"
        class="breadcrumb-item"
        :class="{ 'active': !item.path }"
      >
        <router-link
          v-if="item.path"
          :to="item.path"
        >
          {{ item.title }}
        </router-link>
        <span v-else>
          {{ item.title }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
} from '@vue/composition-api';

interface IBreadcrumbItem {
  title: string;
  path?: {
    name: string;
    params?: {
      id: number;
    }
  }
}

export default defineComponent({
  name: 'Breadcrumbs',
  props: {
    items: {
      type: Array as PropType<IBreadcrumbItem[]>,
      required: true,
    },
  },
});
</script>
