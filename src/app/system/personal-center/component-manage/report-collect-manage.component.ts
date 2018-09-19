import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import { NzModalService, NzDropdownService, NzTreeNode, NzFormatEmitEvent, NzDropdownContextComponent } from 'ng-zorro-antd';

@Component({
  templateUrl: './report-collect-manage.html',
  styles: [
    `
      :host ::ng-deep .ant-tree {
        overflow: hidden;
        margin: 0 -24px;
        padding: 0 24px;
      }

      :host ::ng-deep .ant-tree li {
        padding: 4px 0 0 0;
      }
      @keyframes shine {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 1;
        }
      }

      .shine-animate {
        animation: shine 2s ease infinite;
      }

      .custom-node {
        cursor: pointer;
        line-height: 26px;
        margin-left: 4px;
        display: inline-block;
        margin: 0 -1000px;
        padding: 0 1000px;
      }

      .active {
        color: #1890ff;
      }

      .is-dragging {
        background-color: transparent !important;
        color: #000;
        opacity: 0.7;
      }

      .file-name,
      .folder-name,
      .file-desc,
      .folder-desc {
        margin-left: 4px;
      }

      .file-desc,
      .folder-desc {
        padding: 2px 8px;
        background: #87ceff;
        color: #ffffff;
      }
    `
  ]
})
export class ReportCollectManageComponent implements OnInit {
  dropdown: NzDropdownContextComponent;
  activedNode: NzTreeNode;
  dragNodeElement;

  dataSet = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  nodes = [
    new NzTreeNode({
      title: '根目录',
      key: '1001',
      author: 'ANGULAR',
      expanded: true,
      children: [
        {
          title: '部门报表',
          key: '10001',
          author: 'ZORRO',
          children: [
            {
              title: '支出统计',
              key: '100011',
              author: 'ZORRO',
              children: [
                {
                  title: '一月支出',
                  key: '1000111',
                  isLeaf: true
                }
              ]
            },
            {
              title: '收入统计',
              key: '100012',
              author: 'ZORRO',
              children: [
                {
                  title: '一月收入',
                  key: '1000121',
                  author: 'ZORRO-FANS',
                  isLeaf: true,
                  checked: false,
                  disabled: false
                },
                {
                  title: '二月收入',
                  key: '1000122',
                  author: 'ZORRO-FANS',
                  isLeaf: true
                }
              ]
            }
          ]
        }
      ]
    })
  ];

  @HostListener('mouseleave', ['$event'])
  mouseLeave(event: MouseEvent): void {
    event.preventDefault();
    if (this.dragNodeElement && this.dragNodeElement.className.indexOf('is-dragging') > -1) {
      this.dragNodeElement.className = this.dragNodeElement.className.replace(' is-dragging', '');
    }
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(): void {
    // do not prevent
    if (this.dragNodeElement && this.dragNodeElement.className.indexOf('is-dragging') > -1) {
      this.dragNodeElement.className = this.dragNodeElement.className.replace(' is-dragging', '');
    }
  }

  /**
   * important:
   * if u want to custom event/node properties, u need to maintain the selectedNodesList/checkedNodesList yourself
   * @param {} data
   */
  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      // change node's expand status
      if (!data.isExpanded) {
        // close to open
        data.origin.isLoading = true;
        setTimeout(() => {
          data.isExpanded = !data.isExpanded;
          data.origin.isLoading = false;
        }, 500);
      } else {
        data.isExpanded = !data.isExpanded;
      }
    } else {
      // change node's expand status
      if (!data.node.isExpanded) {
        // close to open
        data.node.origin.isLoading = true;
        setTimeout(() => {
          data.node.isExpanded = !data.node.isExpanded;
          data.node.origin.isLoading = false;
        }, 500);
      } else {
        data.node.isExpanded = !data.node.isExpanded;
      }
    }
  }

  // 选中节点
  activeNode(data: NzFormatEmitEvent): void {
    if (this.activedNode) {
      this.activedNode = null;
    }
    data.node.isSelected = true;
    this.activedNode = data.node;
  }

  dragStart(event: NzFormatEmitEvent): void {
    // disallow drag if root or search
    this.activedNode = null;
    this.dragNodeElement = event.event.srcElement;
    if (this.dragNodeElement.className.indexOf('is-dragging') === -1) {
      this.dragNodeElement.className = event.event.srcElement.className + ' is-dragging';
    }
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>, node: NzTreeNode): void {
    this.dropdown = this.nzDropdownService.create($event, template);
  }

  selectDropdown(): void {
    this.dropdown.close();
    // do something
    console.log('dropdown clicked');
  }

  constructor(private nzDropdownService: NzDropdownService, private nzModel: NzModalService) {}

  ngOnInit() {}
}
