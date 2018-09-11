import {ReportPageRuntime} from '@core/runtime/page/report.page';

export class Runtime {
  private _$element: JQuery;

  constructor(element: HTMLElement) {
    this._$element = $(element);
  }

  loadPage(option) {
    const page = new ReportPageRuntime();
    page.render(option);
    this._$element.append(page.$element);
  }

  loadDocument() {
  }
}
