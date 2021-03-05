<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <p class="text-center text-gray-100 text-lg" v-html="$t('subtitle')"></p>
  </div>
</template>

<script>
export default {
  name: 'home',
  created() {
    this.$emit('clear-user')
  }
}
</script>
