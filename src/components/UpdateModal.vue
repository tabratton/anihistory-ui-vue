<template>
  <div class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
    <div
      id="modal-overlay"
      class="absolute w-full h-full bg-dark-base opacity-70"
    />

    <div
      id="modal-container"
      class="bg-dark-base m-6 rounded shadow-lg z-50 overflow-y-auto"
    >
      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div
        id="modal-content"
        class="text-left"
      >
        <!--Title-->
        <div class="flex justify-between items-center elevation-1 mb-3 py-4 px-6">
          <h4 class="text-lg text-white font-bold">
            {{ t('messages.user_loading') }}
          </h4>
          <div
            id="modal-close"
            class="cursor-pointer z-50"
            @click="emit('close')"
          >
            <svg
              class="fill-current text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </div>
        </div>

        <!--Body-->
        <div class="py-4 px-6 text-white">
          <p class="mb-2">
            {{ t('messages.loading_disclaimer') }}
          </p>
        </div>

        <!--Footer-->
        <div class="flex justify-end elevation-1 mt-3 py-4 px-6">
          <button @click="$router.go(0)">
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'UpdateModal',
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'global' })

    return {
      t,
      emit
    }
  }
}
</script>

<style scoped lang="css">
.modal {
  transition: opacity 0.25s ease;
}
</style>
