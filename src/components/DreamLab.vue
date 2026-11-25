<script setup>
import { computed, ref } from 'vue'
import { dreamSymbols, dreamMechanisms } from '../data/dreams.js'

const activeFilter = ref('全部')
const filters = ['全部', '象征化', '移置', '凝缩']

const filteredDreams = computed(() =>
  activeFilter.value === '全部'
    ? dreamSymbols
    : dreamSymbols.filter((dream) => dream.mechanism === activeFilter.value)
)
</script>

<template>
  <section id="dream" class="dream-lab page-width">
    <!-- 流星装饰 -->
    <span class="meteor" style="--d: 1.4s; --x: 18%; --y: 6%"></span>
    <span class="meteor" style="--d: 4.6s; --x: 70%; --y: 12%"></span>

    <!-- 月亮装饰 -->
    <span class="moon" aria-hidden="true"></span>

    <div class="lab-header">
      <span class="section-tag">DREAM LAB</span>
      <h2>梦境实验室</h2>
      <p class="notice">
        以下解析仅为精神分析理论视角下的解释示例，不构成对个人心理状态的判断。
      </p>

      <div class="filter-bar" role="group" aria-label="按梦的改装机制筛选">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          class="filter-pill"
          :class="{ active: activeFilter === filter }"
          :aria-pressed="activeFilter === filter"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- 两列网格：每行左右各一张示例卡片，向下排列 -->
    <div class="dream-grid">
      <div
        v-for="dream in filteredDreams"
        :key="dream.id"
        class="result"
      >
        <div class="result-head">
          <h3>{{ dream.title }}</h3>
          <span class="mechanism-tag">{{ dream.mechanism }}</span>
        </div>
        <div class="result-body">
          <p class="row">
            <span class="label">显性梦境</span>
            {{ dream.manifest }}
          </p>
          <p class="row">
            <span class="label">隐性内容</span>
            {{ dream.latent }}
          </p>
        </div>
        <p class="tip">* 隐性内容为理论视角下的解释示例，不代表确定结论。</p>
      </div>
    </div>

    <!-- 梦的改装机制：弗洛伊德归纳的四种方式 -->
    <div class="mechanisms">
      <h3 class="mech-title">梦的改装 · 四种机制</h3>
      <div class="mech-grid">
        <div
          v-for="mech in dreamMechanisms"
          :key="mech.name"
          class="mech-card"
        >
          <h4>{{ mech.name }}</h4>
          <p>{{ mech.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dream-lab {
  position: relative;
  padding: 20px 0 90px;
  overflow-x: clip;
}

/* ===== 月亮 ===== */
.moon {
  position: absolute;
  top: 24px;
  right: 28px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fdf6e3, #d8cf9e 60%, #b9b183);
  box-shadow:
    0 0 24px rgba(253, 246, 227, 0.3),
    0 0 64px rgba(253, 246, 227, 0.14);
  pointer-events: none;
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
.lab-header {
  position: relative;
  z-index: 1;
  margin-bottom: 28px;
}

.section-tag {
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--purple);
}

.lab-header h2 {
  margin: 10px 0 8px;
  color: #f0eef8;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 3.8vw, 38px);
  font-weight: 400;
}

.notice {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.filter-pill {
  padding: 6px 15px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(20, 25, 40, 0.6);
  color: #9da3b5;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.filter-pill:hover {
  border-color: var(--line-strong);
  color: #ece9f8;
}

.filter-pill.active {
  border-color: rgba(182, 168, 255, 0.65);
  background: rgba(169, 154, 244, 0.16);
  color: #f0eef8;
}

/* ===== 两列网格：每行 2 张卡片，占满宽度，向下排列 ===== */
.dream-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

/* 示例卡片 */
.result {
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  backdrop-filter: blur(8px);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 24px 26px;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}

.result:hover {
  border-color: var(--line-strong);
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(10, 12, 24, 0.38), 0 0 22px rgba(169, 154, 244, 0.12);
}

.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.result-head h3 {
  margin: 0;
  color: #f0eef8;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
}

/* 机制标签 */
.mechanism-tag {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--purple-soft);
  border: 1px solid rgba(182, 168, 255, 0.3);
  background: rgba(169, 154, 244, 0.12);
  border-radius: 999px;
  padding: 3px 12px;
}

.row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 0 0 12px;
  color: #b4bac9;
  font-size: 14px;
  line-height: 1.75;
}

.label {
  flex-shrink: 0;
  width: 72px;
  text-align: center;
  font-size: 12px;
  color: var(--purple-soft);
  border: 1px solid rgba(182, 168, 255, 0.3);
  border-radius: 4px;
  padding: 2px 0;
}

.tip {
  margin-top: auto;
  padding-top: 6px;
  font-size: 12px;
  color: #747b91;
  margin-bottom: 0;
}

/* ===== 梦的改装机制区 ===== */
.mechanisms {
  position: relative;
  z-index: 1;
  margin-top: 48px;
}

.mech-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  color: #ebe8f7;
  margin: 0 0 18px;
}

.mech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* 机制小卡片 */
.mech-card {
  background: var(--surface-glass);
  backdrop-filter: blur(8px);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 20px;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}

.mech-card:hover {
  border-color: var(--line-strong);
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(10, 12, 24, 0.34);
}

.mech-card h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--purple-soft);
}

.mech-card p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: #9ba1b3;
}

/* 窄屏适配：手机上改回单列 */
@media (max-width: 700px) {
  .dream-grid {
    grid-template-columns: 1fr;
  }

  .row {
    flex-direction: column;
    gap: 4px;
  }

  .label {
    width: auto;
    padding: 2px 8px;
  }

  /* 窄屏时月亮缩小并贴边 */
  .moon {
    width: 36px;
    height: 36px;
    right: 30px;
    top: 40px;
  }

  /* 机制卡片：平板 2 列，手机 1 列 */
  .mech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .mech-grid {
    grid-template-columns: 1fr;
  }
}

/* 尊重系统的"减少动态效果"设置（无障碍） */
@media (prefers-reduced-motion: reduce) {
  .dream-lab::before,
  .dream-lab::after,
  .meteor,
  .moon {
    animation: none;
  }
}
</style>
