<template>
  <div id="app">
    <header class="navbar">
      <section class="navbar-section">
        <router-link class="navbar-brand text-bold" to="/">{{ $t ('projectName') }}</router-link>
      </section>
      <section class="navbar-section">
        <div class="input-group input-inline">
          <input
            type="text"
            class="form-input"
            v-model="username"
            v-on:keypress.enter="goToUser"
            v-bind:placeholder="$t('navigationBar.username')"
          >
          <button
            class="btn btn-primary input-group-btn"
            v-on:click="goToUser"
          >{{ $t('navigationBar.search') }}</button>
        </div>
      </section>
    </header>
    <router-view/>
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

<style lang='scss'>
$primary-color: #c62125;

@import '~spectre.css/src/spectre';

.navbar {
  padding-left: 10px;
  padding-right: 10px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid $gray-color;
}

.navbar-brand {
  font-family: $mono-font-family;
}

#user-update {
  width: 100%;
}

.update-btn {
  margin-top: 1em;
}

.tab {
  margin-right: 10px;
}
</style>
