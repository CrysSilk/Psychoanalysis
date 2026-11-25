<script setup>
import { ref } from 'vue'
import { theories } from '../data/theories.js'

// 已展开的节点集合（允许多个卡片同时展开）
const openIds = ref([])

// 没展开就展开，已展开就单独收起
function toggle(id) {
  if (openIds.value.includes(id)) {
    openIds.value = openIds.value.filter(item => item !== id)
  } else {
    openIds.value.push(id)
  }
}
</script>

<template>
  <section id="timeline" class="timeline">
    <!-- 流星装饰 -->
    <span class="meteor" style="--d: 0s; --x: 12%; --y: 8%"></span>
    <span class="meteor" style="--d: 2.8s; --x: 55%; --y: 4%"></span>
    <span class="meteor" style="--d: 5.2s; --x: 80%; --y: 16%"></span>

    <div class="timeline-header">
      <span class="section-tag">TIMELINE</span>
      <h2>精神分析发展史</h2>
      <p class="section-desc">点击时间节点，展开对应人物的理论卡片。</p>
    </div>

    <!-- 时间轴轨道 -->
    <div class="timeline-track">
      <div
        v-for="item in theories"
        :key="item.id"
        class="timeline-item"
      >
        <!-- 轨道上的圆点 -->
        <span class="dot" :class="{ active: openIds.includes(item.id) }"></span>

        <!-- 时间节点：点击切换展开/收起 -->
        <button
          class="node"
          type="button"
          :aria-expanded="openIds.includes(item.id)"
          @click="toggle(item.id)"
        >
          <span class="era">{{ item.era }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="school">{{ item.school }}</span>
          <span class="toggle-icon" aria-hidden="true">{{ openIds.includes(item.id) ? '−' : '+' }}</span>
        </button>

        <!-- 展开的理论卡片，带展开过渡 -->
        <Transition name="expand">
          <div v-if="openIds.includes(item.id)" class="card">
            <div class="card-head">
              <h3>{{ item.name }} · {{ item.school }}</h3>
              <span class="theory-tag">核心理论</span>
            </div>
            <p class="theory">{{ item.coreTheory }}</p>
            <p class="quote">“{{ item.quote }}”</p>
            <p class="intro">{{ item.intro }}</p>
            <p class="ref">参考资料：{{ item.reference }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  position: relative;
  padding: 40px 0 20px;
  overflow-x: clip;
}

/* ===== 流星 ===== */
.meteor {
  position: absolute;
  top: var(--y, 10%);
  left: var(--x, 20%);
  width: 120px;
  height: 1.5px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(214, 204, 255, 0.78));
  border-radius: 999px;
  opacity: 0;
  pointer-events: none;
  animation: meteor 8s linear infinite;
  animation-delay: var(--d, 0s);
}

/* 流星：短暂亮起 + 斜向划过 + 消失，循环 */
@keyframes meteor {
  0%   { opacity: 0; transform: translate(0, 0) rotate(-32deg); }
  4%   { opacity: 0.85; }
  16%  { opacity: 0; transform: translate(220px, 140px) rotate(-32deg); }
  100% { opacity: 0; transform: translate(220px, 140px) rotate(-32deg); }
}

/* 标题区 */
.timeline-header {
  position: relative;
  z-index: 1;
  margin-bottom: 36px;
}

.section-tag {
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--purple);
}

.timeline-header h2 {
  margin: 10px 0 8px;
  color: #f0eef8;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 3.8vw, 38px);
  font-weight: 400;
}

.section-desc {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

/* 时间轴轨道：桌面端中轴线 + 左右交错 */
.timeline-track {
  position: relative;
  z-index: 1;
}

/* 中轴线（带上下渐隐） */
.timeline-track::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(182, 168, 255, 0.5), rgba(182, 168, 255, 0.1));
}

.timeline-item {
  position: relative;
  width: calc(50% - 36px);   /* 每个节点占半边，留出中轴间距 */
  margin-bottom: 18px;
}

/* 奇数项靠左 */
.timeline-item:nth-child(odd) {
  margin-right: auto;
}

