import {AfterViewInit, Component} from '@angular/core';
import {session} from '@core/node/utils/session';
import {Subscription} from 'rxjs';
import {IReportPage} from '@core/node/page/report/page.interface';
import {RegionController} from '@core/node/region/region.controller';
import {delay} from 'rxjs/operators';


@Component({
  selector: 'app-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.less']
})
export class OutlineComponent implements AfterViewInit {
  private _pageChangeSubscription: Subscription;
  private _regionArrayChangeSubscription: Subscription;

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
        });
    });
  }
}

