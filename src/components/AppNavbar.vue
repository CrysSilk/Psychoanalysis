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
  { name: '人格结构', target: '#personality' }
]

const activeTarget = ref('#home')

function updateActiveTarget() {
  const pos = window.scrollY + 80          // 视口顶 + 导航栏高度附近
  let current = '#home'
  for (const item of navItems) {
    const el = document.querySelector(item.target)
    if (el && el.offsetTop <= pos) current = item.target
  }
  activeTarget.value = current
}

function handleScroll() {
  scrolled.value = window.scrollY > 50
  updateActiveTarget()
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
          :class="{ active: item.target === activeTarget }"
        >
          {{ item.name }}
        </a>
      </nav>

      <button
  class="audio-button"
  :aria-pressed="store.audioPlaying"
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
.nav-links a.active {
  opacity: 1;
  color: #b8a9ff;   /* 换成项目主题色 */
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
<style>
/* 不带 scoped：这些 section 是别的组件渲染的，scoped 样式够不着 */
section[id] {
  scroll-margin-top: 72px;   /* 跳转锚点时给固定导航栏让出位置 */
}

html {
  scroll-behavior: smooth;   /* 点链接平滑滚动而非瞬间跳 */
}
</style>

