<template>
  <div class="h-100 w-100 text-center">
    <div
      class="spinner-border text-primary"
      role="status"
      :style="{
        height: `${size}px`,
        width: `${size}px`
      }"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Spinner',
  props: {
    size: {
      type: Number,
      default: 32,
    },
  },
});
</script>
