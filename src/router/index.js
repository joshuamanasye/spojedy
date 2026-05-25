import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/HomePage.vue'
import SongDetail from '../pages/SongDetail.vue'
import MusicVideo from '../pages/MusicVideo.vue'
import MusicVideoDetail from '../pages/MusicVideoDetail.vue'
import Profile from '../pages/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/song/:id',
      component: SongDetail,
    },
    {
      path: '/videos',
      component: MusicVideo,
    },
    {
      path: '/video/:id',
      component: MusicVideoDetail,
    },
    {
      path: '/profile',
      component: Profile,
    },
  ],
})

export default router
