import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.less']
})
export class AppHeaderComponent implements AfterViewInit {

  mouseEnter(event: MouseEvent, id: string) {
    console.log('mouseEnter');
    $(`#${id}`).css({left: $(event.currentTarget).offset().left}).show();
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
