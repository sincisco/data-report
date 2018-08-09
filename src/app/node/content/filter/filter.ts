export abstract class FilterNode implements IContent {
  abstract resize();

  abstract init(option: any);

  abstract update(option: any);

  abstract activate();

  abstract destroy();

  abstract getOption();
}
