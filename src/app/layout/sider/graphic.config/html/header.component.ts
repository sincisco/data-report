import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'data-html-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class DataHeaderComponent implements AfterViewInit, OnInit, IDataComponent {

  @ViewChild(NgForm) ngForm: NgForm;

  @Output() output = new EventEmitter();

  option = {
    text: '我是标题',
    backgroundColor: undefined
  };

  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
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
        //this._applyChanges(changes);
      }
    });
  }

}

export interface IDataComponent {

}
