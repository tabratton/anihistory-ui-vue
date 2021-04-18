<template>
  <div
    id="app"
    class="main grid"
  >
    <div class="nav elevation-1 justify-self-stretch self-stretch w-full px-4 flex items-center justify-between flex-wrap">
      <router-link
        class="font-mono italic text-white text-lg"
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
          class="text-main-500 ml-2"
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
            class="text-base w-full py-2 px-3"
            :placeholder="t('navigationBar.username')"
            @keypress.enter="goToUser"
          >
          <svg
            class="absolute search-icon text-gray-400 text-opacity-65"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <path
              fill="currentColor"
              d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
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

    const updateUser = user => {
      if (!user) {
        wipeUser()
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
        'content' calc(100vh - 90px) /
        1fr;
  grid-row-gap: 10px;
}

.nav {
  grid-area: nav;
}

.content {
  grid-area: content;
}

.search-icon {
  top: 8px;
  right: 0.75rem;
  height: 20px;
  width: 20px;
}

.avatar {
  height: 64px;
}
</style>
