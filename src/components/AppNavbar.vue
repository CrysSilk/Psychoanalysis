<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePsychoStore } from '../stores/usePsychoStore'

const store = usePsychoStore()

const scrolled = ref(false)

const navItems = [
  { name: '首页', target: '#home' },
  { name: '导言', target: '#introduction' },
  { name: '理论', target: '#theories' },
  { name: '发展史', target: '#timeline' },
  { name: '梦境', target: '#dream' },
  { name: '发展史', target: '#timeline' },
  { name: '梦境', target: '#dream' },
  { name: '人格结构', target: '#personality' }
]

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

function toggleAudio() {
  store.toggleAudio()
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, {
    passive: true
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    class="navbar"
    :class="{ scrolled }"
  >
    <div class="nav-container">
      <a href="#home" class="logo">
        Realm of Unconscious
      </a>

      <nav class="nav-links">
        <a
          v-for="item in navItems"
          :key="item.target"
          :href="item.target"
        >
          {{ item.name }}
        </a>
      </nav>

      <button
        class="audio-button"
        @click="toggleAudio"
      >
        {{ store.audioPlaying ? '关闭音频' : '开启音频' }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 18px 24px;
  transition: background 0.3s, box-shadow 0.3s;
}

.navbar.scrolled {
  background: rgba(20, 20, 30, 0.94);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.logo {
  color: inherit;
  text-decoration: none;
  font-weight: bold;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-links a {
  color: inherit;
  text-decoration: none;
}

.nav-links a:hover {
  opacity: 0.65;
}

.audio-button {
  padding: 8px 14px;
  border: 1px solid currentColor;
  border-radius: 20px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

@media (max-width: 768px) {
  .nav-container {
    flex-wrap: wrap;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }
}
</style>