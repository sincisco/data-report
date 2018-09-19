import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AddUserComponent } from './components/add-user.component';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.html',
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
export class UserManageComponent implements OnInit {
  constructor(private nzModal: NzModalService) {}

  ngOnInit() {}
  addUser() {
    this.nzModal.create({
      nzTitle: '新增用户',
      nzContent: AddUserComponent,
      nzWidth: '50%',
      nzStyle: {
        top: '10%'
      }
    });
  }
}
