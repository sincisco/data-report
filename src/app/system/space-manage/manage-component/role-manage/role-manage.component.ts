import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AddRoleComponent } from './components/add-role.component';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.html',
  styles: [
    `
      .title-tab {
        height: 32px;
        line-height: 32px;
        font-size: x-large;
      }
      .title-tab + div {
        float: right;
        padding-right: 16px;
      }
    `
  ]
})
export class RoleManageComponent implements OnInit {
  constructor(private nzModal: NzModalService) {}

  ngOnInit() {}
  addRole() {
    this.nzModal.create({
      nzTitle: '新建角色',
      nzContent: AddRoleComponent,
      nzWidth: '50%',
      nzStyle: {
        top: '10%'
      }
    });
  }
}
