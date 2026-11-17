<script setup>
import { RouterLink } from 'vue-router'
import GalaxyCanvas from './GalaxyCanvas.vue'
</script>

<template>
  <section id="home" class="hero">
    <div class="hero-background" aria-hidden="true"></div>

    <div class="hero-content">
      <p class="eyebrow">REALM OF UNCONSCIOUS · 精神分析学</p>
      <h1>意识之下<br /><span>潜意识之中</span></h1>
      <p class="hero-description">
        我们如何理解那些未被察觉的欲望、记忆与情绪？<br />
        从精神分析的视角，开启一段关于内在世界的探索。
      </p>
      <div class="hero-actions">
        <RouterLink class="hero-button" to="/guide">
          从基础开始 <span aria-hidden="true">↗</span>
        </RouterLink>
        <RouterLink class="hero-secondary" to="/theories">
          浏览理论脉络
        </RouterLink>
      </div>
    </div>

    <div class="hero-orbit" aria-hidden="true">
      <span class="orbit-halo"></span>
      <GalaxyCanvas />
    </div>
  </section>
</template>