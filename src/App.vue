<template>
  <div
    id="app"
    class="main grid"
  >
    <div class="nav justify-self-stretch self-stretch w-full bg-elevation-1 px-4 flex items-center justify-between flex-wrap">
      <router-link
        class="font-mono italic text-gray-100 text-lg"
        to="/"
        @click="wipeUser"
      >
        {{ t ('projectName') }}
      </router-link>
      <div
        v-if="displayUsername && avatar"
        class="flex items-center justify-between"
      >
        <img
          class="avatar rounded"
          :src="avatar"
          :alt="displayUsername"
        >
        <a
          class="text-orange-600 ml-2"
          :href="url"
          target="_blank"
        >
          {{ displayUsername }}
        </a>
      </div>
      <section class="flex flex-nowrap items-center h-full">
        <div class="relative">
          <label
            for="user-search"
            class="sr-only"
          >
            {{ t('navigationBar.username') }}
          </label>
          <input
            id="user-search"
            v-model="username"
            type="text"
            class="text-base rounded-full w-full py-2 px-3"
            :placeholder="t('navigationBar.username')"
            @keypress.enter="goToUser"
          >
          <svg
            class="absolute search-icon text-gray-100 text-opacity-65"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </section>
    </div>
    <router-view
      class="content justify-self-stretch self-stretch h-full px-4"
      @update-user="updateUser"
      @clear-user="wipeUser"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const { t } = useI18n()
    const router = useRouter()

    const username = ref('')
    const displayUsername = ref(null)
    const avatar = ref(null)
    const url = ref(null)

    const goToUser = () => {
      router.push({
        name: 'user-page',
        params: { username: username.value }
      })

      username.value = ''
    }

    const updateUser = (user) => {
      if (!user) {
        this.wipeUser()
        return
      }

      displayUsername.value = user.username
      avatar.value = user.avatar
      url.value = user.url
    }

    const wipeUser = () => {
      displayUsername.value = null
      avatar.value = null
      url.value = null
    }

    return {
      t,
      username,
      displayUsername,
      avatar,
      url,
      goToUser,
      updateUser,
      wipeUser
    }
  }
}
</script>

<style scoped lang="css">
.main {
  grid: 'nav' 80px
        'content' calc(100vh - 80px) /
        1fr;
}

.nav {
  grid-area: nav;
}

.content {
  grid-area: content;
}

.search-icon {
  top: 6px;
  right: 12px;
  height: 24px;
  width: 24px;
}

.avatar {
  height: 64px;
}
</style>
