<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
import HeroSection from '../components/HeroSection.vue'
import IntroductionSection from '../components/IntroductionSection.vue'
import TheorySection from '../components/TheorySection.vue'
import PersonalitySection from '../components/PersonalitySection.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <div class="app-container">
    <AppNavbar />

    <main>
      <HeroSection />
      <IntroductionSection />
      <TheorySection />
      <PersonalitySection />
    </main>

    <AppFooter />
  </div>
</template>