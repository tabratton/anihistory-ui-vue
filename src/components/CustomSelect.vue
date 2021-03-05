<template>
  <div class="inline-block relative w-64">
    <select :id="id" v-model="selected" class="block bg-gray-800 text-gray-100 w-full border border-gray-600 hover:border-gray-500 pl-4 py-2 rounded focus:outline-none focus:ring-orange-700">
      <option v-for="item in items" :key="item.value" :value="item.value">{{item.message}}</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-100">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: ['items', 'id', 'onChange'],
  data() {
    return {
      selected: this.items[0].value
    }
  },
  watch: {
    selected(val) {
      this.onChange(val)
    }
  }
}
</script>

<style scoped lang="css">
select {
  background-image: none;
}
</style>
