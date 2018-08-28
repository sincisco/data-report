
export abstract class Auxiliary implements IGraphicView {
  abstract init(option: any);

  abstract update(option: any);

  updateTheme() {
  }

  refresh() {
  }

  resize() {
  }

  activate() {
  }

  deactivate() {
  }

  abstract destroy();
}
