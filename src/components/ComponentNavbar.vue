<script setup>
import { ref, onMounted } from 'vue'

const username = ref('User')
const profileImage = ref(
    'https://cdn.joman.id/images/photo.jpg'
)

onMounted(() => {
    const u = localStorage.getItem('username')
    const img = localStorage.getItem('profileImage')
    console.log('navbar: loaded user from storage:', u)
    if (u) username.value = u
    if (img) profileImage.value = img
})
</script>

<template>
    <nav class="sticky top-0 z-50 bg-[#F9F8F4] dark:bg-[#141310] border-b border-[#E2DDD4] dark:border-[#2E2B25]">
        <div class="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-8">

            <!-- Brand -->
            <RouterLink to="/" class="font-black text-base tracking-[-0.03em] text-[#1A1916] dark:text-[#EDE9DF] shrink-0">
                SPOJEDY
            </RouterLink>

            <!-- Nav links -->
            <div class="flex items-center gap-6 text-sm font-medium tracking-wide">
                <RouterLink
                    to="/"
                    class="text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors"
                    exact-active-class="text-[#1A1916] dark:text-[#EDE9DF]"
                >
                    Songs
                </RouterLink>
                <RouterLink
                    to="/videos"
                    class="text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors"
                    active-class="text-[#1A1916] dark:text-[#EDE9DF]"
                >
                    Videos
                </RouterLink>
                <RouterLink
                    to="/profile"
                    class="text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors"
                    active-class="text-[#1A1916] dark:text-[#EDE9DF]"
                >
                    Profile
                </RouterLink>
            </div>

            <!-- User -->
            <RouterLink to="/profile" class="flex items-center gap-2 group shrink-0">
                <img
                    :src="profileImage"
                    alt=""
                    class="w-7 h-7 rounded-full object-cover border border-[#E2DDD4] dark:border-[#2E2B25]"
                />
                <span class="hidden md:block text-sm text-[#8A8679] dark:text-[#7A7870] group-hover:text-[#1A1916] dark:group-hover:text-[#EDE9DF] transition-colors">
                    {{ username }}
                </span>
            </RouterLink>

        </div>
    </nav>
</template>
