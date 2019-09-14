<template>
  <div class="user-grid">
    <div class="modal" v-bind:class="{ active: modalActive }" id="modal-id">
      <a @click="modalActive = false" class="modal-overlay" aria-label="Close"></a>
      <div class="modal-container">
        <div class="modal-header">
          <a @click="modalActive = false" class="btn btn-clear float-right" aria-label="Close"></a>
          <div class="modal-title h5">{{ message }}</div>
        </div>
        <div class="modal-body">
          <div class="content">
            <p>{{ $t('messages.loading_disclaimer') }}</p>
            <p>{{ $t('messages.refresh_directions') }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="$router.go()">{{ $t('messages.refresh') }}</button>
        </div>
      </div>
    </div>
    <div v-if="error" class="user empty">
      <p class="empty-title h5">{{ message }}</p>
      <p class="empty-subtitle">{{ $t('messages.update_directions') }}</p>
    </div>
    <div v-if="loading" class="user chart loading loading-lg"></div>
    <div v-if="model" class="user">
      <Chart v-bind:list="model" v-bind:sort="sort" v-bind:lang="lang"></Chart>
    </div>
    <div class="controls">
      <div class="sort">
        <label for="sort-select" class="select-title">{{ $t('sorting.title') }}</label>
        <select class="select form-select" id="sort-select" v-model="sort">
          <option>{{ $t('sorting.desc') }}</option>
          <option>{{ $t('sorting.asc') }}</option>
        </select>
      </div>
      <div class="language">
        <label for="lang-select" class="select-title">{{ $t('chartLanguage.title') }}</label>
        <select class="select form-select" id="lang-select" v-model="lang">
          <option>{{ $t('chartLanguage.user') }}</option>
          <option>{{ $t('chartLanguage.english') }}</option>
          <option>{{ $t('chartLanguage.romaji') }}</option>
          <option>{{ $t('chartLanguage.native') }}</option>
        </select>
      </div>
      <i class="disclaimer text-center">{{ $t('chart.disclaimer') }}</i>
      <div class="update">
        <button
          class="btn btn-primary"
          :class="{ loading: updateUserLoading }"
          @click="updateUser()"
        >{{ $t('update') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { addDays, isEqual, parseISO, subDays } from 'date-fns'

import Chart from '@/components/Chart.vue'

export default {
  components: {
    Chart
  },
  data() {
    return {
      loading: false,
      updateUserLoading: false,
      error: false,
      model: true,
      sortingOptions: [this.$t('sorting.desc'), this.$t('sorting.asc')],
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
    fetchData() {
      this.loading = true
      this.model = null
      this.error = false
      this.$http
        .get(`/users/${this.$route.params.username}`)
        .then(
          ({ data: { users } }) => {
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
                : e['user_title']
              e[this.$t('chartLanguage.romaji')] = e.romaji
                ? e.romaji
                : e['user_title']
              e[this.$t('chartLanguage.native')] = e.native
                ? e.native
                : e['user_title']
              e[this.$t('chartLanguage.user')] = e['user_title']

              e.end_day = e.end_day ? parseISO(e.end_day) : new Date()
              if (isEqual(e.start_day, e.end_day)) {
                e.end_day = addDays(e.end_day, 1)
              }
            })

            this.model = list
          },
          error => {
            this.message =
              error.status === 404
                ? this.$i18n.t('messages.not_found')
                : this.$i18n.t('messages.unavail')
            this.error = true
          }
        )
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

<style scoped lang='scss'>
.user-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.15fr;
  grid-row-gap: 15px;
  grid-template-areas: 'user' 'controls';
}

.user {
  grid-area: user;
  height: 100%;
}

.controls {
  grid-area: controls;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 32px;
  grid-template-areas: 'sort update language' 'disclaimer disclaimer disclaimer';
}

.disclaimer {
  grid-area: disclaimer;
  align-self: center;
  justify-self: center;
}

.update {
  grid-area: update;
  align-self: center;
  justify-self: center;
}

.sort {
  grid-area: sort;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.select {
  width: 20%;
}

.select-title {
  font-size: 1rem;
  margin-right: 10px;
}

.language {
  grid-area: language;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.chart {
  width: 100%;
  height: 80vh;
}
</style>
