<script setup>
import { RouterLink } from 'vue-router'

const footerLinks = [
  { name: '首页', to: '/' },
  { name: '基础概念', to: '/guide' },
  { name: '理论脉络', to: '/theories' },
  { name: '人格结构', to: '/personality' },
  { name: '梦境探索', to: '/dreams' },
  { name: '参考资料', to: '/references' }
]
</script>
<template>
  <footer class="footer">
    <div class="footer-content">
      <h2>Realm of Unconscious</h2>

      <p>
        一个探索潜意识、人格结构与梦境理论的心理学科普项目
      </p>

      <nav class="footer-nav" aria-label="页脚导航">
        <RouterLink v-for="item in footerLinks" :key="item.to" :to="item.to">
          {{ item.name }}
        </RouterLink>
      </nav>

      <div class="copyright">
        © 2026 Realm of Unconscious · 仅用于科普与学习交流
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 44px 24px 28px;
  border-top: 1px solid rgba(209, 199, 255, 0.1);
  background: rgba(8, 11, 18, 0.84);
  backdrop-filter: blur(12px);
  color: #e8e7ef;
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.footer h2 {
  margin: 0;
  color: #e8e4f2;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.08em;
}

.footer-content > p {
  margin: 8px 0 0;
  color: #9097a9;
  font-size: 13px;
  line-height: 1.7;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
  margin-top: 20px;
}

.footer-nav a {
  color: #9ba2b5;
  font-size: 13px;
  transition: color 0.2s;
}

.footer-nav a:hover {
  color: #c2b8ea;
}

.copyright {
  margin-top: 20px;
  color: #6b7285;
  font-size: 12px;
}
</style>