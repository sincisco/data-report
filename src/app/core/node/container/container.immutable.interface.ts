import {Container} from '@core/node/container/container.interface';
import {FaceWrapper} from '@core/node/face/face.wrapper';

export abstract class ContainerImmutable extends Container {
  protected _map: Map<string, FaceWrapper> = new Map();

  protected constructor(template: string) {
    super(template);
  }
}

