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
  <section class="timeline">
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
        <button class="node" @click="toggle(item.id)">
          <span class="era">{{ item.era }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="school">{{ item.school }}</span>
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
  max-width: 1080px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* ===== 星空背景（装饰层，不影响内容） ===== */
.timeline::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 12% 18%, rgba(255, 255, 255, 0.9) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 35% 8%, rgba(185, 175, 255, 0.8) 50%, transparent 51%),
    radial-gradient(1px 1px at 58% 30%, rgba(255, 255, 255, 0.7) 50%, transparent 51%),
    radial-gradient(2px 2px at 82% 15%, rgba(255, 255, 255, 0.85) 50%, transparent 51%),
    radial-gradient(1px 1px at 90% 45%, rgba(185, 175, 255, 0.7) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 22% 60%, rgba(255, 255, 255, 0.6) 50%, transparent 51%),
    radial-gradient(1px 1px at 45% 80%, rgba(255, 255, 255, 0.75) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 70% 70%, rgba(185, 175, 255, 0.65) 50%, transparent 51%),
    radial-gradient(1px 1px at 8% 88%, rgba(255, 255, 255, 0.6) 50%, transparent 51%),
    radial-gradient(1px 1px at 95% 90%, rgba(255, 255, 255, 0.7) 50%, transparent 51%);
  animation: twinkle 4s ease-in-out infinite alternate;
}

/* 弥散星云光晕（带缓慢漂移） */
.timeline::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 400px 250px at 15% 10%, rgba(124, 108, 240, 0.14), transparent 70%),
    radial-gradient(ellipse 350px 250px at 85% 85%, rgba(124, 108, 240, 0.12), transparent 70%),
    radial-gradient(ellipse 500px 300px at 50% 55%, rgba(63, 58, 140, 0.16), transparent 75%);
  animation: nebula 16s ease-in-out infinite alternate;
}

/* 星云呼吸式膨胀收缩 */
@keyframes nebula {
  from { transform: scale(1); }
  to   { transform: scale(1.1); }
}

/* ===== 流星 ===== */
.meteor {
  position: absolute;
  top: var(--y, 10%);
  left: var(--x, 20%);
  width: 130px;
  height: 1.5px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9));
  border-radius: 999px;
  opacity: 0;
  pointer-events: none;
  animation: meteor 7s linear infinite;
  animation-delay: var(--d, 0s);
}

/* 流星：短暂亮起 + 斜向划过 + 消失，循环 */
@keyframes meteor {
  0%   { opacity: 0; transform: translate(0, 0) rotate(-32deg); }
  4%   { opacity: 1; }
  16%  { opacity: 0; transform: translate(240px, 150px) rotate(-32deg); }
  100% { opacity: 0; transform: translate(240px, 150px) rotate(-32deg); }
}

/* 星星闪烁 */
@keyframes twinkle {
  from { opacity: 0.4; }
  to   { opacity: 1; }
}

/* 标题区 */
.timeline-header {
  position: relative;
  z-index: 1;
  margin-bottom: 36px;
}

.section-tag {
  font-size: 12px;
  letter-spacing: 3px;
  color: #7c6cf0;
  text-shadow: 0 0 8px rgba(124, 108, 240, 0.8);
}

.timeline-header h2 {
  margin: 8px 0;
  font-size: 28px;
  text-shadow: 0 0 20px rgba(124, 108, 240, 0.4);
}

.section-desc {
  font-size: 14px;
  color: #8a8fa3;
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
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(124, 108, 240, 0.55), rgba(124, 108, 240, 0.12));
}

.timeline-item {
  position: relative;
  width: calc(50% - 36px);   /* 每个节点占半边，留出中轴间距 */
  margin-bottom: 16px;
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
  top: 16px;
  right: -30px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #1a1f35;
  border: 2px solid #7c6cf0;
  transition: all 0.3s;
}

/* 偶数项（右侧）圆点贴中轴线另一侧 */
.timeline-item:nth-child(even) .dot {
  right: auto;
  left: -30px;
}

/* 鼠标悬停节点时圆点发亮 */
.timeline-item:hover .dot {
  background: #7c6cf0;
  box-shadow: 0 0 10px rgba(124, 108, 240, 0.8);
}

/* 选中圆点：脉冲光环 */
.dot.active {
  background: #7c6cf0;
  animation: pulse 1.6s ease-out infinite;
}

@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(124, 108, 240, 0.6); }
  70%  { box-shadow: 0 0 0 12px rgba(124, 108, 240, 0); }
  100% { box-shadow: 0 0 0 0 rgba(124, 108, 240, 0); }
}

/* 节点按钮 */
.node {
  display: flex;
  gap: 16px;
  align-items: baseline;
  width: 100%;
  background: none;
  border: none;
  border-radius: 8px;
  color: inherit;
  font-size: 16px;
  cursor: pointer;
  padding: 12px 14px;
  transition: all 0.3s ease;
}

/* 悬停：整体右移 + 背景亮起 */
.node:hover {
  background: rgba(124, 108, 240, 0.1);
  transform: translateX(6px);
}

/* 按下：轻微缩小，产生"按下去"的手感 */
.node:active {
  transform: translateX(6px) scale(0.98);
}

/* 键盘选中时的轮廓（无障碍） */
.node:focus-visible {
  outline: 1px solid #7c6cf0;
  outline-offset: 2px;
}

/* 悬停时文字发光 */
.node:hover .era {
  text-shadow: 0 0 10px rgba(124, 108, 240, 0.9);
}

.node:hover .name {
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

.era {
  color: #7c6cf0;
  font-weight: bold;
  min-width: 110px;   /* 对齐时间 */
}

.name {
  font-weight: bold;
}

.school {
  font-size: 14px;
  color: #8a8fa3;
}

/* 理论卡片 */
.card {
  background: rgba(26, 31, 53, 0.85);
  border: 1px solid rgba(124, 108, 240, 0.45);
  border-radius: 10px;
  padding: 18px 20px;
  margin: 8px 0 16px;
  box-shadow:
    0 0 20px rgba(124, 108, 240, 0.15),
    inset 0 0 30px rgba(124, 108, 240, 0.05);
  transition: box-shadow 0.3s, transform 0.3s;
}

/* 悬停卡片：轻微上浮 + 光晕加强 */
.card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 30px rgba(124, 108, 240, 0.3),
    inset 0 0 30px rgba(124, 108, 240, 0.08);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.card-head h3 {
  margin: 0;
}

.theory-tag {
  flex-shrink: 0;
  font-size: 12px;
  color: #b9afff;
  border: 1px solid rgba(124, 108, 240, 0.4);
  border-radius: 4px;
  padding: 2px 8px;
}

.theory {
  color: #d8dcff;
  margin: 0 0 8px;
}

/* 名言：斜体 + 左侧装饰线 */
.quote {
  font-style: italic;
  color: #b9afff;
  border-left: 3px solid rgba(124, 108, 240, 0.6);
  padding-left: 12px;
  margin: 0 0 10px;
  line-height: 1.6;
}

.intro {
  line-height: 1.7;
  margin: 0 0 8px;
}

.ref {
  font-size: 13px;
  color: #999;
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
