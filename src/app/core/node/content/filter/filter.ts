export abstract class FilterNode implements IContent {
  abstract resize();

  abstract init(option: any);

  abstract update(option: any);

  refresh() {
  }

  abstract activate();

  abstract destroy();

  abstract getOption();
}
