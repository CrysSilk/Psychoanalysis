<script setup>
import { dreamSymbols } from '../data/dreams.js'
</script>

<template>
  <section id="dream" class="dream-lab">
    <div class="lab-header">
      <span class="section-tag">DREAM LAB</span>
      <h2>梦境实验室</h2>
      <p class="notice">
        以下解析仅为精神分析理论视角下的解释示例，不构成对个人心理状态的判断。
      </p>
    </div>

    <!-- 两列网格：每行左右各一张示例卡片，向下排列 -->
    <div class="dream-grid">
      <div
        v-for="dream in dreamSymbols"
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
  </section>
</template>

<style scoped>
.dream-lab {
  position: relative;
  max-width: 1080px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* ===== 星空背景 ===== */
.dream-lab::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 18% 22%, rgba(255, 255, 255, 0.9) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 42% 10%, rgba(185, 175, 255, 0.8) 50%, transparent 51%),
    radial-gradient(1px 1px at 65% 35%, rgba(255, 255, 255, 0.7) 50%, transparent 51%),
    radial-gradient(2px 2px at 88% 20%, rgba(255, 255, 255, 0.85) 50%, transparent 51%),
    radial-gradient(1px 1px at 75% 55%, rgba(185, 175, 255, 0.7) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 30% 70%, rgba(255, 255, 255, 0.6) 50%, transparent 51%),
    radial-gradient(1px 1px at 50% 90%, rgba(255, 255, 255, 0.75) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 8% 55%, rgba(185, 175, 255, 0.65) 50%, transparent 51%),
    radial-gradient(1px 1px at 92% 80%, rgba(255, 255, 255, 0.7) 50%, transparent 51%),
    radial-gradient(1px 1px at 60% 5%, rgba(255, 255, 255, 0.65) 50%, transparent 51%);
  animation: twinkle 4s ease-in-out infinite alternate;
}

/* 弥散星云光晕 */
.dream-lab::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 400px 250px at 80% 12%, rgba(124, 108, 240, 0.12), transparent 70%),
    radial-gradient(ellipse 350px 250px at 10% 80%, rgba(124, 108, 240, 0.1), transparent 70%);
}

@keyframes twinkle {
  from { opacity: 0.4; }
  to   { opacity: 1; }
}

/* 标题区 */
.lab-header {
  position: relative;
  z-index: 1;
  margin-bottom: 28px;
}

.section-tag {
  font-size: 12px;
  letter-spacing: 3px;
  color: #7c6cf0;
  text-shadow: 0 0 8px rgba(124, 108, 240, 0.8);
}

.lab-header h2 {
  margin: 8px 0;
  font-size: 28px;
  text-shadow: 0 0 20px rgba(124, 108, 240, 0.4);
}

.notice {
  font-size: 13px;
  color: #8a8fa3;
}

/* ===== 两列网格：每行 2 张卡片，占满宽度，向下排列 ===== */
.dream-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 左右各占一半 */
  gap: 20px;                        /* 卡片之间的间距 */
}

/* 示例卡片 */
.result {
  background: rgba(26, 31, 53, 0.85);
  border: 1px solid rgba(124, 108, 240, 0.45);
  border-radius: 10px;
  padding: 22px 24px;
  box-shadow:
    0 0 24px rgba(124, 108, 240, 0.18),
    inset 0 0 30px rgba(124, 108, 240, 0.05);
  transition: box-shadow 0.3s, transform 0.3s;
}

/* 悬停卡片：轻微上浮 + 光晕加强 */
.result:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 34px rgba(124, 108, 240, 0.32),
    inset 0 0 30px rgba(124, 108, 240, 0.08);
}

.result-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.result-head h3 {
  margin: 0;
}

/* 机制标签 */
.mechanism-tag {
  font-size: 12px;
  color: #b9afff;
  background: rgba(124, 108, 240, 0.25);
  border-radius: 12px;
  padding: 3px 12px;
}

.row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 0 0 12px;
  line-height: 1.7;
}

.label {
  flex-shrink: 0;
  width: 76px;
  text-align: center;
  font-size: 12px;
  color: #b9afff;
  border: 1px solid rgba(124, 108, 240, 0.4);
  border-radius: 4px;
  padding: 2px 0;
}

.tip {
  font-size: 12px;
  color: #6b7080;
  margin: 0;
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
}
</style>
