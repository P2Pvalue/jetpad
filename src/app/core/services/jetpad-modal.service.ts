import { Component, ViewChild, OnInit, ViewContainerRef,
  Injector, Compiler, ComponentRef, ReflectiveInjector, Injectable, HostListener,trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs/Rx"

@Injectable()
export class JetpadModalService {
  private parentElement: any;
  // here we hold our placeholder
  private vcRef: ViewContainerRef;
  private vmRef: ViewContainerRef;
  // here we hold our injector
  private injector: Injector;
  // we can use this to determine z-index of multiple modals
  public activeInstances: number = 0;

  constructor(private compiler: Compiler) {
  }

  registerViewContainerRef(vcRef: ViewContainerRef): void {
    this.vcRef = vcRef;
  }

  registerInjector(injector: Injector): void {
    this.injector = injector;
  }

  registerParentElement(componentElement: any): void {
    this.parentElement = componentElement;
  }

  registerModalElement(vmRef: ViewContainerRef): void {
    this.vmRef = vmRef;
  }

  create<T>(module: any, component: any, parameters?: Object): Observable<ComponentRef<T>> {
    let componentRef$ = new ReplaySubject();
    this.compiler.compileModuleAndAllComponentsAsync(module)
      .then(factory => {
        let componentFactory = factory.componentFactories.filter(item => item.componentType === component)[0];
        const childInjector = ReflectiveInjector.resolveAndCreate([], this.injector);
        let componentRef = this.vmRef.createComponent(componentFactory, 0, childInjector);
        Object.assign(componentRef.instance, parameters); // pass the @Input parameters to the instance
        this.activeInstances ++;
        this.parentElement.activated = true;
        this.parentElement.currentState = 'active';
        this.parentElement.display = 'block';
        document.body.className += " jetpad-modal-open";
        componentRef.instance["componentIndex"] = this.activeInstances;
        componentRef.instance["parentHeight"] = this.parentElement.viewContainerRef._element.nativeElement.offsetTop;
        //TODO check delete logic when more than one modal is available
        componentRef.instance["destroy"] = () => {
          this.activeInstances --;
          if (this.activeInstances <= 1) {
            document.body.className = document.body.className.replace(/jetpad-modal-open\b/, "");
          }
          this.parentElement.activated = false;
          this.parentElement.currentState = 'inactive';
          setTimeout(() => {
            this.parentElement.display = 'none';
            componentRef.destroy();
          }, 200);
        };
        componentRef$.next(componentRef);
        componentRef$.complete();
      });
    return <Observable<ComponentRef<T>>> componentRef$.asObservable();
  }
}


// These 2 items will make sure that you can annotate a modalcomponent with @Modal()
export class ModalContainer {
  destroy: Function;
  componentIndex: number;
  closeModal(): void {
    this.destroy();
  }
}
export function Modal() {
  return function (target) {
    Object.assign(target.prototype,  ModalContainer.prototype);
  };
}

//Placeholder which allows render modals
@Component({
  selector: "jetpad-modal-placeholder",
  template: `
    <div #modalplaceholder
         class="jetpad-modal-placeholder"
         [ngClass]="{'jetpad-modal-backdrop-activate':activated}">
         <div class="jetpad-modal" tabindex="-1" [ngStyle]="{'display':display}" [@modalState]="currentState"><template #modal></template></div>
    </div>
    `,
  styles:[`
    .jetpad-modal-placeholder{
      height: 100%;
    }
    .jetpad-modal-backdrop-activate{
      height: 100%;
      width: 100%;
      z-index: 1000;
      top: 0;
      position: fixed;
      background: rgba(0, 0, 0, 0.4);
    }
    .jetpad-modal-open{
      overflow: hidden;
    }
    .jetpad-modal-open{
      overflow: hidden;
    }
    .jetpad-modal{
      background-color: white;
    }
    @media only screen and (min-width: 250px) {
      .jetpad-modal{
        width: 100%;
        left: 0;
        top: 200%;
        height: 100%;
      }
    }
    @media only screen and (min-width: 600px) {
      .jetpad-modal{
        width: 80%;
        left: 10%;
        top: 120%;
        height: 50%;
        border-radius: 5px;
      }
    }
    @media only screen and (min-width : 1200px) {
      .jetpad-modal{
        width: 70%;
        left: 15%;
        top: 120%;
        height: 50%;
        border-radius: 5px;
      }
    }
    .jetpad-modal{
      position: absolute;      
      z-index: 1001;
    }
  `],
  animations: [
    trigger('modalState',[
      state('inactive', style({
        transform: 'translateY(0)'
      })),
      state('active',   style({
        transform: 'translateY(-200%)'
      })),
      transition('inactive => active', animate('400ms ease-in')),
      transition('active => inactive', animate('400ms ease-out'))
    ])]
})
export class ModalPlaceholderComponent implements OnInit {
  @ViewChild("modalplaceholder", {read: ViewContainerRef}) viewContainerRef;
  @ViewChild("modal", {read: ViewContainerRef}) viewModalRef;
  viewHeight: number;
  viewWidth: number;
  activated: boolean = false;
  currentState: string = 'inactive';
  display: string = 'none';
  @HostListener('window:resize', ['$event'])
  sizeWindow(event) {
    this.viewHeight = event.target.innerHeight;
    this.viewWidth = event.target.innerWidth;
  }

  constructor(
    private modalService: JetpadModalService,
    private injector: Injector) {
  }

  ngOnInit(): void {
    this.modalService.registerViewContainerRef(this.viewContainerRef);
    this.modalService.registerModalElement(this.viewModalRef);
    this.modalService.registerInjector(this.injector);
    this.modalService.registerParentElement(this);
  }

}
