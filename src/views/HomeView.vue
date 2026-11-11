<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
import HeroSection from '../components/HeroSection.vue'
import IntroductionSection from '../components/IntroductionSection.vue'
import TheorySection from '../components/TheorySection.vue'
import AppFooter from '../components/AppFooter.vue'
import DreamLab from '../components/DreamLab.vue'
import TimelineSection from '../components/TimelineSection.vue'

</script>

<template>
  <div class="app-container">
    <AppNavbar />

    <main>
      <HeroSection />
      <IntroductionSection />
      <TheorySection />
      <TimelineSection />
      <DreamLab />
    </main>

    <AppFooter />
  </div>
</template>