/* 偶数项靠右 */
.timeline-item:nth-child(even) {
  margin-left: auto;
}

/* 圆点：奇数项（左侧）贴中轴线 */
.dot {
  position: absolute;
  top: 18px;
  right: -42px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #14192a;
  border: 2px solid var(--purple);
  transition: all 0.25s;
}

/* 偶数项（右侧）圆点贴中轴线另一侧 */
.timeline-item:nth-child(even) .dot {
  right: auto;
  left: -42px;
}

/* 鼠标悬停节点时圆点发亮 */
.timeline-item:hover .dot {
  background: var(--purple-soft);
  box-shadow: 0 0 12px rgba(182, 168, 255, 0.75);
}

/* 选中圆点：脉冲光环 */
.dot.active {
  background: var(--purple-soft);
  animation: pulse 1.8s ease-out infinite;
}

@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(182, 168, 255, 0.55); }
  70%  { box-shadow: 0 0 0 11px rgba(182, 168, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(182, 168, 255, 0); }
}

/* 节点按钮 */
.node {
  display: flex;
  gap: 14px;
  align-items: baseline;
  width: 100%;
  background: rgba(20, 25, 40, 0.45);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  color: inherit;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  padding: 13px 16px;
  transition: border-color 0.25s, background 0.25s, transform 0.25s;
}

.node:hover {
  border-color: var(--line-strong);
  background: rgba(169, 154, 244, 0.1);
  transform: translateX(4px);
}

.node:active {
  transform: translateX(4px) scale(0.99);
}

.era {
  color: var(--purple-soft);
  font-size: 13px;
  font-weight: 600;
  min-width: 96px;
}

.name {
  color: #f0eef8;
  font-weight: 600;
}

.school {
  font-size: 13px;
  color: var(--muted);
}

.toggle-icon {
  margin-left: auto;
  color: var(--purple-soft);
  font-size: 16px;
  line-height: 1;
}

/* 理论卡片 */
.card {
  background: var(--surface-glass);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(182, 168, 255, 0.35);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  margin: 10px 0 16px;
  box-shadow: 0 12px 28px rgba(8, 10, 20, 0.35);
  transition: border-color 0.25s, transform 0.25s;
}

.card:hover {
  border-color: rgba(182, 168, 255, 0.55);
  transform: translateY(-2px);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.card-head h3 {
  margin: 0;
  color: #f0eef8;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px;
  font-weight: 400;
}

.theory-tag {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--purple-soft);
  border: 1px solid rgba(182, 168, 255, 0.35);
  border-radius: 999px;
  padding: 2px 10px;
}

.theory {
  color: #e4e1f5;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 10px;
}

/* 名言：斜体 + 左侧装饰线 */
.quote {
  font-style: italic;
  color: #c6bcef;
  font-size: 13.5px;
  border-left: 2px solid rgba(182, 168, 255, 0.6);
  padding-left: 12px;
  margin: 0 0 12px;
  line-height: 1.65;
}

.intro {
  color: #a9afbf;
  font-size: 14px;
  line-height: 1.75;
  margin: 0 0 10px;
}

.ref {
  font-size: 12.5px;
  color: #7c8399;
  margin: 0;
}

/* 展开过渡 */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* 窄屏适配：回退单列左轨布局 */
@media (max-width: 700px) {
  /* 中轴线移到左侧 */
  .timeline-track::before {
    left: 6px;
    transform: none;
  }

  .timeline-item {
    width: 100%;
    padding-left: 32px;
    margin-bottom: 12px;
  }

  /* 圆点统一贴左侧轨道 */
  .dot,
  .timeline-item:nth-child(even) .dot {
    right: auto;
    left: 0;
  }

  .node {
    flex-direction: column;
    gap: 4px;
  }

  .era {
    min-width: auto;
  }
}

/* 尊重系统的"减少动态效果"设置（无障碍） */
@media (prefers-reduced-motion: reduce) {
  .timeline::before,
  .timeline::after,
  .meteor,
  .dot.active {
    animation: none;
  }
}
</style>
