<template>
  <div class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
    <div id="modal-overlay" class="absolute w-full h-full bg-gray-800 opacity-70"></div>

    <div id="modal-container" class="bg-gray-800 m-6 rounded shadow-lg z-50 overflow-y-auto">

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div id="modal-content" class="text-left">
        <!--Title-->
        <div class="flex justify-between items-center bg-elevation-1 mb-3 py-4 px-6">
          <p class="text-lg text-gray-100 font-bold" >{{ $t('messages.user_loading') }}</p>
          <div id="modal-close" class="cursor-pointer z-50" @click="$emit('close')">
            <svg class="fill-current text-gray-100" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </div>
        </div>

        <!--Body-->
        <div class="py-4 px-6">
          <p class="mb-2 text-gray-100">{{ $t('messages.loading_disclaimer') }}</p>
          <p class="mb-2 text-gray-100">{{ $t('messages.refresh_directions') }}</p>
        </div>

        <!--Footer-->
        <div class="flex justify-end bg-elevation-1 mt-3 py-4 px-6">
          <button class="bg-orange-600 hover:bg-orange-500 text-gray-100 py-2 px-3 rounded focus:outline-none" @click="$router.go()">{{ $t('messages.refresh') }}</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateModal',
  props: ['message', 'onClose']
}
</script>

<style scoped lang="css">
.modal {
  transition: opacity 0.25s ease;
}
</style>
