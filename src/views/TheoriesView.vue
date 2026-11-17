<script setup>
import TheorySection from '../components/TheorySection.vue'
import TimelineSection from '../components/TimelineSection.vue'
</script>

<template>
  <main class="content-page">
    <header class="page-intro page-width">
      <p class="eyebrow">02 / IDEAS &amp; THINKERS</p>
      <h1>理论与人物</h1>
      <p class="page-lead">
        精神分析并非单一、静止的理论。不同思想家在继承、回应与修正中，发展出各自的关注重点。
        先从人格结构的经典概念开始，再沿时间线继续探索。
      </p>
    </header>

    <div class="theory-page-content page-width">
      <TheorySection />
      <TimelineSection />
    </div>
  </main>
</template>
