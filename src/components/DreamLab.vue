<script setup>
import { ref } from 'vue'
import { dreamSymbols } from '../data/dreams.js'

// 当前选中的梦境意象（null 表示未选择）
const selectedDream = ref(null)

function selectDream(dream) {
  selectedDream.value = dream
}
</script>

<template>
  <section id="dream" class="dream-lab">
    <h2>梦境实验室</h2>
    <p class="notice">
      以下解析仅为精神分析理论视角下的解释示例，不构成对个人心理状态的判断。
    </p>

    <!-- 意象选择区 -->
    <div class="symbol-list">
      <button
        v-for="dream in dreamSymbols"
        :key="dream.id"
        class="symbol-btn"
        :class="{ active: selectedDream && selectedDream.id === dream.id }"
        @click="selectDream(dream)"
      >
        {{ dream.title }}
      </button>
    </div>

    <!-- 解析展示区：未选中时给提示 -->
    <div v-if="selectedDream" class="result" :key="selectedDream.id">
      <h3>{{ selectedDream.title }}</h3>
      <p><strong>显性梦境：</strong>{{ selectedDream.manifest }}</p>
      <p><strong>隐性内容（理论视角）：</strong>{{ selectedDream.latent }}</p>
      <p><strong>相关机制：</strong>{{ selectedDream.mechanism }}</p>
    </div>
    <p v-else class="placeholder">请选择一个梦境意象开始探索 →</p>
  </section>
</template>

<style scoped>
.dream-lab {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.notice {
  font-size: 13px;
  color: #999;
}

.symbol-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0;
}

.symbol-btn {
  padding: 8px 20px;
  border: 1px solid #7c6cf0;
  border-radius: 20px;
  background: none;
  color: inherit;
  font-size: 15px;
  cursor: pointer;
}

/* 选中状态高亮 */
.symbol-btn.active {
  background: #7c6cf0;
  color: #fff;
}

.result {
  background: rgba(124, 108, 240, 0.1);
  border-radius: 8px;
  padding: 20px;
}

.placeholder {
  color: #666;
}
</style>
