import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SystemService } from '../system.service';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.html',
  styleUrls: ['./personal-center.less']
})
export class PersonalCenterComponent implements OnInit {
  isCollapsed = false;
  triggerTemplate = null;
  @ViewChild('trigger')
  customTrigger: TemplateRef<void>;
  testSpace = [];

  constructor(private service: SystemService, private router: Router) {}

  ngOnInit() {
    this.service.getSpaces().subscribe(arg => {
      this.testSpace = arg.retList;
      console.log(arg);
    });
  }

  post() {
    this.service.getSpaces().subscribe(arg => {
      this.testSpace = arg.retList;
      console.log(arg);
    });
  }
  openDetail(item) {
    // this.service.listenEvent(item);
    this.router.navigate(['space'], {
      queryParams: item
    });
  }

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
}
