<template>
  <div class="flex flex-col items-center justify-center">
    <p
      class="text-center text-gray-100 text-lg"
      v-html="t('subtitle')"
    />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Home',
  emits: ['clear-user'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'global' })
    emit('clear-user')

    return {
      t
    }
  }
}
</script>
