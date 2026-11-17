import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FoundationsView from '../views/FoundationsView.vue'
import TheoriesView from '../views/TheoriesView.vue'
import PersonalityView from '../views/PersonalityView.vue'
import DreamsView from '../views/DreamsView.vue'
import ReferencesView from '../views/ReferencesView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/guide', name: 'guide', component: FoundationsView },
    { path: '/theories', name: 'theories', component: TheoriesView },
    { path: '/personality', name: 'personality', component: PersonalityView },
    { path: '/dreams', name: 'dreams', component: DreamsView },
    { path: '/references', name: 'references', component: ReferencesView }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  }
})

export default router