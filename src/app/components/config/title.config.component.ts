import {
  AfterViewInit,
  Component, ComponentFactoryResolver, Input,
  KeyValueDiffer,
  KeyValueDiffers, NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {reportGlobal} from '../../node/region/region';
import {Title} from '../../node/content/chart/echart.interface/title';

@Component({
  selector: 'app-title-config',
  templateUrl: './title.config.component.html',
  styleUrls: ['./title.config.component.less']
})
export class TitleConfigComponent implements AfterViewInit, OnInit {


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
