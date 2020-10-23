<template>
  <div class="user-grid">
    <div v-if="error" class="user flex flex-col justify-center items-center bg-elevation-1 bg-clip-content m-8 rounded">
      <p class="text-center text-lg font-bold text-white-o-87">{{ message }}</p>
      <p class="text-center text-white-o-87 text-sm" v-if="errorType === 'NotFound'">{{ $t('messages.update_directions') }}</p>
      <p class="text-center text-white-o-87 text-sm m-2" v-for="err in errorList" :key="err.message">{{ err.message }}</p>
      <a class="text-orange-600 text-sm" :href="animeListUrl" target="_blank">{{ $t('messages.anilist_instructions') }}</a>
    </div>
    <div v-if="loading" class="user flex items-center">
      <Loading></Loading>
    </div>
    <div v-if="model" class="user">
      <Chart v-bind:list="model" v-bind:lang="lang"></Chart>
    </div>
    <div class="controls">
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

    <UpdateModal v-if="modalActive" v-on:close="modalActive = false"></UpdateModal>

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
      errorType: null,
      errorList: null,
      model: true,
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
      lang: this.$t('chartLanguage.user'),
      message: null,
      modalActive: false
    }
  },
  computed: {
    animeListUrl() {
      return `https://anilist.co/user/${this.$route.params.username}/animelist`
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    updateLang(val) {
      this.lang = val
    },

    createGroupCategories(list) {
      const rows = [[]]

      list.forEach(listElement => {
        // Check each row for each list element to make sure all possible gaps are filled
        rows.forEach((row, index) => {
          if (listElement.category) return

          const length = row.length

          // If there's no other elements there can't be date range conflicts
          if (length === 0) {
            listElement.category = `${index}`
            row.push(listElement)
            return
          }

          // Find out if there are any elements that have date range conflicts in this row
          const conflictInRow = row
            .map(rowElement => areIntervalsOverlapping({ start: rowElement.start_day, end: rowElement.end_day }, { start: listElement.start_day, end: listElement.end_day }))
            .reduce((a, b) => a || b)

          // If no conflicts, add the current element to the row,
          // otherwise add a new row if this is the last row
          if (!conflictInRow) {
            listElement.category = `${index}`
            row.push(listElement)
          } else if (!rows[index + 1]) {
            rows.push([])
          }
        })
      })

      return rows
    },

    fetchData() {
      this.loading = true
      this.model = null
      this.error = false
      this.errorType = null
      this.errorList = null
      this.$http
        .get(`/users/${this.$route.params.username}`)
        .then(({ data: { users } }) => {
          const list = users.list
          const dateRangeErrors = []

          list.forEach(e => {
            if (e.start_day) {
              e.start_day = parseISO(e.start_day)
            } else if (e.end_day) {
              e.start_day = subDays(parseISO(e.end_day), 1)
            } else {
              e.start_day = new Date()
            }

            e.english = e.english
              ? e.english
              : e.user_title
            e.romaji = e.romaji
              ? e.romaji
              : e.user_title
            e.native = e.native
              ? e.native
              : e.user_title
            e.user = e.user_title

            e.end_day = e.end_day ? parseISO(e.end_day) : new Date()
            if (isEqual(e.start_day, e.end_day)) {
              e.end_day = addDays(e.end_day, 1)
            }

            if (isBefore(e.end_day, e.start_day)) {
              const error = new Error(this.$i18n.t('messages.invalid_date', { start: formatISO(e.start_day, { representation: 'date' }), end: formatISO(e.end_day, { representation: 'date' }), name: e.user_title }).toString())
              error.name = 42
              dateRangeErrors.push(error)
            }
          })

          if (dateRangeErrors.length > 0) {
            this.errorList = dateRangeErrors
            throw dateRangeErrors[0]
          }

          this.createGroupCategories(list.sort((a, b) => compareAsc(a.start_day, b.start_day)))
          this.model = list
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            this.message = this.$i18n.t('messages.not_found')
            this.errorType = 'NotFound'
          } else if (error.name === 42) {
            this.message = this.$i18n.t('messages.date_range')
            this.errorType = 'DateRange'
          } else {
            this.errorType = 'Other'
            this.message = this.$i18n.t('messages.unavail')
          }

          this.error = true
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
