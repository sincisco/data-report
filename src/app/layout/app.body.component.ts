import {AfterViewInit, Component} from '@angular/core';
import {Report} from '../node/canvas/report';
import {ExplicitRegion} from '../node/region/explicit.region';

@Component({
  selector: 'app-body',
  templateUrl: './app.body.component.html',
  styleUrls: ['./app.body.component.less']
})
export class AppBodyComponent implements AfterViewInit {

  report;

  ngAfterViewInit() {
    var report = this.report = new Report();
    report.addChild(new ExplicitRegion());
    $('.app-content').prepend(report.$element);

    return;
  }

  private _chart;

  get chart() {
    return this._chart;
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    console.log('****', event);
    this.report.scale = event;
  }

}


