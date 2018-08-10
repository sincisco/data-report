import {Type} from '@angular/core';


export interface IGraphic {
  $element: JQuery;

  init(contentClass: Type<IContent>);

  activate();

  resize();

  update(option: any);

  destroy();
}

