import { Modal } from '../../../core/services';
import { Component, OnInit } from '@angular/core';

declare let window: any;

@Component({
  selector: 'share-modal',
  template: `
    <div class="modal show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
                aria-hidden="true" (click)="onCancel()">×</button>
            <h3 class="modal-title">
              Share
            </h3>
          </div>

          <div class="modal-body">
            <p>Copy and share the link:</p>
            <div class="form-group">
              <input value="{{getShareLink()}}" class="form-control" 
                type="text" readonly>
            </div>
            
            <div class="form-group">
                <form>
                <div class="togglebutton text-center">
                  <label data-placement="top" title="Public document">
                    Public document
                    <input type="checkbox">
                    <span class="toggle"></span>
                  </label>
                </div>
                <div class="togglebutton text-center">
                  <label data-placement="top" title="Public document">
                    Public, only read
                    <input type="checkbox">
                    <span class="toggle"></span>
                  </label>
                </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox"/> Open document
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox"/> Open, only reads
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox"/> 
                            Private, only participants could write or read
                        </label>
                    </div>
                </form>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary"  (click)="onOk()">
                Close</button>
          </div>
        </div>
      </div>
    </div>
    `,
styles: [`

  `]
})

@Modal()
export class ShareModalComponent {

    // data
    public data: any;
    public title: string;

    public ok: Function;

    public destroy: Function;
    public closeModal: Function;

    public  onCancel(): void {
        this.onOk();
    }

    public  onOk(): void {
        setTimeout(() => {
            this.closeModal();
        }, 150);
        this.ok();
    }

    public getShareLink() {
        let url = window.document.location.href;
        let endUrl = url.lastIndexOf('#');
        if (endUrl > -1) {
            url = url.slice(0, url.lastIndexOf('#'));
        }
        return url;
    }

}
