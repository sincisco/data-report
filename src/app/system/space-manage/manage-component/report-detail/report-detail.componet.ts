import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.html',
  styleUrls: ['./report-detail.less']
})
export class ReportDetailComponent implements OnInit {

report = {
    reportId: '',
    reportName: '',
  };



  constructor(private acRouter: ActivatedRoute) {

  }

  ngOnInit() {
    this.getParmas();
  }

  getParmas() {
    this.acRouter.queryParams.subscribe(value => {
      this.report.reportId = value.reportId;
      this.report.reportName = value.reportName;
      console.log(this.report);
    });
  }
}
