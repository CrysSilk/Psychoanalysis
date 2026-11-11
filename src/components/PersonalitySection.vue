<script setup>
import { usePsychoStore } from '../stores/usePsychoStore'

const store = usePsychoStore()

const personalities = [
  {
    id: 'Id',
    name: '本我',
    description: '代表原始欲望、本能需求与即时满足的倾向。'
  },
  {
    id: 'Ego',
    name: '自我',
    description: '协调本能需求、现实环境与内在规范。'
  },
  {
    id: 'Superego',
    name: '超我',
    description: '代表内化的道德规范、理想与价值要求。'
  }
]

function selectPersonality(id) {
  store.setActivePersonality(id)
}
</script>

<template>
  <section id="personality" class="personality-section section">
    <h2>人格的三元结构</h2>

    <p class="subtitle">
      探索本我、自我与超我的关系
    </p>

    <div class="personality-list">
      <button
        v-for="item in personalities"
        :key="item.id"
        class="personality-card"
        :class="{
          active: store.activePersonality === item.id
        }"
        @click="selectPersonality(item.id)"
      >
        <h3>{{ item.name }}</h3>

        <span>{{ item.id }}</span>

        <p>{{ item.description }}</p>
      </button>
    </div>

    <div class="personality-result">
      当前选择：

      <strong>
        {{ personalities.find(
          item => item.id === store.activePersonality
        )?.name }}
      </strong>
    </div>
  </section>
</template>

<style scoped>
.personality-section {
  padding: 80px 24px;
  text-align: center;
}

.subtitle {
  color: #888;
  margin-bottom: 32px;
}

.personality-list {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.personality-card {
  width: 240px;
  padding: 28px 20px;
  border: 1px solid #777;
  border-radius: 12px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: 0.25s;
}

.personality-card:hover {
  transform: translateY(-5px);
}

.personality-card.active {
  border-color: #a78bfa;
  background: rgba(167, 139, 250, 0.12);
  box-shadow: 0 0 18px rgba(167, 139, 250, 0.2);
}

.personality-card span {
  display: block;
  margin: 12px 0;
  opacity: 0.6;
}

.personality-result {
  margin-top: 32px;
}
</style>