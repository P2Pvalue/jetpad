import { Modal } from '../../../core/services';
import {
    Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

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
              Share link
            </h3>
          </div>

          <div class="modal-body" #modalBody [ngStyle]="{'max-height': modalBodyHeight + 'px'}">
            <div class="form-group">
              <input value="{{getShareLink()}}" class="form-control" 
                type="text" readonly>
            </div>
            <h3>Document permissions</h3>
            <div class="form-group">
                <form>
                    <div class="funkyradio">
                        <div class="funkyradio-primary">
                            <input type="radio" name="radio" id="radio1" />
                            <label for="radio1">Open document</label>
                        </div>
                        <div class="funkyradio-primary">
                            <input type="radio" name="radio" id="radio2" checked/>
                            <label for="radio2">Open, only reads</label>
                        </div>
                        <div class="funkyradio-primary">
                            <input type="radio" name="radio" id="radio3" />
                            <label for="radio3">
                                Private, only participants could write or read</label>
                        </div>
                    </div>
                </form>
            </div>
            <h3>Participants<span (click)="toggleAddParticipant()">
                <i class="material-icons primary-color">add</i></span></h3>
            <div class="form-group" *ngIf="showAddParticipant">  
                <input type="text" class="form-control">
            </div>
            <ul class="list-group">
              <li class="list-group-item">
                
                <span>Pepino</span>
                <select>
                    <option>All</option>
                    <option>Read</option>
                    <option>Write / Read</option>
                </select>
                <button class="btn btn-link btn-danger">
                    <i class="material-icons">delete</i>
                </button>
              </li><li class="list-group-item">
                
                <span>Pepino</span>
                <select>
                    <option>All</option>
                    <option>Read</option>
                    <option>Write / Read</option>
                </select>
                <button class="btn btn-link btn-danger">
                    <i class="material-icons">delete</i>
                </button>
              </li><li class="list-group-item">
                
                <span>Pepino</span>
                <select>
                    <option>All</option>
                    <option>Read</option>
                    <option>Write / Read</option>
                </select>
                <button class="btn btn-link btn-danger">
                    <i class="material-icons">delete</i>
                </button>
              </li><li class="list-group-item">
                
                <span>Pepino</span>
                <select>
                    <option>All</option>
                    <option>Read</option>
                    <option>Write / Read</option>
                </select>
                <button class="btn btn-link btn-danger">
                    <i class="material-icons">delete</i>
                </button>
              </li>
            </ul>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default"  (click)="onOk()">
                Discard</button>
            <button type="button" class="btn btn-success"  (click)="onOk()">
                Save</button>
          </div>
        </div>
      </div>
    </div>
    `,
styles: [`
    .list-group-item {
       display: flex;
       padding: 0;
    }
    .list-group-item button {
        align-self: center;
        padding: 8px 20px;
        margin: 5px;
    }
    .list-group-item select {
        align-self: center;
    }
    .list-group-item span {
        align-self: center;
        flex-grow: 1;
    }
    .btn-link {
        float: right;
    }
    .modal-body{
        overflow-y: scroll;
    }
    .modal-footer {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
    .modal-footer button {
        flex-grow: 1;
    }
    h3 span {
        float: right;
    }
`]
})

@Modal()
export class ShareModalComponent implements AfterViewInit {

    @ViewChild('modalBody') public modalBodyEl: ElementRef;
    public modalBodyHeight: number;

    // data
    public data: any;
    public title: string;

    public ok: Function;

    public destroy: Function;
    public closeModal: Function;

    public showAddParticipant = false;

    // TODO it should detect change orientation in mobile devices
    public ngAfterViewInit() {
        this.modalBodyHeight = Math.min(
            this.modalBodyEl.nativeElement.offsetHeight,
            window.innerHeight - 200);
    }

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

    public toggleAddParticipant() {
        this.showAddParticipant = !this.showAddParticipant;
    }

}
