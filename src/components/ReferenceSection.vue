<script setup>
// 站点参考资料与免责声明
const references = [
  { title: '《癔症研究》', author: '布洛伊尔 & 弗洛伊德', year: 1895 },
  { title: '《梦的解析》', author: '弗洛伊德', year: 1900 },
  { title: '《自我与防御机制》', author: '安娜·弗洛伊德', year: 1936 },
  { title: '《镜像阶段》', author: '拉康', year: 1949 },
  { title: '《自卑与超越》', author: '阿德勒', year: 1932 },
  { title: '《人及其象征》', author: '荣格', year: 1964 },
  {
    title: '《通识：学问的门类》',
    author: '[日] 茂木健一郎 主编',
    year: null,
    note: '“精神分析学”章节（P84–P88、P100）'
  }
]
</script>

<template>
  <section class="references">
    <div class="ref-header">
      <span class="section-tag">REFERENCES</span>
      <h2>参考资料</h2>
    </div>

    <ul class="ref-list">
      <li v-for="ref in references" :key="ref.title">
        <span class="ref-title">{{ ref.title }}</span>
        <span class="ref-author">{{ ref.author }}</span>
        <span v-if="ref.year" class="ref-year">{{ ref.year }}</span>
        <span v-else-if="ref.note" class="ref-year">{{ ref.note }}</span>
      </li>
    </ul>

    <p class="disclaimer">
      * 本站内容为课程学习成果展示，所有梦的解析均为精神分析理论视角下的示例，
      不构成任何心理诊断或医疗建议。如有心理困扰，请寻求专业帮助。
    </p>
  </section>
</template>

<style scoped>
.references {
  position: relative;
  max-width: 1080px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* 星云光晕（与其他区块呼应，营造氛围） */
.references::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 400px 250px at 20% 80%, rgba(124, 108, 240, 0.12), transparent 70%),
    radial-gradient(ellipse 350px 250px at 85% 15%, rgba(124, 108, 240, 0.1), transparent 70%);
}

.ref-header {
  position: relative;
  z-index: 1;
  margin-bottom: 24px;
}

.section-tag {
  font-size: 12px;
  letter-spacing: 3px;
  color: #7c6cf0;
  text-shadow: 0 0 8px rgba(124, 108, 240, 0.8);
}

.ref-header h2 {
  margin: 8px 0;
  font-size: 28px;
  text-shadow: 0 0 20px rgba(124, 108, 240, 0.4);
}

.ref-list {
  position: relative;
  z-index: 1;
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
}

.ref-list li {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 10px 14px;
  border-bottom: 1px dashed rgba(124, 108, 240, 0.25);
  transition: background 0.3s;
}

.ref-list li:hover {
  background: rgba(124, 108, 240, 0.08);
}

.ref-title {
  font-weight: bold;
  color: #d8dcff;
}

.ref-author {
  color: #8a8fa3;
  font-size: 14px;
}

.ref-year {
  margin-left: auto;
  font-size: 13px;
  color: #6b7080;
}

.disclaimer {
  position: relative;
  z-index: 1;
  font-size: 13px;
  color: #6b7080;
  line-height: 1.7;
  border-left: 3px solid rgba(124, 108, 240, 0.4);
  padding-left: 12px;
}

@media (max-width: 600px) {
  .ref-list li {
    flex-direction: column;
    gap: 4px;
  }

  .ref-year {
    margin-left: 0;
  }
}

/* 尊重系统的"减少动态效果"设置（无障碍） */
@media (prefers-reduced-motion: reduce) {
  .references::after {
    animation: none;
  }
}
</style>
