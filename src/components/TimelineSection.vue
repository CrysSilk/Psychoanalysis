<script setup>
import { ref } from 'vue'
import { theories } from '../data/theories.js'

// 当前选中的理论节点（null 表示没选中）
const selectedId = ref(null)

function toggle(id) {
  // 再点一次同一个节点就收起
  selectedId.value = selectedId.value === id ? null : id
}
</script>

<template>
  <section class="timeline">
    <h2>精神分析发展史</h2>

    <div
      v-for="item in theories"
      :key="item.id"
      class="timeline-item"
    >
      <!-- 时间节点：点击切换展开/收起 -->
      <button class="node" @click="toggle(item.id)">
        <span class="era">{{ item.era }}</span>
        <span class="name">{{ item.name }}</span>
        <span class="school">{{ item.school }}</span>
      </button>

      <!-- 选中才显示的理论卡片 -->
      <div v-if="selectedId === item.id" class="card">
        <h3>{{ item.name }} · {{ item.school }}</h3>
        <p><strong>核心理论：</strong>{{ item.coreTheory }}</p>
        <p>{{ item.intro }}</p>
        <p class="ref">参考资料：{{ item.reference }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.timeline-item {
  border-left: 2px solid #7c6cf0;   /* 左侧竖线做出时间轴效果 */
  padding-left: 24px;
  margin-bottom: 16px;
}

.node {
  display: flex;
  gap: 16px;
  align-items: baseline;
  background: none;
  border: none;
  color: inherit;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 0;
}

.era {
  color: #7c6cf0;
  font-weight: bold;
  min-width: 110px;   /* 对齐时间 */
}

.card {
  background: rgba(124, 108, 240, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0 16px;
}

.ref {
  font-size: 13px;
  color: #999;
}
</style>
