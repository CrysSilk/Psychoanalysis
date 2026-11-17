<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="content-page">
    <header class="page-intro page-width">
      <p class="eyebrow">01 / THE BEGINNING</p>
      <h1>认识精神分析</h1>
      <p class="page-lead">
        精神分析提供了一种理解内在经验的视角：有些影响我们的心理过程，并不总能被意识直接察觉。
        从几个基础概念出发，慢慢认识这片内在风景。
      </p>
      <RouterLink class="text-link" to="/theories">接着认识理论发展脉络 <span aria-hidden="true">↗</span></RouterLink>
    </header>

    <section class="foundation-grid page-width" aria-label="基础概念">
      <article class="foundation-card">
        <span class="card-index">A — 01</span>
        <h2>潜意识</h2>
        <p>
          精神分析关注意识之外的心理过程，尝试理解记忆、愿望与冲突如何影响我们的感受和行为。
          潜意识是理论中的重要概念，不是对个人状态的简单诊断。
        </p>
        <span class="card-foot">A WAY TO ASK, NOT A FINAL ANSWER</span>
      </article>
      <article class="foundation-card">
        <span class="card-index">A — 02</span>
        <h2>梦与联想</h2>
        <p>
          在经典精神分析中，梦与自由联想曾被用来探索心理经验。
          同一个梦境可能有不同理解，个人的联想与生活语境比固定的“梦境词典”更重要。
        </p>
        <span class="card-foot">MEANING DEPENDS ON CONTEXT</span>
      </article>
      <article class="foundation-card">
        <span class="card-index">A — 03</span>
        <h2>心理防御</h2>
        <p>
          防御机制描述人们应对冲突或不适感的一些心理方式。
          它们是理论中的解释框架，不应被用来给自己或他人贴上标签。
        </p>
        <span class="card-foot">NOTICE WITHOUT LABELING</span>
      </article>
    </section>

    <section class="page-callout page-width">
      <span class="callout-symbol" aria-hidden="true">✦</span>
      <div>
        <p class="eyebrow">KEEP EXPLORING</p>
        <h2>从概念，走向不同的理论声音。</h2>
      </div>
      <RouterLink class="hero-button" to="/theories">探索理论脉络 <span aria-hidden="true">↗</span></RouterLink>
    </section>
  </main>
</template>
