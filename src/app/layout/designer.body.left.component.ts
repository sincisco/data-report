import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {session} from '@core/node/utils/session';
import {customGraphicMeta, graphicFactory} from '@core/node/factory/graphic.factory';
import * as _ from 'lodash';
import {grabHelper} from './designer.header.component';

@Component({
  selector: 'app-designer-body-left',
  templateUrl: './designer.body.left.component.html',
  styleUrls: ['./designer.body.left.component.less']
})
export class DesignerBodyLeftComponent implements AfterViewInit {

  report;

  constructor(private _elementRef: ElementRef) {

  }


  get customComponentList() {
    return _.toPairs(customGraphicMeta);
  }

  dragstart(dragEvent: DragEvent) {
    const mouseMove = (event: MouseEvent) => {
      console.log('mouseMove');
      grabHelper.refresh(event.pageX, event.pageY);
    };
    const mouseUp = (event: MouseEvent) => {
      console.log('document mouseup', event, session.currentPage.offset());

      graphicFactory.createByName(componentName, session.currentPage,
        event.pageX - session.currentPage.offset().left - grabHelper.offsetX,
        event.pageY - session.currentPage.offset().top - grabHelper.offsetY);
      grabHelper.hidden();
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    let componentName: string;
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    componentName = (<HTMLElement>dragEvent.target).getAttribute('componentName');

    grabHelper.show(dragEvent.pageX, dragEvent.pageY, customGraphicMeta[componentName].grabOption);
    return false;
  }

  ngAfterViewInit() {
  }
}

