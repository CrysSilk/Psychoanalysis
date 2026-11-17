<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import UniverseBackground from './components/UniverseBackground.vue'
</script>

<template>
  <div class="site-shell">
    <UniverseBackground />
    <AppNavbar />

    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <AppFooter />
  </div>
</template>