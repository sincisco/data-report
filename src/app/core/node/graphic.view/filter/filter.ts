export abstract class FilterNode implements IGraphicView {
  abstract resize();

  abstract init(option: any);

  abstract update(option: any);

  updateTheme(theme: string) {
  }

  refresh() {
  }

  abstract activate();

  deactivate() {
  }

  abstract destroy();
}
