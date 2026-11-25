<script setup lang="ts">
import { RouterLink } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'

const explorations = [
  {
    number: '01',
    title: '认识精神分析',
    description: '从潜意识、梦与心理防御开始，了解这套理论如何看待人的内在世界。',
    to: '/guide',
    label: '从基础概念开始'
  },
  {
    number: '02',
    title: '理论与人物',
    description: '沿着时间线认识精神分析的发展，以及提出重要观点的思想家。',
    to: '/theories',
    label: '浏览理论脉络'
  },
  {
    number: '03',
    title: '人格结构',
    description: '探索本我、自我与超我这三个概念，以及它们之间的张力。',
    to: '/personality',
    label: '了解三元结构'
  },
  {
    number: '04',
    title: '梦境探索',
    description: '通过常见梦境意象，看看精神分析理论会如何提出解释。',
    to: '/dreams',
    label: '进入梦境实验室'
  }
]
</script>

<template>
  <main>
    <HeroSection />

    <section class="home-discovery page-width">
      <div class="discovery-heading">
        <div>
          <h2>从一个问题，<span>开始探索。</span></h2>
        </div>
      </div>

      <div class="explore-grid">
        <RouterLink
          v-for="item in explorations"
          :key="item.to"
          :to="item.to"
          class="explore-card"
        >
          <span class="explore-number">{{ item.number }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <span class="explore-link">{{ item.label }} <span aria-hidden="true">↗</span></span>
        </RouterLink>
      </div>

      <div class="home-note">
        <span class="note-mark" aria-hidden="true">✦</span>
        <p>
          精神分析是一种理解心理经验的理论视角。本站内容用于科普与学习交流，不构成任何心理诊断或医疗建议。
        </p>
        <RouterLink to="/references">查看参考资料与说明</RouterLink>
      </div>
    </section>
  </main>
</template>