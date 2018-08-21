import {ExplicitRegion} from '@core/node/region/explicit.region';
import {ReportCanvas} from '@core/node/canvas/report/report.canvas';
import {ChartGraphic} from '@core/node/graphic/chart.graphic';
import {BarChart} from '@core/node/content/chart/bar.chart';
import {TextGraphic} from '@core/node/graphic/text.graphic';
import {TextAuxiliary} from '@core/node/content/auxiliary/text.auxiliary';
import {currentReport} from '../../../layout/app.body.component';
import {CommentRegion} from '@core/node/region/comment.region';
import {CommentAuxiliary} from '@core/node/content/auxiliary/comment.auxiliary';
import {CommentGraphic} from '@core/node/graphic/comment.graphic';


class GraphicFactory {
  createBarChart(canvas: ReportCanvas, x: number, y: number) {
    console.log('新建图表');
    const explicitRegion = new ExplicitRegion();
    explicitRegion.setCoordinates(x, y);
    explicitRegion.refresh();
    canvas.addChild(explicitRegion);

    const _graphic = new ChartGraphic(explicitRegion);

    _graphic.init(BarChart);

    _graphic.load();
    // 使用刚指定的配置项和数据显示图表。
  }

  createTextAuxiliary(canvas: ReportCanvas, x: number, y: number) {
    console.log('新建文本段');
    const explicitRegion = new ExplicitRegion();
    explicitRegion.setCoordinates(x, y);
    explicitRegion.refresh();
    canvas.addChild(explicitRegion);

    const _graphic = new TextGraphic(explicitRegion);

    // 使用刚指定的配置项和数据显示图表。
    _graphic.init(TextAuxiliary);

    _graphic.load();
  }

  createCommentAuxiliary(canvas: ReportCanvas, x: number, y: number) {
    console.log('新建注释');
    const commentRegion = new CommentRegion();
    commentRegion.setCoordinates(x, y);
    commentRegion.refresh();
    canvas.addChild(commentRegion);

    const _graphic = new CommentGraphic(commentRegion);

    // 使用刚指定的配置项和数据显示图表。
    _graphic.init(CommentAuxiliary);

    _graphic.load();
    // const _graphic = new TextGraphic(explicitRegion);

    // 使用刚指定的配置项和数据显示图表。
    // _graphic.init(TextAuxiliary);
  }

  createByName(name: string, canvas: ReportCanvas, x: number, y: number) {
    switch (name) {
      case 'textAuxiliary':
        this.createTextAuxiliary(canvas, x, y);
        break;
      case 'commentAuxiliary':
        this.createCommentAuxiliary(canvas, x, y);
        break;
    }
  }

  createFromOption(option: any, x, y) {
    console.log('新建文本段');
    const explicitRegion = new ExplicitRegion();
    explicitRegion.setCoordinates(x, y);
    explicitRegion.refresh();
    currentReport.addChild(explicitRegion);

    const _graphic = new option.graphicClass(explicitRegion);

    // 使用刚指定的配置项和数据显示图表。
    _graphic.init(option.graphic.contentClass);

    _graphic.update(option.graphic.option);
  }
}

export const graphicFactory = new GraphicFactory();
