<script setup>
import { ref, onMounted } from 'vue'

const username = ref('User')

const profileImage = ref(
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300'
)

onMounted(() => {
  const savedUsername =
    localStorage.getItem('username')

  const savedImage =
    localStorage.getItem('profileImage')

  if (savedUsername) {
    username.value = savedUsername
  }

  if (savedImage) {
    profileImage.value = savedImage
  }
})
</script>

<template>
  <nav
  class="bg-white text-black dark:bg-zinc-900 dark:text-white px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-800"
>
  <h1
    class="text-2xl font-bold text-green-500"
  >
    SpoJeDy
  </h1>

  <div
    class="flex flex-wrap justify-center gap-6 items-center"
  >
    <RouterLink
      to="/"
      class="hover:text-green-400"
    >
      Home
    </RouterLink>

    <RouterLink
      to="/videos"
      class="hover:text-green-400"
    >
      Music Videos
    </RouterLink>

    <RouterLink
      to="/profile"
      class="hover:text-green-400"
    >
      Profile
    </RouterLink>
  </div>

  <div class="flex items-center gap-3">
    <img
      :src="profileImage"
      class="w-10 h-10 rounded-full object-cover"
    />

    <span>{{ username }}</span>
  </div>
</nav>
</template>
