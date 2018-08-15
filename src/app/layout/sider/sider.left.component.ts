import {
  AfterViewInit,
  Component,
  ComponentFactory, ComponentFactoryResolver, ComponentRef,
  KeyValueDiffer, NgZone, Type, ViewChild,
  ViewContainerRef, ViewRef
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DataHeaderComponent} from './graphic.config/html/header.component';
import {GraphicConfig} from './graphic.config/graphic.config';
import {reportGlobal} from '@core/node/region/region';

export var siderLeftComponent: SiderLeftComponent;

@Component({
  selector: 'app-sider-left',
  templateUrl: './sider.left.component.html',
  styleUrls: ['./sider.left.component.less']
})
export class SiderLeftComponent implements AfterViewInit {


  @ViewChild('configContainer', {read: ViewContainerRef}) container: ViewContainerRef;
  @ViewChild('shadowContainer', {read: ViewContainerRef}) shadowContainer: ViewContainerRef;

  @ViewChild(NgForm) ngForm: NgForm;

  private _differ: KeyValueDiffer<any, any>;
  componentRef: any;

  constructor(/*              private appBody: AppBodyComponent,*/
              private resolver: ComponentFactoryResolver,
              private zone: NgZone) {
  }

  createComponent(type: string) {
    this.container.clear();
    const factory: ComponentFactory<DataHeaderComponent> =
      this.resolver.resolveComponentFactory(DataHeaderComponent);
    this.componentRef = this.container.createComponent(factory);
    // this.componentRef.instance.type = type;
    this.componentRef.instance.output.subscribe((msg: string) => {
      console.log('我是', msg);
      if (reportGlobal.instance) {
        reportGlobal.instance.update(msg);
      }
    });
  }

  createGraphicConfig(type: Type<GraphicConfig>): ComponentRef<GraphicConfig> {
    let retComponentRef: ComponentRef<GraphicConfig>;
    this.zone.run(() => {
      this.container.detach();
      this.container.clear();
      const factory: ComponentFactory<GraphicConfig> =
        this.resolver.resolveComponentFactory(type);
      retComponentRef = this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.type = type;
      // this.componentRef.instance.output.subscribe((msg: string) => {
      //   console.log('我是', msg);
      //   if (reportGlobal.instance) {
      //     reportGlobal.instance.update(msg);
      //   }
      // });
    });
    return retComponentRef;
  }

  forwardCreateGraphicConfig(type: Type<GraphicConfig>): ComponentRef<GraphicConfig> {
    let retComponentRef: ComponentRef<GraphicConfig>;
    this.zone.run(() => {
      this.shadowContainer.detach();
      this.shadowContainer.clear();
      const factory: ComponentFactory<GraphicConfig> =
        this.resolver.resolveComponentFactory(type);
      retComponentRef = this.componentRef = this.shadowContainer.createComponent(factory);
      this.componentRef.instance.type = type;
      this.shadowContainer.detach();
      // this.componentRef.instance.output.subscribe((msg: string) => {
      //   console.log('我是', msg);
      //   if (reportGlobal.instance) {
      //     reportGlobal.instance.update(msg);
      //   }
      // });
    });
    return retComponentRef;
  }

  attachDataProperty(viewRef: ViewRef) {
    this.zone.run(() => {
      this.container.detach();
      this.container.clear();
      this.container.insert(viewRef);
    });
  }


  ngAfterViewInit() {
    siderLeftComponent = this;

    var card = document.querySelector('.card');
    card.addEventListener( 'click', function() {
      card.classList.toggle('is-flipped');
    });
  }

}
