import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {session} from '@core/node/utils/session';
import {Subscription} from 'rxjs';
import {IReportPage} from '@core/node/page/report/page.interface';
import {RegionController} from '@core/node/region/region.controller';
import {delay} from 'rxjs/operators';


@Component({
  selector: 'app-designer-body-left',
  templateUrl: './designer.body.left.component.html',
  styleUrls: ['./designer.body.left.component.less']
})
export class DesignerBodyLeftComponent implements AfterViewInit {

  report;

  private _pageChangeSubscription: Subscription;

  list: Array<any> = [];

  constructor() {

  }

  ngAfterViewInit() {
    let _regionArrayChangeSubscription: Subscription;
    this._pageChangeSubscription = session.pageChange.subscribe((currentPage: IReportPage) => {
      if (_regionArrayChangeSubscription) {
        _regionArrayChangeSubscription.unsubscribe();
      }
      _regionArrayChangeSubscription = currentPage
        .regionArrayAsObservable.pipe(delay(100)).subscribe((regionArray: Array<RegionController>) => {
          console.log('regionArray', regionArray.length, regionArray);
          this.list = regionArray.map((region: RegionController) => {
            return region.invoke('desc');
          });
          console.log(JSON.stringify(this.list));
        });
    });
  }
}

