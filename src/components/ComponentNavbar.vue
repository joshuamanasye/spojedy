<script setup>
import { ref, onMounted } from 'vue'

const username = ref('User')
const profileImage = ref(
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
)

/* Sync navbar with localStorage on every mount */
onMounted(() => {
  const savedUsername = localStorage.getItem('username')
  const savedImage = localStorage.getItem('profileImage')
  if (savedUsername) username.value = savedUsername
  if (savedImage) profileImage.value = savedImage
})
</script>

<template>
  <nav
    class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0D0B14]/85 border-b border-black/5 dark:border-white/5"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <RouterLink to="/" class="shrink-0">
        <span class="text-xl font-black gradient-text tracking-tight">SpoJeDy</span>
      </RouterLink>

      <!-- Desktop nav links -->
      <div class="hidden md:flex items-center gap-1">
        <RouterLink
          to="/"
          class="px-4 py-2 rounded-full text-sm font-medium text-[#78716C] dark:text-[#9089A8] hover:text-[#1C1917] dark:hover:text-[#F5F3FF] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
          exact-active-class="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/videos"
          class="px-4 py-2 rounded-full text-sm font-medium text-[#78716C] dark:text-[#9089A8] hover:text-[#1C1917] dark:hover:text-[#F5F3FF] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
          active-class="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
        >
          Music Videos
        </RouterLink>
        <RouterLink
          to="/profile"
          class="px-4 py-2 rounded-full text-sm font-medium text-[#78716C] dark:text-[#9089A8] hover:text-[#1C1917] dark:hover:text-[#F5F3FF] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
          active-class="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
        >
          Profile
        </RouterLink>
      </div>

      <!-- Profile pill -->
      <RouterLink to="/profile" class="flex items-center gap-2.5 group shrink-0">
        <div class="p-[2px] rounded-full bg-gradient-to-br from-violet-500 to-pink-500">
          <img
            :src="profileImage"
            alt="Profile"
            class="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-[#0D0B14]"
          />
        </div>
        <span
          class="hidden md:block text-sm font-medium text-[#1C1917] dark:text-[#F5F3FF] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
        >
          {{ username }}
        </span>
      </RouterLink>
    </div>

    <!-- Mobile bottom links -->
    <div class="md:hidden flex items-center justify-around py-2 border-t border-black/5 dark:border-white/5">
      <RouterLink
        to="/"
        class="px-4 py-1.5 rounded-full text-xs font-medium text-[#78716C] dark:text-[#9089A8]"
        exact-active-class="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
      >
        Home
      </RouterLink>
      <RouterLink
        to="/videos"
        class="px-4 py-1.5 rounded-full text-xs font-medium text-[#78716C] dark:text-[#9089A8]"
        active-class="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
      >
        Videos
      </RouterLink>
      <RouterLink
        to="/profile"
        class="px-4 py-1.5 rounded-full text-xs font-medium text-[#78716C] dark:text-[#9089A8]"
        active-class="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
      >
        Profile
      </RouterLink>
    </div>
  </nav>
</template>
