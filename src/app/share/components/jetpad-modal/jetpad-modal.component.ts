import { Component, Input, Output, EventEmitter, ViewChild, ElementRef,trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';

@Component({
  selector: "jetpad-modal-header",
  template: `<ng-content></ng-content>`
})
export class JetpadModalHeader {

}

@Component({
  selector: "jetpad-modal-content",
  template: `<ng-content></ng-content>`
})
export class JetpadModalContent {

}

@Component({
  selector: "jetpad-modal-footer",
  template: `<ng-content></ng-content>`
})
export class JetpadModalFooter {

}

@Component({
  selector: 'jetpad-modal',
  templateUrl: 'jetpad-modal.component.html',
  animations: [
    trigger('modalState',[
      state('inactive', style({
        //backgroundColor: '#eee',
        //transform: 'scale(1)'
        transform: 'translateY(100%)'
      })),
      state('active',   style({
        //backgroundColor: '#cfd8dc',
        //transform: 'scale(1.1)'
        transform: 'translateY(3in)'
      })),
      transition('* => *', animate('.5s'))
      /*transition('inactive => active',
        [animate(600 ,style({transform: 'translateY(3in) scale(0)'}))]),
      transition('active => inactive',[
        style({transform: 'translateY(0) scale(0)'}),
        animate(200)])*/
    ])
  ]
})

export class JetpadModalComponent {
  // -------------------------------------------------------------------------
  // Inputs
  // -------------------------------------------------------------------------
  @Input()
  public hideCloseButton = false;

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  @Output()
  public onOpen = new EventEmitter(false);

  @Output()
  public onClose = new EventEmitter(false);

  @Output()
  public onSubmit = new EventEmitter(false);

  // -------------------------------------------------------------------------
  // Public properties
  // -------------------------------------------------------------------------

  public isOpened = false;

  @ViewChild("jetpadModalRoot")
  public jetpadModalRoot: ElementRef;

  // -------------------------------------------------------------------------
  // Private properties
  // -------------------------------------------------------------------------

  private backdropElement: HTMLElement;
  private currentState: string = 'inactive';

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor() {
    this.createBackDrop();
  }

  private createBackDrop() {
    this.backdropElement = document.createElement("div");
    this.backdropElement.classList.add("jetpad-modal-backdrop");
    this.backdropElement.classList.add("fade");
    this.backdropElement.classList.add("in");
  }

  // -------------------------------------------------------------------------
  // Lifecycle Methods
  // -------------------------------------------------------------------------

  ngOnDestroy() {
    document.body.className = document.body.className.replace(/jetpad-modal-open\b/, "");
    if (this.backdropElement && this.backdropElement.parentNode === document.body)
      document.body.removeChild(this.backdropElement);
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  open(...args: any[]) {
    if (this.isOpened)
      return;

    this.isOpened = true;
    this.currentState = 'active';
    this.onOpen.emit(args);
    document.body.appendChild(this.backdropElement);
    window.setTimeout(() => this.jetpadModalRoot.nativeElement.focus(), 0);
    document.body.className += " jetpad-modal-open";
  }

  close(...args: any[]) {
    if (!this.isOpened)
      return;

    this.isOpened = false;
    this.currentState = 'inactive';
    this.onClose.emit(args);
    document.body.removeChild(this.backdropElement);
    document.body.className = document.body.className.replace(/jetpad-modal-open\b/, "");
  }

  public preventClosing(event: MouseEvent) {
    event.stopPropagation();
  }
}
