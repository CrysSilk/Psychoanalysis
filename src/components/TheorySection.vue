<script setup lang="ts">
import { ref } from 'vue'

const activeTheory = ref(0)

const theories = [
  {
    name: '本我',
    english: 'ID',
    description: '遵循快乐原则，代表原始本能与欲望。'
  },
  {
    name: '自我',
    english: 'EGO',
    description: '遵循现实原则，协调本能欲望与外部现实。'
  },
  {
    name: '超我',
    english: 'SUPEREGO',
    description: '代表内化的道德规范与理想标准。'
  }
]
</script>

<template>
  <section id="theories" class="theory-section section">
    <div class="section-label">02 — PSYCHIC STRUCTURE</div>

    <h2>心灵的三个层次</h2>

    <div class="theory-layout">
      <div class="theory-list">
        <button
          v-for="(item, index) in theories"
          :key="item.english"
          :class="{ active: activeTheory === index }"
          @click="activeTheory = index"
        >
          <span>0{{ index + 1 }}</span>
          {{ item.name }}
          <span>↗</span>
        </button>
      </div>

      <div class="theory-detail">
        <span>{{ theories[activeTheory].english }}</span>

        <h3>{{ theories[activeTheory].name }}</h3>

        <p>{{ theories[activeTheory].description }}</p>
      </div>
    </div>
  </section>
</template>