<template>
  <div id="app" class="main">
    <div class="nav w-full bg-elevation-1 px-4 flex items-center justify-between flex-wrap">
      <router-link class="font-mono italic text-white-o-87 text-lg" to="/">{{ $t ('projectName') }}</router-link>
      <section class="flex flex-no-wrap items-center h-full">
        <input
          type="text"
          class="shadow appearance-none rounded-full w-full py-2 px-3 text-white-o-87 bg-black leading-tight focus:outline-none focus:shadow-outline"
          v-model="username"
          v-on:keypress.enter="goToUser"
          v-bind:placeholder="$t('navigationBar.username')"
        >
        <button
          class="ml-4 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-3 rounded leading-tight focus:outline-none"
          v-on:click="goToUser"
        >{{ $t('navigationBar.search') }}</button>
      </section>
    </div>
    <router-view class="content px-4"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: ''
    }
  },
  methods: {
    goToUser() {
      this.$router.push({
        name: 'user-page',
        params: { username: this.username }
      })
    }
  }
}
</script>

<style scoped lang="css">
.main {
  display: grid;
  grid: 'nav' 80px
        'content' calc(100vh - 80px) /
        1fr;
}

.nav {
  grid-area: nav;
  align-self: stretch;
  justify-self: stretch;
}

.content {
  grid-area: content;
  align-self: stretch;
  justify-self: stretch;
  height: 100%;
}

body.modal-active {
  overflow-x: hidden;
  overflow-y: visible !important;
}
</style>
