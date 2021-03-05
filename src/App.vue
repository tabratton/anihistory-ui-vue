<template>
  <div id="app" class="main grid">
    <div class="nav justify-self-stretch self-stretch w-full bg-elevation-1 px-4 flex items-center justify-between flex-wrap">
      <router-link class="font-mono italic text-gray-100 text-lg" to="/" v-on:click="wipeUser">{{ $t ('projectName') }}</router-link>
      <div class="flex items-center justify-between" v-if="displayUsername && avatar">
        <img class="avatar rounded" :src="avatar" :alt="displayUsername">
        <a class="text-orange-600 ml-2" :href="url" target="_blank">{{ displayUsername }}</a>
      </div>
      <section class="flex flex-nowrap items-center h-full">
        <div class="relative">
          <input
            type="text"
            class="text-base rounded-full w-full py-2 px-3 text-gray-100 placeholder-gray-100 placeholder-opacity-65 bg-gray-800 focus:ring-2 focus:ring-orange-700 focus:border-orange-700"
            v-model="username"
            v-on:keypress.enter="goToUser"
            v-bind:placeholder="$t('navigationBar.username')"
          >
          <svg class="absolute search-icon text-gray-100 text-opacity-65" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </section>
    </div>
    <router-view class="content justify-self-stretch self-stretch h-full px-4" v-on:update-user="updateUser" v-on:clear-user="wipeUser"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      displayUsername: null,
      avatar: null,
      url: null
    }
  },
  methods: {
    goToUser() {
      this.$router.push({
        name: 'user-page',
        params: { username: this.username }
      })
      this.username = ''
    },
    updateUser(user) {
      if (!user) {
        this.wipeUser()
        return
      }

      this.displayUsername = user.username
      this.avatar = user.avatar
      this.url = user.url
    },
    wipeUser() {
      this.displayUsername = null
      this.avatar = null
      this.url = null
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
