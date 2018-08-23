import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';

const mostRecentlyUsedColors = [];

@Component({
  selector: 'app-simple-color-picker',
  templateUrl: './simple.color.picker.component.html',
  styleUrls: ['./simple.color.picker.component.less']
})
export class SimpleColorPickerComponent implements AfterViewInit {

  @Output() output = new EventEmitter();

  constructor() {
    this.mostRecentlyUsedColors = mostRecentlyUsedColors;
  }

  colors = [['rgb(0, 0, 0)', 'rgb(26, 26, 26)', 'rgb(51, 51, 51)', 'rgb(68, 68, 68)', 'rgb(102, 102, 102)', 'rgb(128, 128, 128)'],
    ['rgb(255, 255, 255)', 'rgb(242, 242, 242)', 'rgb(217, 217, 217)', 'rgb(191, 191, 191)', 'rgb(166, 166, 166)', 'rgb(140, 140, 140)'],
    ['rgb(86, 119, 252)', 'rgb(231, 233, 253)', 'rgb(175, 191, 255)', 'rgb(115, 143, 254)', 'rgb(78, 108, 239)', 'rgb(59, 80, 206)'],
    ['rgb(230, 42, 16)', 'rgb(253, 224, 219)', 'rgb(250, 190, 186)', 'rgb(247, 154, 132)', 'rgb(233, 83, 55)', 'rgb(222, 39, 6)'],
    ['rgb(255, 193, 7)', 'rgb(255, 248, 225)', 'rgb(255, 224, 130)', 'rgb(255, 202, 40)', 'rgb(255, 179, 0)', 'rgb(255, 143, 0)'],
    ['rgb(37, 155, 36)', 'rgb(208, 248, 206)', 'rgb(114, 213, 114)', 'rgb(43, 175, 43)', 'rgb(10, 143, 8)', 'rgb(5, 111, 0)'],
    ['rgb(103, 58, 183)', 'rgb(237, 231, 246)', 'rgb(179, 157, 219)', 'rgb(126, 87, 194)', 'rgb(94, 53, 177)', 'rgb(69, 39, 160)'],
    ['rgb(233, 30, 99)', 'rgb(252, 228, 236)', 'rgb(248, 187, 208)', 'rgb(240, 98, 146)', 'rgb(233, 30, 99)', 'rgb(216, 27, 96)']];

  selectedColor = 'transparent';

  mostRecentlyUsedColors: Array<string>;

  selectColor(color) {
    this.selectedColor = color;
    this.mostRecentlyUsedColors.unshift(color);
    if (this.mostRecentlyUsedColors.length > 16) {
      this.mostRecentlyUsedColors.pop();
    }
    this.output.emit(color);
  }


  ngAfterViewInit() {

  }


}
