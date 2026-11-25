<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usePsychoStore } from '../stores/usePsychoStore'

const store = usePsychoStore()
const scrolled = ref(false)
const audioEl = ref(null)


const navItems = [
  { name: '首页', to: '/' },
  { name: '基础概念', to: '/guide' },
  { name: '理论脉络', to: '/theories' },
  { name: '人格结构', to: '/personality' },
  { name: '梦境探索', to: '/dreams' },
  { name: '参考资料', to: '/references' }
]

function handleScroll() {
  scrolled.value = window.scrollY > 24
}
function toggleAudio() {
  store.toggleAudio()

  const audio = audioEl.value
  if (!audio) return

  if (store.audioPlaying) {
    audio.play().catch((e) => {
      console.error('播放失败：', e)
      store.setAudioPlaying(false)
    })
  } else {
    audio.pause()
  }

}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  if (audioEl.value) audioEl.value.volume = 0.4
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="navbar" :class="{ scrolled }">
    <div class="nav-container">
      <RouterLink to="/" class="logo" aria-label="潜意识之境首页">
        <span class="logo-mark" aria-hidden="true">◌</span>
        <span>Realm <em>of</em> Unconscious</span>
      </RouterLink>

      <nav class="nav-links" aria-label="主导航">
        <RouterLink
          v-for="(item, index) in navItems"
          :key="item.to"
          :to="item.to"
          :exact-active-class="index === 0 ? 'active' : ''"
          active-class="active"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <button
        class="audio-button"
        type="button"
        :aria-pressed="store.audioPlaying"
        :aria-label="store.audioPlaying ? '关闭环境音频' : '开启环境音频'"
        @click="toggleAudio"
      >
        <span class="audio-indicator" aria-hidden="true"></span>
        <span class="audio-label">{{ store.audioPlaying ? '音频已开启' : '静谧模式' }}</span>
      </button>
    </div>
    <audio ref="audioEl" src="/audio/ambient.mp3" loop preload="none" />

  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1000;
  padding: 0 32px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.08);
  background: rgba(11, 15, 25, 0.66);
  backdrop-filter: blur(16px);
  transition: background 0.25s, box-shadow 0.25s;
}

.navbar.scrolled {
  background: rgba(11, 15, 25, 0.92);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
}

.nav-container {
  width: min(1200px, 100%);
  min-height: 76px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #f0edff;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 15px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.logo em {
  color: #9e95bd;
  font-size: 0.86em;
  font-weight: 400;
}

.logo-mark {
  color: #b6a8ff;
  font-family: Arial, sans-serif;
  font-size: 29px;
  line-height: 1;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 28px);
}

.nav-links a {
  position: relative;
  padding: 29px 0 26px;
  color: #9ca3b5;
  font-size: 14px;
  white-space: nowrap;
  transition: color 0.2s;
}

.nav-links a::after {
  position: absolute;
  right: 0;
  bottom: 18px;
  left: 0;
  height: 1px;
  background: #b6a8ff;
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
  color: #eeeaff;
}

.nav-links a.active::after {
  transform: scaleX(1);
}

.audio-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 13px;
  border: 1px solid rgba(182, 168, 255, 0.28);
  border-radius: 999px;
  background: rgba(182, 168, 255, 0.06);
  color: #c9c2e6;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.audio-button:hover {
  border-color: rgba(182, 168, 255, 0.55);
  background: rgba(182, 168, 255, 0.14);
  color: #eeeaff;
}

.audio-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8c82a8;
  transition: background 0.2s, box-shadow 0.2s;
}

.audio-button[aria-pressed='true'] .audio-indicator {
  background: #b6a8ff;
  box-shadow: 0 0 10px #b6a8ff;
}

@media (max-width: 1050px) {
  .navbar {
    padding: 0 22px;
  }

  .nav-container {
    gap: 16px;
  }

  .nav-links {
    gap: 14px;
  }

  .audio-button {
    padding: 7px 11px;
    font-size: 11px;
  }
}

@media (max-width: 680px) {
  .navbar {
    padding: 0 18px;
  }

  .nav-container {
    min-height: 68px;
    flex-wrap: wrap;
    gap: 0;
  }

  .logo {
    min-height: 64px;
  }

  .nav-links {
    order: 2;
    width: calc(100vw - 36px);
    gap: 24px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .nav-links::-webkit-scrollbar {
    display: none;
  }

  .nav-links a {
    padding: 10px 0 13px;
    font-size: 13px;
  }

  .nav-links a::after {
    bottom: 5px;
  }
}
</style>
