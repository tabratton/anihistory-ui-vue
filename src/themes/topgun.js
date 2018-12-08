import { color, ColorSet } from '@amcharts/amcharts4/core'

export default function am4themesTopGun(target) {
  if (target instanceof ColorSet) {
    target.list = [
      color('#180d09'),
      color('#3c180c'),
      color('#785b3d'),
      color('#f2d788'),
      color('#d19743'),
      color('#c15725'),
      color('#750c11'),
      color('#201537'),
      color('#071739'),
      color('#2552e3')
    ]
  }
}
