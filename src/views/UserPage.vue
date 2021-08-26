<template>
  <div class="user rounded justify-self-stretch flex flex-col p-2">
    <div class="elevation-2 p-4 text-white flex items-center justify-between">
      <h4 class="text-2xl font-bold">
        {{ t('chart.title') }}
      </h4>
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
    <div class="elevation-1 flex flex-col items-center justify-center flex-grow p-4">
      <Loading :loading="loading">
        <Chart
          v-if="!error"
          :list="model"
          :lang="lang"
        />
        <div
          v-if="!error"
          class="controls grid items-center justify-items-center"
        >
          <div class="language text-center flex flex-col">
            <label
              for="lang-select"
              class="sr-only"
            >
              {{ t('chartLanguage.title') }}
            </label>
            <div class="inline-block relative w-64">
              <select
                id="lang-select"
                v-model="lang"
                class="block w-full pl-4 py-2 bg-none"
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
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
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
        </div>
        <div
          v-if="error"
          class="flex flex-col justify-center items-center bg-clip-content"
        >
          <p
            v-for="m in messages"
            :key="m.message"
            class="text-center text-gray-100 text-sm m-2"
          >
            {{ m.message }}
          </p>
          <a
            v-if="error === 'DateRange'"
            class="text-main-500 text-sm"
            :href="animeListUrl"
            target="_blank"
          >
            {{ t('messages.anilist_instructions') }}
          </a>
        </div>
      </Loading>
    </div>
  </div>

<!--  <UpdateModal-->
<!--    v-if="modalActive"-->
<!--    @close="modalActive = false"-->
<!--  />-->
</template>

<script>
import { addDays, addHours, areIntervalsOverlapping, compareAsc, isBefore, isDate, isSameDay, isSameHour, formatISO, parseISO, startOfDay } from 'date-fns'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import Chart from '@/components/Chart'
import Loading from '@/components/Loading'
// import UpdateModal from '@/components/UpdateModal'

export default {
  components: {
    Chart,
    Loading,
    // UpdateModal
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
            .map(rowElement => areIntervalsOverlapping({ start: rowElement.startDay, end: rowElement.endDay }, { start: listElement.startDay, end: listElement.endDay }))
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

        const parsedList = list.map(e => {
          let realStartDay;
          if (e.start_day) {
            realStartDay = isDate(e.start_day) ? e.start_day : parseISO(e.start_day)
          } else if (e.end_day) {
            realStartDay = isDate(e.end_day) ? e.end_day : parseISO(e.end_day)
          } else {
            realStartDay = new Date()
          }

          realStartDay = addHours(startOfDay(realStartDay), 12)

          const realEndDay = startOfDay(e.end_day ? (isDate(e.end_day) ? e.end_day : parseISO(e.end_day)) : new Date())
          const chartEndDay = addHours(addDays(realEndDay, 1), 12)

          if (isBefore(chartEndDay, realStartDay) || (isSameDay(chartEndDay, realStartDay) && isSameHour(chartEndDay, realStartDay))) {
            const err = new Error(t('messages.invalid_date', { start: formatISO(realStartDay, { representation: 'date' }), end: formatISO(realEndDay, { representation: 'date' }), name: e.user_title }).toString())
            err.id = 42
            dateRangeErrors.push(err)
          }

          return {
            english: e.english ? e.english : e.user_title,
            romaji: e.romaji ? e.romaji : e.user_title,
            native: e.native ? e.native : e.user_title,
            user: e.user_title,
            average: e.average,
            cover: e.cover,
            description: e.description,
            id: e.id,
            score: e.score,
            startDay: realStartDay,
            endDay: chartEndDay,
            displayEndDay: realEndDay
          }
        })

        if (dateRangeErrors.length > 0) {
          messages.value = dateRangeErrors
          throw dateRangeErrors[0]
        }

        createGroupCategories(parsedList.sort((a, b) => compareAsc(a.startDay, b.startDay)))
        model.value = parsedList
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

      const useAnilistNative = true
      if (useAnilistNative) {
        const { data: { data: { User: { avatar, id } } } } = await http
          .post('https://graphql.anilist.co', { query: `query {User(name: "${route.params.username}") {id name avatar { large } } }` })
          .catch(err => handleError(err))

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
                average: e.media.averageScore / 10,
                cover: e.media.coverImage.large,
                description: e.media.description,
                end_day: !!e.completedAt.year ? parseISO(`${e.completedAt.year}-${String(e.completedAt.month).padStart(2, '0')}-${String(e.completedAt.day).padStart(2, '0')}`) : null,
                english: e.media.title.english,
                id: e.media.id,
                native: e.media.title.native,
                romaji: e.media.title.romaji,
                score: e.scoreRaw / 10,
                start_day: !!e.startedAt.year ? parseISO(`${e.startedAt.year}-${String(e.startedAt.month).padStart(2, '0')}-${String(e.startedAt.day).padStart(2, '0')}`) : null,
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

    // const modalActive = ref(false)

    // const updateUser = () => {
    //   http
    //     .post(`/users/${route.params.username}`, { dataType: 'text' })
    //     .then(() => (modalActive.value = true))
    // }

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
      // modalActive,
      // updateUser
    }
  }
}
</script>

<style scoped lang='css'>

</style>
