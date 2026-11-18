<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <h2>Realm of Unconscious</h2>

      <p>
        一个探索潜意识、人格结构与梦境理论的心理学科普项目
      </p>
      
      <div class="copyright">
        © 2026 Realm of Unconscious
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 34px 24px 20px;
  background: rgba(15, 17, 29, 0.78);
  backdrop-filter: blur(12px);
  color: #eee;
}

.footer-content {
  max-width: 900px;
  margin: auto;
  text-align: center;
}

.footer h2 {
  margin: 0;
}

.footer-content > p {
  margin: 8px 0 0;
}
.references {
  margin-top: 32px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  text-align: left;
  line-height: 1.8;
}

.references h3 {
  text-align: center;
}

.references ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.references li {
  margin: 8px 0;
  color: #bbb;
}

.references a {
  color: #a78bfa;
  text-decoration: none;
}

.references a:hover {
  text-decoration: underline;
}


.copyright {
  margin-top: 16px;
  color: #888;
  font-size: 14px;
}
</style>