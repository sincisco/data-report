import { Component, OnInit } from '@angular/core';
import { SystemService } from '../system.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-space-groups',
  templateUrl: './space-groups.html',
  styleUrls: ['./space-groups.less']
})
export class SpaceGroupsComponent implements OnInit {
  groups = [];
  constructor(private service: SystemService, private router: Router) {}

  ngOnInit() {
    this.service.getSpaces().subscribe(data => {
      this.groups = data.retList;
    });
  }
  openDetail(item) {
    this.router.navigate(['groups/' + item.spaceId]);
  }
}
