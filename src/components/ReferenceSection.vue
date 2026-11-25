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
  <section class="references page-width">
    <div class="ref-header">
      <span class="section-tag">REFERENCES</span>
      <h2>参考资料</h2>
    </div>

    <ul class="ref-list">
      <li v-for="(refItem, index) in references" :key="refItem.title">
        <span class="ref-index">0{{ index + 1 }}</span>
        <span class="ref-title">{{ refItem.title }}</span>
        <span class="ref-author">{{ refItem.author }}</span>
        <span v-if="refItem.year" class="ref-year">{{ refItem.year }}</span>
        <span v-else-if="refItem.note" class="ref-year">{{ refItem.note }}</span>
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
  padding: 16px 0 90px;
}

.ref-header {
  position: relative;
  z-index: 1;
  margin-bottom: 24px;
}

.section-tag {
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--purple);
}

.ref-header h2 {
  margin: 10px 0 0;
  color: #f0eef8;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 3.8vw, 38px);
  font-weight: 400;
}

.ref-list {
  position: relative;
  z-index: 1;
  list-style: none;
  margin: 0 0 28px;
  padding: 6px 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface-glass);
  backdrop-filter: blur(8px);
}

.ref-list li {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 16px 22px;
  border-bottom: 1px solid var(--line);
  transition: background 0.2s;
}

.ref-list li:last-child {
  border-bottom: 0;
}

.ref-list li:hover {
  background: rgba(169, 154, 244, 0.08);
}

.ref-index {
  flex-shrink: 0;
  color: var(--purple-soft);
  font-size: 12px;
  letter-spacing: 0.12em;
}

.ref-title {
  font-weight: 600;
  color: #ebe8f7;
  font-size: 15px;
}

.ref-author {
  color: #9ba1b3;
  font-size: 14px;
}

.ref-year {
  margin-left: auto;
  font-size: 13px;
  color: #7c8399;
}

.disclaimer {
  position: relative;
  z-index: 1;
  font-size: 13.5px;
  color: #8c92a5;
  line-height: 1.8;
  border: 1px solid var(--line);
  border-left: 2px solid rgba(182, 168, 255, 0.55);
  border-radius: var(--radius-sm);
  background: var(--surface-glass);
  padding: 16px 20px;
  margin: 0;
}

@media (max-width: 600px) {
  .ref-list li {
    flex-direction: column;
    gap: 4px;
    padding: 14px 18px;
  }

  .ref-year {
    margin-left: 0;
  }
}
</style>
