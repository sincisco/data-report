import {Type} from '@angular/core';


export interface IGraphic {

  init(contentClass: Type<IContent>);

  activate();

  resize();

  update(option: any);
}

