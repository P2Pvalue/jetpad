import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';

import { JetpadModalService, Modal } from '../../../core/services';
import { ShareModule } from '../../index';

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
  template: `
    <div class="jetpad-modal" [@modalState]="currentState"
     #jetpadModalRoot
     tabindex="-1"
     role="dialog"
     (keydown.esc)="closeOnEscape ? close() : 0"
     [ngClass]="{ in: isOpened, fade: isOpened }"
     [ngStyle]="{ display: isOpened ? 'block' : 'none' }">

        <div [class]="'jetpad-modal-dialog ' + modalClass" (click)="preventClosing($event)">
          <div class="jetpad-modal-content" tabindex="0" *ngIf="isOpened">
            <div class="jetpad-modal-header">
              <button type="button" class="close" [attr.aria-label]="cancelButtonLabel || 'Close'" (click)="close()"><span aria-hidden="true">&times;</span></button>
              <h4 class="jetpad-modal-title" *ngIf="title">{{ title }}</h4>
              <ng-content select="jetpad-modal-header"></ng-content>
            </div>
            <div class="jetpad-modal-body">
              <ng-content select="jetpad-modal-content"></ng-content>
            </div>
            <div class="jetpad-modal-footer">
              <ng-content select="jetpad-modal-footer"></ng-content>
              <!--<button *ngIf="cancelButtonLabel" type="button" class="btn btn-default" data-dismiss="modal" (click)="close()">{{ cancelButtonLabel }}</button>
              <button *ngIf="submitButtonLabel" type="button" class="btn btn-primary" (click)="onSubmit.emit(undefined)">{{ submitButtonLabel }}</button>-->
            </div>
          </div>
        </div>
    </div>
  `,
  animations: [
    trigger('modalState',[
      state('inactive', style({
        transform: 'translateY(0)'
      })),
      state('active',   style({
        transform: 'translateY(-200%)'
      })),
      transition('* => *', animate('.2s'))
    ])]
})

@Modal()
export class JetpadModalComponent implements OnInit {

  constructor(private modalService: JetpadModalService) {

  }

  ok: Function;
  destroy: Function;
  closeModal: Function;
  parentHeight: number;
  data: any;

  private currentState: string = 'inactive';

  ngOnInit(): void {
    this.currentState = 'active';
  }

  onCancel(): void{
    this.currentState = 'inactive';
    console.log(this.parentHeight);
    setTimeout(() => {
      this.closeModal();
    }, 150);
  }

  onOk(): void{
    this.currentState = 'inactive';
    setTimeout(() => {
      this.closeModal();
    }, 150);
    this.ok(this.data);
  }

  open(...args: any[]){
    let modal$ = this.modalService.create(ShareModule, JetpadModalComponent, args);
    modal$.subscribe((ref) => {
      setTimeout(() => {
        // close the modal after 5 seconds
        //ref.destroy();
      }, 5000)
    })
  }

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

  /*public isOpened = false;*/

  /*@ViewChild("jetpadModalRoot")
  public jetpadModalRoot: ElementRef;*/

  // -------------------------------------------------------------------------
  // Private properties
  // -------------------------------------------------------------------------

  /*private backdropElement: HTMLElement;
  private currentState: string = 'inactive';*/

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  /*constructor() {
    this.createBackDrop();
  }

  private createBackDrop() {
    this.backdropElement = document.createElement("div");
    this.backdropElement.classList.add("jetpad-modal-backdrop");
    this.backdropElement.classList.add("fade");
    this.backdropElement.classList.add("in");
  }*/

  // -------------------------------------------------------------------------
  // Lifecycle Methods
  // -------------------------------------------------------------------------

  /*ngOnDestroy() {
    document.body.className = document.body.className.replace(/jetpad-modal-open\b/, "");
    if (this.backdropElement && this.backdropElement.parentNode === document.body)
      document.body.removeChild(this.backdropElement);
  }*/

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /*open(...args: any[]) {
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
  }*/
}
