import * as _ from 'lodash';
import {FlipBarChartGraphic} from '@core/node/graphic/chart/flip.bar.chart.graphic';

interface GraphicMeta {
  region: {
    regionKey: string;
    regionOption?: any;
  };
  graphic: {
    graphicKey: string,
    configOption: any,
    dataOptionId: string
  };
  regionOption?: any;
  grabOption?: {
    width: number,
    height: number,
    backgroundImage: string
  };
  displayName?: string;
  imageClass?: string;
}

interface GraphicMetaMap {
  [key: string]: GraphicMeta;
}


const defaultGraphicMetaMap: Map<string, GraphicMeta> = new Map();


export const stdGraphicMeta: GraphicMetaMap = {
  barChart: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'bar.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  lineChart: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'line.chart.graphic',
      configOption: null,
      dataOptionId: 'num3'
    }
  },
  pieChart: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'pie.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  textAuxiliary: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'text.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  commentAuxiliary: {
    region: {
      regionKey: 'comment.region'
    },
    graphic: {
      graphicKey: 'comment.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  imageAuxiliary: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'image.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  }
};

export const customGraphicMeta: GraphicMetaMap = {
  clock: {
    displayName: '实时时间',
    imageClass: 'baidu-time',
    grabOption: {
      width: 240,
      height: 50,
      backgroundImage: 'url("data:image/png;base64,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")',
    },
    region: {
      regionKey: 'explicit.region',
      regionOption: {
        width: 240,
        height: 50
      }
    },
    graphic: {
      graphicKey: 'clock.graphic',
      configOption: null,
      dataOptionId: 'num1'
    },

  },
  info2: {
    displayName: '数字翻牌器',
    imageClass: 'baidu-chart-flip-number',
    region: {
      regionKey: 'explicit.region',
      regionOption: {
        width: 660,
        height: 120
      }
    },
    graphic: {
      graphicKey: 'flip.number.graphic',
      configOption: null,
      dataOptionId: 'num2'
    }
  },
  table: {
    displayName: '带边框表格',
    imageClass: 'baidu-table',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'table.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  mapProvince: {
    displayName: '省份数据',
    imageClass: 'baidu-map-province',
    region: {
      regionKey: 'explicit.region',
      regionOption: {
        width: 550,
        height: 450
      }
    },
    graphic: {
      graphicKey: 'map.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  mapCity: {
    displayName: '城市数据',
    imageClass: 'baidu-map-city',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  mapCityHeat: {
    displayName: '热力地图',
    imageClass: 'baidu-map-city-heat',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info6: {
    displayName: '柱状图',
    imageClass: 'baidu-chart-bar',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info5: {
    displayName: '横向柱图',
    imageClass: 'baidu-chart-flip-bar',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',  // FlipBarChartGraphic
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  ring: {
    displayName: '环形饼图',
    imageClass: 'baidu-chart-ring',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  gauge: {
    displayName: '仪表盘',
    imageClass: 'baidu-chart-dashboard',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'gauge.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info3: {
    displayName: '漏斗图',
    imageClass: 'baidu-chart-funnel',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info4: {
    displayName: '散点图',
    imageClass: 'baidu-chart-scatter',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  wordCloud: {
    displayName: '词云',
    imageClass: 'baidu-chart-word-cloud',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'wordCloud.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  dashboard: {
    displayName: 'demo',
    imageClass: 'baidu-chart-line',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  }
};

const totalGraphicMetaMap = Object.assign({}, stdGraphicMeta, customGraphicMeta);

_.keys(totalGraphicMetaMap).forEach((key) => {
  defaultGraphicMetaMap.set(key, totalGraphicMetaMap[key]);
});


export const graphicMetaMap = defaultGraphicMetaMap;
