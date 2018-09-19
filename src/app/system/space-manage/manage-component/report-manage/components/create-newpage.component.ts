import { Component, OnInit } from '@angular/core';
import { NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-newpage',
  templateUrl: './create-newpage.html',
  styles: [
    `
      nz-date-picker ::ng-deep .ant-calendar-picker {
        width: 100%;
      }
    `
  ]
})
export class CreateNewpageComponent implements OnInit {
  expandKeys = ['1001', '10001'];
  value: string;
  nodes = [
    new NzTreeNode({
      title: 'root1',
      key: '1001',
      children: [
        {
          title: 'child1',
          key: '10001',
          children: [
            {
              title: 'child1.1',
              key: '100011',
              children: []
            },
            {
              title: 'child1.2',
              key: '100012',
              children: [
                {
                  title: 'grandchild1.2.1',
                  key: '1000121',
                  isLeaf: true,
                  disabled: true
                },
                {
                  title: 'grandchild1.2.2',
                  key: '1000122',
                  isLeaf: true
                }
              ]
            }
          ]
        }
      ]
    }),
    new NzTreeNode({
      title: 'root2',
      key: '1002',
      children: [
        {
          title: 'child2.1',
          key: '10021',
          children: [],
          disableCheckbox: true
        },
        {
          title: 'child2.2',
          key: '10022',
          children: [
            {
              title: 'grandchild2.2.1',
              key: '100221',
              isLeaf: true
            }
          ]
        }
      ]
    })
  ];

  onChange($event: NzTreeNode): void {
    console.log($event);
  }

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.value = '10001';
    }, 1000);
  }
}
