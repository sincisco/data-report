import {
  AfterViewInit,
  Component,
  EventEmitter,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DesignGraphicConfig} from '../../../core/source/config.source/design.config.source';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-image-config',
  templateUrl: './image.config.component.html',
  styleUrls: ['./image.config.component.less']
})
export class ImageConfigComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  @Output() output = new EventEmitter();

  option = {
    preserveAspectRatio: false,
    backgroundColor: undefined,
    borderStyle: 'solid',
    borderColor: '#aaa',
    borderWidth: 0,
    borderRadius: 0,
    image: {
      fileName: '',
      width: 400,
      height: 300,
      url: '',
      dataUrl: ''
    }
  };

  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      console.log('ImageConfigComponent', value);
      const array = [];
      const changes = this._differ.diff(value);
      if (changes) {
        changes.forEachRemovedItem((record) => {
          console.log('removedItem', JSON.stringify(record.key));
          array.push({
            key: `remove.${record.key}`,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
        });
        changes.forEachAddedItem((record) => {
          array.push({
            key: `add.${record.key}`,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
          console.log('addedItem', JSON.stringify(record.key));
        });
        changes.forEachChangedItem((record) => {
          console.log('changedItem', JSON.stringify(record.key));
          array.push({
            key: record.key,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
        });
      } else {
        console.log('has no changes');
      }
      if (array.length > 0) {
        this._subject.next(array);
        this._update(array);
      }
    });
  }

}

