<template>
  <div ref="chartdiv" lang="ja" class="chart text-italic"></div>
</template>

<script>
import {
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
import { compareAsc, compareDesc } from 'date-fns'

import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import theme from '@amcharts/amcharts4/themes/spiritedaway'

options.autoSetClassName = true
useTheme(am4themesAnimated)

const colorSet = new ColorSet()
theme(colorSet)

export default {
  name: 'Chart',
  props: ['list', 'sort', 'lang'],
  computed: {
    sortedList() {
      let temp = this.list
      if (this.sort === 'Ascending') {
        temp.sort((a, b) => compareAsc(b.start_day, a.start_day))
      } else {
        temp.sort((a, b) => compareDesc(b.start_day, a.start_day))
      }

      if (this.chart) {
        this.chart.invalidateData()
      }

      temp.forEach(e => (e.color = colorSet.next()))

      return temp
    }
  },
  watch: {
    sort() {
      this.createChart()
    },
    lang() {
      this.createChart()
    }
  },
  methods: {
    createChart() {
      if (this.chart) {
        this.chart.dispose()
      }

      let chart = create(this.$refs.chartdiv, XYChart)

      chart.data = this.sortedList
      chart.paddingRight = 30
      chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd'

      const categoryAxis = chart.yAxes.push(new CategoryAxis())
      categoryAxis.dataFields.category = this.lang
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.inversed = true
      categoryAxis.renderer.fontSize = 12
      categoryAxis.renderer.labels.template.disabled = true
      categoryAxis.cursorTooltipEnabled = false

      const dateAxis = chart.xAxes.push(new DateAxis())
      dateAxis.dateFormatter.dateFormat = 'yyyy-MM-dd'
      dateAxis.renderer.minGridDistance = 70
      dateAxis.baseInterval = { count: 1, timeUnit: 'day' }
      dateAxis.tooltipDateFormat = 'yyyy-MM-dd'
      dateAxis.renderer.fontSize = 12

      const series1 = chart.series.push(new ColumnSeries())
      series1.columns.template.width = percent(80)
      series1.columns.template.tooltipText = `{${this.lang}}: {openDateX} - {dateX}`

      series1.dataFields.openDateX = 'start_day'
      series1.dataFields.dateX = 'end_day'
      series1.dataFields.categoryY = this.lang
      series1.columns.template.propertyFields.fill = 'color'
      series1.columns.template.propertyFields.stroke = 'color'

      series1.columns.template.events.on('hit', ev => window.open(`https://anilist.co/anime/${ev.target.dataItem.dataContext.id}`, '_blank'), this)

      chart.cursor = new XYCursor()
      chart.cursor.lineX.strokeDasharray = ''
      chart.cursor.lineY.disabled = true
      chart.cursor.behavior = 'zoomXY'

      chart.scrollbarX = new Scrollbar()
      chart.scrollbarY = new Scrollbar()
    },

    updateValue(destination, newValue) {
      this[`${destination}Key`] = newValue
    }
  },

  mounted() {
    this.createChart()
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style lang="scss">
  .amcharts-XYSeries {
    .amcharts-Sprite-group .amcharts-Container-group {
      cursor: pointer;
    }
  }
</style>
