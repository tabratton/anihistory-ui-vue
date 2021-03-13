<template>
  <div
    ref="chartDiv"
    lang="ja"
    class="h-full w-full text-italic"
  />
</template>

<script>
import {
  color,
  ColorSet,
  create,
  options,
  percent,
  Scrollbar,
  useTheme
} from '@amcharts/amcharts4/core'
import {
  CategoryAxis,
  ColumnSeries,
  DateAxis,
  XYChart,
  XYCursor
} from '@amcharts/amcharts4/charts'

import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import theme from '@amcharts/amcharts4/themes/spiritedaway'

import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

options.autoSetClassName = true
useTheme(am4themesAnimated)

const colorSet = new ColorSet()
theme(colorSet)

export default {
  name: 'Chart',
  props: {
    list: {
      type: Array,
      required: true
    },
    lang: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { list, lang } = toRefs(props)

    const chartDiv = ref(null)

    const chart = ref(null)
    const createChart = () => {
      if (chart.value) {
        chart.value.dispose()
      }

      const internalChart = create(chartDiv.value, XYChart)

      internalChart.data = list.value.map(item => {
        return {
          color: colorSet.next(),
          ...item
        }
      })
      internalChart.paddingRight = 30
      internalChart.dateFormatter.inputDateFormat = 'yyyy-MM-dd'

      const categoryAxis = internalChart.yAxes.push(new CategoryAxis())
      categoryAxis.dataFields.category = 'category'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.grid.template.strokeOpacity = 0.15
      categoryAxis.renderer.grid.template.stroke = color('#F9FAFB')
      categoryAxis.renderer.inversed = true
      categoryAxis.renderer.fontSize = 12
      categoryAxis.renderer.labels.template.disabled = true
      categoryAxis.cursorTooltipEnabled = false

      const dateAxis = internalChart.xAxes.push(new DateAxis())
      dateAxis.dateFormatter.dateFormat = 'yyyy-MM-dd'
      dateAxis.renderer.minGridDistance = 70
      dateAxis.baseInterval = { count: 1, timeUnit: 'day' }
      dateAxis.tooltipDateFormat = 'yyyy-MM-dd'
      dateAxis.renderer.fontSize = 12
      dateAxis.renderer.labels.template.fill = color('#F9FAFB')
      dateAxis.renderer.labels.template.opacity = 0.87
      dateAxis.renderer.grid.template.strokeOpacity = 0.15
      dateAxis.renderer.grid.template.stroke = color('#F9FAFB')

      const series1 = internalChart.series.push(new ColumnSeries())
      series1.columns.template.width = percent(80)
      series1.columns.template.tooltipText = `{${lang.value}}: {openDateX} - {dateX}`

      series1.dataFields.openDateX = 'start_day'
      series1.dataFields.dateX = 'end_day'
      series1.dataFields.categoryY = 'category'
      series1.columns.template.propertyFields.fill = 'color'
      series1.columns.template.propertyFields.stroke = 'color'

      series1.columns.template.events.on('hit', ev => window.open(`https://anilist.co/anime/${ev.target.dataItem.dataContext.id}`, '_blank'), this)

      internalChart.cursor = new XYCursor()
      internalChart.cursor.lineX.strokeDasharray = ''
      internalChart.cursor.lineY.disabled = true
      internalChart.cursor.behavior = 'zoomXY'

      internalChart.scrollbarX = new Scrollbar()
      internalChart.scrollbarY = new Scrollbar()

      function customizeGrip(grip) {
        grip.icon.disabled = true
        grip.background.fill = color('#E5E7EB')
        grip.background.fillOpacity = 1
      }

      internalChart.scrollbarX.thumb.background.fill = color('#E5E7EB')
      internalChart.scrollbarX.thumb.background.fillOpacity = 0.05
      internalChart.scrollbarY.thumb.background.fill = color('#E5E7EB')
      internalChart.scrollbarY.thumb.background.fillOpacity = 0.05

      customizeGrip(internalChart.scrollbarX.startGrip)
      customizeGrip(internalChart.scrollbarX.endGrip)
      customizeGrip(internalChart.scrollbarY.startGrip)
      customizeGrip(internalChart.scrollbarY.endGrip)

      internalChart.zoomOutButton.background.fill = color('#B45309')
      internalChart.zoomOutButton.icon.stroke = color('#E5E7EB')
      internalChart.zoomOutButton.background.states.getKey('hover').properties.fill = color('#D97706')

      chart.value = internalChart
    }

    watch(lang, createChart)
    onMounted(() => createChart())
    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value.dispose()
      }
    })

    return { chartDiv }
  }
}
</script>

<style lang="css">
  .amcharts-XYSeries .amcharts-Sprite-group .amcharts-Container-group {
    cursor: pointer;
  }
</style>
