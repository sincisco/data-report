import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ConfigModel} from '../graphic.config';

@Component({
  selector: 'app-comment-config',
  templateUrl: './comment.config.component.html',
  styleUrls: ['./comment.config.component.less']
})
export class CommentConfigComponent extends ConfigModel implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  @Output() output = new EventEmitter();

  option = {
    backgroundColor: 'transparent'
  };

  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.ngForm.valueChanges.subscribe((value) => {
        console.log('CommentConfigComponent valueChanges', JSON.stringify(value));
        if (this.graphic) {
          this.graphic.update(value);
        }
      });
    }, 50);
  }
}

