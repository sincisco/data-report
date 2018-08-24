export abstract class FilterNode implements IContent {
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

  abstract getOption();
}
