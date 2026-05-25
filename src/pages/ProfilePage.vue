<script setup>
import { onMounted, ref } from 'vue'

import imageCompression from 'browser-image-compression'

import ComponentNavbar from '../components/ComponentNavbar.vue'

const username = ref('Clement')

const profileImage = ref(
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300'
)

const theme = ref('dark')

const loading = ref(false)

onMounted(() => {
  const savedUsername =
    localStorage.getItem('username')

  const savedTheme =
    localStorage.getItem('theme')

  const savedImage =
    localStorage.getItem('profileImage')

  if (savedUsername) {
    username.value = savedUsername
  }

  if (savedTheme) {
    theme.value = savedTheme
  }

  if (savedImage) {
    profileImage.value = savedImage
  }

  applyTheme()
})

const saveProfile = () => {
  localStorage.setItem(
    'username',
    username.value
  )

  localStorage.setItem(
    'theme',
    theme.value
  )

  localStorage.setItem(
    'profileImage',
    profileImage.value
  )

  applyTheme()

  alert('Profile Saved!')
}

const applyTheme = () => {
  if (theme.value === 'dark') {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}

const uploadImage = async (event) => {
  const file = event.target.files[0]

  if (!file) return

  loading.value = true

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
  }

  try {
    const compressedFile =
      await imageCompression(
        file,
        options
      )

    const reader = new FileReader()

    reader.readAsDataURL(compressedFile)

    reader.onload = () => {
      profileImage.value = reader.result

      loading.value = false
    }
  } catch (error) {
    console.log(error)

    loading.value = false
  }
}
</script>

<template>
  <div
  class="min-h-screen bg-white text-black dark:bg-black dark:text-white"
>
    <ComponentNavbar />

    <div
      class="flex flex-col items-center px-6 py-12"
    >
      <h1 class="text-5xl font-bold mb-10">
        Profile
      </h1>

      <!-- IMAGE -->
      <div class="relative">
        <img
          v-if="!loading"
          :src="profileImage"
          class="w-48 h-48 rounded-full object-cover border-4 border-zinc-700"
        />

        <!-- LOADING -->
        <div
          v-if="loading"
          class="w-48 h-48 rounded-full border-4 border-zinc-700 animate-pulse bg-zinc-800"
        />
      </div>

      <!-- UPLOAD -->
      <input
        type="file"
        accept="image/*"
        @change="uploadImage"
        class="mt-6"
      />

      <!-- USERNAME -->
      <div class="w-full max-w-md mt-10">
        <label class="text-zinc-400">
          Username
        </label>

        <input
          v-model="username"
          type="text"
          class="w-full mt-2 bg-zinc-900 p-4 rounded-lg outline-none"
        />
      </div>

      <!-- THEME -->
      <div class="w-full max-w-md mt-8">
        <label class="text-zinc-400">
          Theme
        </label>

        <select
          v-model="theme"
          class="w-full mt-2 bg-zinc-900 p-4 rounded-lg outline-none"
        >
          <option value="dark">
            Dark Mode
          </option>

          <option value="light">
            Light Mode
          </option>
        </select>
      </div>

      <!-- SAVE -->
      <button
        @click="saveProfile"
        class="mt-10 bg-green-500 px-10 py-4 rounded-xl text-xl font-bold hover:bg-green-400 transition"
      >
        Save Profile
      </button>
    </div>
  </div>
</template>
