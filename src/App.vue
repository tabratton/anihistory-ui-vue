<template>
  <div id="app" class="main">
    <div class="nav w-full bg-black-lighter p-4 flex items-center justify-between flex-wrap">
      <router-link class="font-mono italic text-white-o-87" to="/">{{ $t ('projectName') }}</router-link>
      <section class="flex flex-no-wrap items-center">
        <input
          type="text"
          class="shadow appearance-none rounded w-full py-2 px-3 text-white-o-87 bg-black leading-tight focus:outline-none focus:shadow-outline"
          v-model="username"
          v-on:keypress.enter="goToUser"
          v-bind:placeholder="$t('navigationBar.username')"
        >
        <button
          class="ml-4 hover:bg-purple-200 hover:text-purple-600 text-purple-500 font-bold py-2 px-3 rounded focus:outline-none border border-solid border-purple-500"
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

      this.username = ''
    }
  }
}
</script>

<style lang="css">
.main {
  display: grid;
  grid: 'nav' 8vh
        'content' 92vh /
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
}

body.modal-active {
  overflow-x: hidden;
  overflow-y: visible !important;
}
</style>
