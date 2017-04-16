import { Modal } from '../../../core/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: "outline-modal",
  template: `
    <div class="modal show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" (click)="onCancel()">×</button>
            <h3 class="modal-title">
              Outline
            </h3>
          </div>

          <div class="modal-body scrollable-body">
            <jp-editor-outline
              [showInDialog]="true"
              [headers]="headers">
            </jp-editor-outline>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary"  (click)="onOk()">Close</button>
          </div>
        </div>
      </div>
    </div>
    `,
styles:[`

    .modal-content {
      height: inherit;
    }

    .scrollable-body {
      overflow-y: auto;
      max-height: 75vh;
      margin-bottom: 15px;
    }

  `]
})

@Modal()
export class EditorOutlineModalComponent implements OnInit {

  // data
  headers: any;

  ok: Function;

  destroy: Function;
  closeModal: Function;

  ngOnInit(): void {

  }

  onCancel(): void {
    this.onOk();
  }

  onOk(): void{
    setTimeout(() => {
      this.closeModal();
    }, 150);
    this.ok();
  }

}
