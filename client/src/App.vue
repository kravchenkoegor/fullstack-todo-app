<template>
  <div style="overflow-x: hidden;">
    <header>
      <nav class="navbar navbar-dark shadow-sm">
        <div class="container">
          <router-link
            class="navbar-brand"
            :to="{ name: 'Home' }"
          >
            Todo app
          </router-link>
        </div>
      </nav>
    </header>
    <main class="container py-4 py-lg-5">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
} from '@vue/composition-api';

export default defineComponent({
  name: 'App',
  setup() {
    onMounted(() => {
      document.getElementById('mp-preloader')!.style.display = 'none';
    });
  },
});
</script>

<style lang="scss">
.container {
  max-width: 640px !important;
}

.navbar {
  background-color: #003d73;
}
</style>
