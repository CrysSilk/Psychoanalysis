<script setup>
import { computed } from 'vue'
import { usePsychoStore } from '../stores/usePsychoStore'

const store = usePsychoStore()

const personalities = [
  {
    id: 'Id',
    index: '01',
    name: '本我',
    principle: '快乐原则 · Pleasure Principle',
    description: '代表原始欲望、本能需求与即时满足的倾向。',
    detail:
      '本我是人格中最原始、深层的部分，位于潜意识之中。它不考虑现实条件与道德限制，只追求冲动的即时释放与满足。',
    tension: '常与超我的道德要求产生冲突，需要自我在现实中寻找妥协的出口。'
  },
  {
    id: 'Ego',
    index: '02',
    name: '自我',
    principle: '现实原则 · Reality Principle',
    description: '协调本能需求、现实环境与内在规范。',
    detail:
      '自我是人格中面向外部现实的协调者，横跨意识与潜意识。它通过理性思考、延迟满足与防御机制，在可行范围内回应本我的需求。',
    tension: '在“本我的冲动”、“超我的理想”与“外部现实的限制”三者之间持续寻求动态平衡。'
  },
  {
    id: 'Superego',
    index: '03',
    name: '超我',
    principle: '道德原则 · Moral Principle',
    description: '代表内化的道德规范、理想与价值要求。',
    detail:
      '超我源于童年期对父母与社会规范的内化，包含“良心”与“自我理想”两个面向，用来评估行为是否符合道德与理想标准。',
    tension: '当自我或本我偏离其理想标准时，超我可能通过内疚感或自豪感来施加影响。'
  }
]

const activeItem = computed(
  () => personalities.find((item) => item.id === store.activePersonality) ?? personalities[1]
)

function selectPersonality(id) {
  store.setActivePersonality(id)
}
</script>

<template>
  <section id="personality" class="personality-section page-width">
    <div class="section-head">
      <p class="eyebrow">TRIPARTITE MODEL</p>
      <h2>人格的三元结构</h2>
      <p class="subtitle">点击下方卡片，观察本我、自我与超我各自遵循的原则与内在张力</p>
    </div>

    <div class="personality-list" role="tablist" aria-label="人格结构模型">
      <button
        v-for="item in personalities"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="store.activePersonality === item.id"
        class="personality-card"
        :class="{ active: store.activePersonality === item.id }"
        @click="selectPersonality(item.id)"
      >
        <div class="card-top">
          <span class="card-index">{{ item.index }}</span>
          <span class="card-en">{{ item.id.toUpperCase() }}</span>
        </div>
        <h3>{{ item.name }}</h3>
        <p class="card-principle">{{ item.principle }}</p>
        <p class="card-desc">{{ item.description }}</p>
      </button>
    </div>

    <Transition name="page" mode="out-in">
      <article :key="activeItem.id" class="personality-detail" role="tabpanel">
        <div class="detail-header">
          <span class="detail-badge">{{ activeItem.principle }}</span>
          <h3>{{ activeItem.name }} · {{ activeItem.id }}</h3>
        </div>
        <p class="detail-body">{{ activeItem.detail }}</p>
        <p class="detail-tension">
          <span>结构张力</span>
          {{ activeItem.tension }}
        </p>
      </article>
    </Transition>
  </section>
</template>

<style scoped>
.personality-section {
  padding-top: 12px;
  padding-bottom: 90px;
}

.section-head {
  margin-bottom: 32px;
}

.section-head .eyebrow {
  margin: 0 0 10px;
}

.section-head h2 {
  margin: 0;
  color: #f0eef8;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 3.6vw, 38px);
  font-weight: 400;
}

.subtitle {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
}

.personality-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.personality-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 26px 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  backdrop-filter: blur(8px);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
}

.personality-card:hover {
  border-color: rgba(182, 168, 255, 0.42);
  transform: translateY(-4px);
}

.personality-card.active {
  border-color: rgba(182, 168, 255, 0.65);
  background: linear-gradient(145deg, rgba(46, 42, 74, 0.88), rgba(20, 25, 42, 0.84));
  box-shadow: 0 14px 32px rgba(10, 12, 24, 0.45), 0 0 24px rgba(169, 154, 244, 0.16);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.card-en {
  color: #8f96aa;
  font-size: 11px;
  letter-spacing: 0.16em;
}

.personality-card.active .card-en {
  color: var(--purple-soft);
}

.personality-card h3 {
  margin: 0;
  color: #f0eef8;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
}

.card-principle {
  margin: 8px 0 12px;
  color: var(--purple-soft);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.card-desc {
  margin: 0;
  color: #a2a8b8;
  font-size: 13.5px;
  line-height: 1.75;
}

.personality-detail {
  margin-top: 22px;
  padding: 28px 30px;
  border: 1px solid var(--line);
  border-left: 2px solid var(--purple-soft);
  border-radius: var(--radius-md);
  background: var(--surface-glass);
  backdrop-filter: blur(10px);
}

.detail-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
  margin-bottom: 14px;
}

.detail-badge {
  padding: 4px 12px;
  border: 1px solid rgba(182, 168, 255, 0.32);
  border-radius: 999px;
  background: rgba(169, 154, 244, 0.12);
  color: var(--purple-soft);
  font-size: 12px;
}

.detail-header h3 {
  margin: 0;
  color: #f0eef8;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
}

.detail-body {
  margin: 0 0 14px;
  color: #cfd3e0;
  font-size: 14.5px;
  line-height: 1.85;
}

.detail-tension {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  color: #9da3b5;
  font-size: 13.5px;
  line-height: 1.75;
}

.detail-tension span {
  flex-shrink: 0;
  color: var(--gold-soft);
  font-size: 12px;
  letter-spacing: 0.08em;
}

@media (max-width: 860px) {
  .personality-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .personality-detail {
    padding: 22px 20px;
  }

  .detail-tension {
    flex-direction: column;
    gap: 6px;
  }
}
</style>