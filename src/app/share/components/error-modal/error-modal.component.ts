import { Modal } from '../../../core/services';
import { Component, OnInit } from '@angular/core';

declare let window: any;

@Component({
  selector: "severe-error-modal",
  template: `
    <div class="modal show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <!--
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" (click)="onCancel()">×</button>
            -->
            <h3 class="modal-title">Something is wrong here...</h3>
          </div>
          <div class="modal-body">
            <p *ngIf="message"><em>{{message}}</em></p>
            <p>The error prevents JetPad from working. Please reload the page!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" (click)="onCancel()">Cancel</button>
            <button type="button" class="btn btn-primary"  (click)="onOk()">Reload</button>
          </div>
        </div>
      </div>
    </div>
    `,
styles:[]
})

@Modal()
export class ErrorModalComponent implements OnInit {

  private currentState: string = 'inactive';
  message: string;
  ok: Function;

  // ?
  destroy: Function;
  closeModal: Function;

  ngOnInit(): void {
    this.currentState = 'active';
  }

  onCancel(): void {
    this.currentState = 'inactive';
    setTimeout(() => {
      this.closeModal();
    }, 150);
    this.ok();
  }

  onOk(): void{
    this.currentState = 'inactive';
    window.location.reload();
  }

}
