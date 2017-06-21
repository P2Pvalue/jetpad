import { Modal } from '../../../core/services';
import { Component, OnInit } from '@angular/core';

declare let window: any;

@Component({
  selector: 'alert-modal',
  template: `
    <div class="modal show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
                aria-hidden="true" (click)="onCancel()">×</button>
            <h3 class="modal-title">
              Warning
            </h3>
          </div>
          <div class="modal-body">
            <p>{{message}}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary"  (click)="onOk()">Close</button>
          </div>
        </div>
      </div>
    </div>
    `,
styles: []
})

@Modal()
export class AlertModalComponent implements OnInit {

    public message: string;
    public ok: Function;

    // ?
    public destroy: Function;
    public closeModal: Function;

    private currentState: string = 'inactive';

    public ngOnInit(): void {
        this.currentState = 'active';
    }

    public onCancel(): void {
        this.onOk();
    }

    public onOk(): void {
        this.currentState = 'inactive';
        setTimeout(() => {
            this.closeModal();
        }, 150);
        this.ok();
    }

}
