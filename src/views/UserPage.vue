<template>
  <div class="user-grid">
    <div v-if="error" class="user flex flex-col justify-center items-center bg-elevation-1 bg-clip-content m-8 rounded">
      <p class="text-center text-lg font-bold text-white-o-87">{{ message }}</p>
      <p class="text-center text-white-o-87 text-sm">{{ $t('messages.update_directions') }}</p>
    </div>
    <div v-if="loading" class="user flex items-center">
      <Loading></Loading>
    </div>
    <div v-if="model" class="user">
      <Chart v-bind:list="model" v-bind:sort="sort" v-bind:lang="lang"></Chart>
    </div>
    <div class="controls">
      <div class="sort text-center flex flex-col">
        <label for="sort-select" class="mb-1 text-white-o-87">{{ $t('sorting.title') }}</label>
        <CustomSelect id="sort-select" v-bind:items="sortOptions" v-bind:onChange="updateSort"></CustomSelect>
      </div>
      <div class="language text-center flex flex-col">
        <label for="lang-select" class="mb-1 text-white-o-87">{{ $t('chartLanguage.title') }}</label>
        <CustomSelect id="lang-select" v-bind:items="langOptions" v-bind:onChange="updateLang"></CustomSelect>
      </div>
      <em class="disclaimer text-white-o-87 text-center">{{ $t('chart.disclaimer') }}</em>
      <div class="update">
        <button
          class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-3 rounded focus:outline-none"
          :class="{ loading: updateUserLoading }"
          @click="updateUser()"
        >{{ $t('update') }}</button>
      </div>
    </div>

    <UpdateModal v-if="modalActive" v-bind:message="message" v-on:close="modalActive = false"></UpdateModal>

  </div>
</template>

<script>
import { addDays, areIntervalsOverlapping, compareAsc, isBefore, isEqual, formatISO, parseISO, subDays } from 'date-fns'

import Chart from '@/components/Chart'
import CustomSelect from '@/components/CustomSelect'
import Loading from '@/components/Loading'
import UpdateModal from '@/components/UpdateModal'

export default {
  components: {
    Chart,
    CustomSelect,
    Loading,
    UpdateModal
  },
  data() {
    return {
      loading: false,
      updateUserLoading: false,
      error: false,
      model: true,
      sortOptions: [
        {
          value: 'desc',
          message: this.$t('sorting.desc')
        },
        {
          value: 'asc',
          message: this.$t('sorting.asc')
        }
      ],
      langOptions: [
        {
          value: 'user',
          message: this.$t('chartLanguage.user')
        },
        {
          value: 'english',
          message: this.$t('chartLanguage.english')
        },
        {
          value: 'romaji',
          message: this.$t('chartLanguage.romaji')
        },
        {
          value: 'native',
          message: this.$t('chartLanguage.native')
        }
      ],
      sort: this.$t('sorting.desc'),
      lang: this.$t('chartLanguage.user'),
      message: null,
      modalActive: false
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    updateSort(val) {
      this.sort = val
    },
    updateLang(val) {
      this.lang = val
    },

    createGroupCategories(list) {
      const columns = [[]]

      list.forEach(e => {
        console.log(e)
        columns.forEach((column, index) => {
          if (e.category) return

          const length = column.length

          if (length === 0) {
            e.category = `${index}`
            column.push(e)
            return
          }

          const lastElement = column[length - 1]
          const overlapsWithLastItem = areIntervalsOverlapping({ start: lastElement.start_day, end: lastElement.end_day }, { start: e.start_day, end: e.end_day })

          if (overlapsWithLastItem) {
            if (!columns[index + 1]) {
              e.category = `${index}`
              columns.push([e])
            }

            return
          }

          e.category = `${index}`
          column.push(e)
        })
      })

      return columns
    },

    fetchData() {
      this.loading = true
      this.model = null
      this.error = false
      this.$http
        .get(`/users/${this.$route.params.username}`)
        .then(({ data: { users } }) => {
          const list = users.list
          list.forEach(e => {
            if (e.start_day) {
              e.start_day = parseISO(e.start_day)
            } else if (e.end_day) {
              e.start_day = subDays(parseISO(e.end_day), 1)
            } else {
              e.start_day = new Date()
            }

            e[this.$t('chartLanguage.english')] = e.english
              ? e.english
              : e.user_title
            e[this.$t('chartLanguage.romaji')] = e.romaji
              ? e.romaji
              : e.user_title
            e[this.$t('chartLanguage.native')] = e.native
              ? e.native
              : e.user_title
            e[this.$t('chartLanguage.user')] = e.user_title

            e.end_day = e.end_day ? parseISO(e.end_day) : new Date()
            if (isEqual(e.start_day, e.end_day)) {
              e.end_day = addDays(e.end_day, 1)
            }

            if (isBefore(e.end_day, e.start_day)) {
              // TODO: Add <a> link to anilist page to update date range.
              // update template to display contextual secondary message
              // implement irish translation
              const error = new Error(this.$i18n.t('messages.invalid_date', { start: formatISO(e.start_day, { representation: 'date' }), end: formatISO(e.end_day, { representation: 'date' }), name: e.user_title }).toString())
              error.name = 42
              throw error
            }
          })

          this.createGroupCategories(list.sort((a, b) => compareAsc(a.start_day, b.start_day)))

          this.model = list
        })
        .catch(error => {
          if (error.status === 404) {
            this.message = this.$i18n.t('messages.not_found')
          } else if (error.name === 42) {
            this.message = error.message
          } else {
            this.message = this.$i18n.t('messages.unavail')
          }

          this.error = true
          console.error(error)
        })
        .finally(() => (this.loading = false))
    },

    updateUser() {
      this.updateUserLoading = true
      this.$http
        .post(`/users/${this.$route.params.username}`, { dataType: 'text' })
        .then(() => {
          this.message = this.$i18n.t('messages.user_loading')
          this.modalActive = true
        })
        .catch(error => {
          this.message =
            error.status === 404
              ? this.$i18n.t('messages.not_found')
              : this.$i18n.t('messages.unavail')
          this.modalActive = true
        })
        .finally(() => (this.updateUserLoading = false))
    }
  }
}
</script>

<style scoped lang='css'>
.user-grid {
  display: grid;
  grid: 'user' 1fr
        'controls' 0.15fr /
        1fr;
  grid-row-gap: 8px;
}

.user {
  grid-area: user;
}

.controls {
  grid-area: controls;
  display: grid;
  grid: 'sort       update     language' 1fr
        'disclaimer disclaimer disclaimer' 0.75fr /
        1fr         1fr        1fr;
  grid-row-gap: 8px;
  align-items: center;
  justify-items: center;
}

.disclaimer {
  grid-area: disclaimer;
}

.update {
  grid-area: update;
}

.sort {
  grid-area: sort;
}

.language {
  grid-area: language;
}
</style>
