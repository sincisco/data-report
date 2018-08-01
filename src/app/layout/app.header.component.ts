import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.less']
})
export class AppHeaderComponent implements AfterViewInit {

  mouseEnter(event: MouseEvent, id: string) {
    console.log('mouseEnter');
    let offsetLeft = 0;
    if (id === 'moreTools') {
      offsetLeft = 52;
    } else if (id === 'filterTools') {
      offsetLeft = 12;
    }
    $(`#${id}`).css({left: $(event.currentTarget).offset().left - offsetLeft}).show();
  }

  mouseLeave() {
    console.log('mouseLeave');
  }

  ngAfterViewInit() {
    $('#helperTools').mouseleave(() => {
      console.log('helperTools mouseLeave');
      $('#helperTools').hide();
    });

    $('#filterTools').mouseleave(() => {
      console.log('helperTools mouseLeave');
      $('#filterTools').hide();
    });

    $('#moreTools').mouseleave(() => {
      console.log('helperTools mouseLeave');
      $('#moreTools').hide();
    });
  }

}
