import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/guide', name: 'guide', component: () => import('../views/FoundationsView.vue') },
    { path: '/theories', name: 'theories', component: () => import('../views/TheoriesView.vue') },
    { path: '/personality', name: 'personality', component: () => import('../views/PersonalityView.vue') },
    { path: '/dreams', name: 'dreams', component: () => import('../views/DreamsView.vue') },
    { path: '/references', name: 'references', component: () => import('../views/ReferencesView.vue') }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  }
})

export default router