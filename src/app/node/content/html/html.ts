export abstract class HtmlNode implements IContent {
  abstract resize();

  abstract init(option: any);

  abstract update(option: any);

  abstract activate();

  destroy() {
  }

  getOption() {

  }
}
