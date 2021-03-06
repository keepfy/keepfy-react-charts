import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import {
  IDefaultChartProps,
  TCoordinates,
  TOptionsProps,
  TTuple
} from './types'
import { map } from 'ramda'
import {
  getSaveAsImageWithTitle,
  getSaveAsImage, getDataView
} from './auxiliarFunctions'
import { TOOLBOX_DEFAULT_PROPS } from './AreaChart'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
  coordinates: [TCoordinates[], TCoordinates[], TCoordinates[]]
  colors?: string[]
  height?: number
  legendNames?: [string, string, string]
  coordinateNames?: { x: string, y: string }
  yRangeValues?: number
  xMaxValue?: number
  legendPosition?: number
}

export const DASHED_ICON =
  'path://M180 1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z, M810 ' +
  '1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40zm, M1440 1000 l0 ' +
  '-40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z'

const CoordinateLineChart = (props: IProps) => {
  const {
    coordinates,
    colors,
    height,
    title: titleProps,
    coordinateNames,
    legendNames,
    yRangeValues,
    xMaxValue,
    grid,
    legendPosition,
    width,
    toolboxTooltip
  } = props

  const [title, setTitle] = useState(false)
  const [ref, pre, pos] = coordinates

  useEffect(() => {
    if (toolboxTooltip && toolboxTooltip.saveAsImageWithTitle) {
      setTitle(false)
    } else {
      setTitle(true)
    }
  }, [toolboxTooltip])

  const handleShowTitle = (show: boolean) => {
    setTitle(show)
  }

  const myTool = toolboxTooltip && toolboxTooltip.saveAsImageWithTitle && {
    myTool: getSaveAsImageWithTitle(
      toolboxTooltip.saveAsImageWithTitle,
      handleShowTitle
    )
  }

  const saveAsImage = toolboxTooltip && toolboxTooltip.saveAsImage && {
    saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage)
  }

  const toolbox = toolboxTooltip && {
    ...TOOLBOX_DEFAULT_PROPS,
    feature: {
      ...myTool,
      ...saveAsImage,
      dataView: toolboxTooltip.dataView &&
        getDataView(toolboxTooltip.dataView)
    }
  }

  const reference: TTuple[] = map(item => [item.x, item.y], ref)
  const preRespiratory: TTuple[] = map(item => [item.x, item.y], pre)
  const posResporatory: TTuple[] = map(item => [item.x, item.y], pos)

  const namePadding = yRangeValues ? [150, 0, 0, 0] : [20, 0, 0, 0]

  const options: TOptionsProps = {
    color: colors,
    series: [
      {
        name: legendNames[0] || '',
        showSymbol: false,
        type: 'line',
        data: reference,
        smooth: true,
        lineStyle: {
          width: 1.5,
          type: 'dashed'
        }
      },
      {
        name: legendNames[1] || '',
        showSymbol: false,
        type: 'line',
        data: preRespiratory,
        smooth: true
      },
      {
        name: legendNames[2] || '',
        showSymbol: false,
        type: 'line',
        data: posResporatory,
        smooth: true
      }
    ],
    yAxis: {
      type: 'value',
      name: coordinateNames.y,
      nameGap: 10,
      min: -yRangeValues || 0,
      max: yRangeValues || 8,
      interval: 2
    },
    xAxis: {
      type: 'value',
      name: coordinateNames.x,
      nameTextStyle: {
        verticalAlign: yRangeValues ? 'top' : 'end',
        padding: namePadding
      },
      nameGap: -56,
      min: 0,
      max: xMaxValue || 8,
      interval: 2,
      axisTick: {
        show: false
      }
    },
    legend: {
      top: legendPosition ?? 26,
      data: [
        {
          name: legendNames[0] || '',
          icon: DASHED_ICON
        },
        { name: legendNames[1] || '' },
        { name: legendNames[2] || '' }
      ],
      icon: 'line',
      itemGap: 30
    },
    title: {
      left: '6.2%',
      show: title,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '400' as const
      }
    },
    grid: {
      containLabel: true,
      ...grid
    },
    toolbox
  }

  const widthStyle = { width: width || 'auto', height: height }

  return (
    <ReactEcharts style={widthStyle} option={options} />
  )
}

export default CoordinateLineChart
