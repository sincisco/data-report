import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DesignGraphicConfig} from '../../../core/source/config.source/design.config.source';

@Component({
  selector: 'app-header-config',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class DataHeaderComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  @Output() output = new EventEmitter();

  option = {
    text: '我是标题',
    backgroundColor: undefined
  };

  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {
    this.ngForm.valueChanges.subscribe((value) => {
      console.log(JSON.stringify(value));
      console.log(JSON.stringify(this.option));
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('has change');
        this.output.emit(value);
      }
    });
  }

}
