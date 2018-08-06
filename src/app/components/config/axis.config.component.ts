import {
  AfterViewInit,
  Component, Input,
  KeyValueDiffer,
  KeyValueDiffers, NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {reportGlobal} from '../../node/region/region';
import {Title} from '../../node/content/chart/echart.interface/title';

@Component({
  selector: 'app-axis-config',
  templateUrl: './axis.config.component.html',
  styleUrls: ['./axis.config.component.less']
})
export class AxisConfigComponent implements AfterViewInit, OnInit {


  @ViewChild(NgForm) ngForm: NgForm;

  private _differ: KeyValueDiffer<any, any>;

  @Input() option: Title = {};

  constructor(private _differs: KeyValueDiffers,
              private zone: NgZone) {
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  ngAfterViewInit() {
    console.log(this.ngForm);
    this.ngForm.valueChanges.subscribe((value) => {
      console.log('TitleConfigComponent valueChanges');
      console.log(value);
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('has change');
        if (reportGlobal.instance) {
          reportGlobal.instance.update({
            title: value
          });
        }
      }

    });
  }

}
