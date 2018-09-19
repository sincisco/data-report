import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SpaceManageService } from './space-manage.service';
import { Subscription } from 'rxjs';
import { SystemService } from '../system.service';

@Component({
  selector: 'app-space-manage',
  templateUrl: './space-manage.html',
  styleUrls: ['./space-manage.less']
})
export class SpaceManageComponent implements OnInit {
  isCollapsed = false;
  @ViewChild('trigger')
  groups = [];
  test = [];
  group = {
    groupId: '',
    groupName: ''
  };

  constructor(
    private acRouter: ActivatedRoute,
    private router: Router,
    private service: SpaceManageService,
    private SysService: SystemService
  ) {}

  ngOnInit() {
    const a = this.acRouter.snapshot.params['id'];
    console.log('路由参数为' + a);
    // this.space['spaceName'] = a;
    this.group.groupId = a;
    this.SysService.getReportsBySpaceId(a).subscribe(data => {
      this.test = data.retList;
      this.redirecTo();
      console.log(a);
    });
    this.SysService.getSpaces().subscribe(data => {
      this.groups = data.retList;
    });
  }
  goSpace(item) {
    this.group.groupId = item.spaceId;
    this.SysService.getReportsBySpaceId(item.spaceId).subscribe(data => {
      this.test = data.retList;
      this.redirecTo();
      console.log(item);
    });
    this.SysService.getSpaces().subscribe(data => {
      this.groups = data.retList;
    });
  }

  redirecTo() {
    this.router.navigate(['reportDetail'], {
      relativeTo: this.acRouter,
      queryParams: this.test[0]
    });
    console.log('---------------');
  }
}
