<template>
  <div class="user-grid grid">
    <div
      v-if="error"
      class="user flex flex-col justify-center items-center bg-elevation-1 bg-clip-content m-8 rounded"
    >
      <p
        v-if="error === 'NotFound'"
        class="text-center text-gray-100 text-sm"
      >
        {{ t('messages.update_directions') }}
      </p>
      <p
        v-for="m in messages"
        :key="m.message"
        class="text-center text-gray-100 text-sm m-2"
      >
        {{ m.message }}
      </p>
      <a
        v-if="error === 'DateRange'"
        class="text-orange-600 text-sm"
        :href="animeListUrl"
        target="_blank"
      >
        {{ t('messages.anilist_instructions') }}
      </a>
    </div>
    <div :class="`user${loading ? ' flex items-center' : ''}`">
      <Loading :loading="loading">
        <Chart
          v-if="!error"
          :list="model"
          :lang="lang"
        />
      </Loading>
    </div>
    <div class="controls grid items-center justify-items-center">
      <div class="language text-center flex flex-col">
        <label
          for="lang-select"
          class="mb-1 text-gray-100"
        >
          {{ t('chartLanguage.title') }}
        </label>
        <div class="inline-block relative w-64">
          <select
            id="lang-select"
            v-model="lang"
            class="block w-full pl-4 py-2 bg-none rounded"
          >
            <option value="user">
              {{ t('chartLanguage.user') }}
            </option>
            <option value="english">
              {{ t('chartLanguage.english') }}
            </option>
            <option value="romaji">
              {{ t('chartLanguage.romaji') }}
            </option>
            <option value="native">
              {{ t('chartLanguage.native') }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-100">
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <em class="disclaimer text-gray-100 text-center pb-4 text-sm sm:text-base">
        {{ t('chart.disclaimer') }}
      </em>
      <div class="update">
        <button @click="updateUser()">
          {{ t('update') }}
        </button>
      </div>
    </div>

    <UpdateModal
      v-if="modalActive"
      @close="modalActive = false"
    />
  </div>
</template>

<script>
import { addDays, areIntervalsOverlapping, compareAsc, isBefore, isDate, isEqual, formatISO, parseISO, subDays } from 'date-fns'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import Chart from '@/components/Chart'
import Loading from '@/components/Loading'
import UpdateModal from '@/components/UpdateModal'

export default {
  components: {
    Chart,
    Loading,
    UpdateModal
  },
  emits: ['update-user'],
  setup(props, { emit }) {
    const route = useRoute()
    const { t } = useI18n({ useScope: 'global' })
    const http = getCurrentInstance().appContext.config.globalProperties.http

    const animeListUrl = computed(() => {
      return `https://anilist.co/user/${route.params.username}/animelist`
    })

    const loading = ref(false)
    const model = ref([])
    const error = ref(null)
    const messages = ref([])

    const createGroupCategories = list => {
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
    }

    const fetchData = async ({ username }) => {
      loading.value = true
      model.value = []
      error.value = null

      const processList = list => {
        const dateRangeErrors = []

        list.forEach(e => {
          if (e.start_day) {
            e.start_day = isDate(e.start_day) ? e.start_day : parseISO(e.start_day)
          } else if (e.end_day) {
            e.start_day = subDays(isDate(e.end_day) ? e.end_day : parseISO(e.end_day), 1)
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

          e.end_day = e.end_day ? (isDate(e.end_day) ? e.end_day : parseISO(e.end_day)) : new Date()
          if (isEqual(e.start_day, e.end_day)) {
            e.end_day = addDays(e.end_day, 1)
          }

          if (isBefore(e.end_day, e.start_day)) {
            const err = new Error(t('messages.invalid_date', { start: formatISO(e.start_day, { representation: 'date' }), end: formatISO(e.end_day, { representation: 'date' }), name: e.user_title }).toString())
            err.id = 42
            dateRangeErrors.push(err)
          }
        })

        if (dateRangeErrors.length > 0) {
          messages.value = dateRangeErrors
          throw dateRangeErrors[0]
        }

        createGroupCategories(list.sort((a, b) => compareAsc(a.start_day, b.start_day)))
        model.value = list
        loading.value = false
      }

      const handleError = e => {
        if (e.response && e.response.status === 404) {
          error.value = 'NotFound'
          messages.value = [{ message: t('messages.not_found') }]
        } else if (e.id === 42) {
          error.value = 'DateRange'
          messages.value.unshift({ message: t('messages.date_range') })
        } else {
          error.value = 'Other'
          messages.value = [{ message: t('messages.unavail') }]
        }

        loading.value = false
      }

      const useAnilistNative = false
      if (useAnilistNative) {
        const { data: { data: { User: { avatar, id } } } } = await http.post('https://graphql.anilist.co', { query: `query {User(name: "${route.params.username}") {id name avatar { large } } }` })

        emit('update-user', {
          username: route.params.username,
          avatar: avatar.large,
          url: animeListUrl.value
        })

        await http
          .post('https://graphql.anilist.co', { query: `query { MediaListCollection(userId: ${id}, type: ANIME) { lists { name entries { ...mediaListEntry } } } } fragment mediaListEntry on MediaList { scoreRaw: score(format: POINT_100) startedAt { year month day } completedAt { year month day } media { id title { userPreferred english romaji native } description(asHtml: true) coverImage { large } averageScore siteUrl } }` })
          .then(({ data: { data: { MediaListCollection: { lists } } } }) => {
            const mergedList = [...lists.find(e => e.name === 'Completed').entries, ...lists.find(e => e.name === 'Watching').entries]

            processList(mergedList.map(e => {
              return {
                average: e.media.averageScore,
                cover: e.media.coverImage.large,
                description: e.media.description,
                end_day: !!e.completedAt.year ? new Date(e.completedAt.year, e.completedAt.month, e.completedAt.day) : null,
                english: e.media.title.english,
                id: e.media.id,
                native: e.media.title.native,
                romaji: e.media.title.romaji,
                score: e.scoreRaw,
                start_day: !!e.startedAt.year ? new Date(e.startedAt.year, e.startedAt.month, e.startedAt.day) : null,
                user_title: e.media.title.userPreferred
              }
            }))
          })
        .catch(e => handleError(e))
      } else {
        await http
          .get(`/users/${username}`)
          .then(({ data: { users } }) => {
            emit('update-user', {
              username: users.id,
              avatar: users.avatar,
              url: animeListUrl
            })

            processList(users.list)
          })
          .catch(e => handleError(e))
      }
    }

    const modalActive = ref(false)

    const updateUser = () => {
      http
        .post(`/users/${route.params.username}`, { dataType: 'text' })
        .then(() => (modalActive.value = true))
    }

    watch(() => route.params, async newParams => fetchData(newParams))

    fetchData(route.params)

    return {
      t,
      animeListUrl,
      loading,
      error,
      messages,
      model,
      lang: ref('user'),
      modalActive,
      updateUser
    }
  }
}
</script>

<style scoped lang='css'>
.user-grid {
  grid: 'user' 1fr
        'controls' 180px /
        1fr;
  grid-row-gap: 4px;
}

.user {
  grid-area: user;
}

.controls {
  grid-area: controls;
  grid: 'language       update     disclaimer' 1fr /
        1fr         1fr        1fr;
  grid-row-gap: 4px;
}

@media (max-width: 640px) {
  .controls {
    grid: 'language' 1fr
          'update' 1fr
          'disclaimer' 1fr /
          1fr;
    grid-row-gap: 2px;
  }
}

.disclaimer {
  grid-area: disclaimer;
}

.update {
  grid-area: update;
}

.language {
  grid-area: language;
}
</style>
