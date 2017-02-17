import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

@Component({
  selector: 'link-modal',
  template: `


          <div class="link-modal modal-dialog" [style.top.px]="pos.y" [style.left.px]="pos.x">
            <div class="modal-content">
              <div class="modal-header">
                <button (click)="doCancel()" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Link properties</h4>
              </div>

              <div class="modal-body">
                <div class="form-group form-group-sm">
                  <label for="name" class="control-label">Text</label>
                  <input type="text" [(ngModel)]="link.text" class="form-control" id="text" required>
                </div>
                <div class="form-group form-group-sm">
                  <label for="linkurl" class="control-label">Link URL</label>
                  <input type="url" [(ngModel)]="link.url" class="form-control" id="linkurl">
                </div>
              </div>

              <div class="modal-footer">
                <button (click)="doCancel()"  type="button" class="btn btn-default">Close</button>
                <button (click)="doOk()" type="button" class="btn btn-primary">Save</button>
              </div>
            </div><!-- /.modal-content -->
          </div><!-- /.modal-dialog -->

  `,
  styles:[`
    .link-modal {
      position: absolute;
      float: right;
      z-index: 400;
    }
  `]
})

export class LinkModalComponent implements OnInit {

  @Input() link: any;
  @Input() visible: boolean;

  @Input() pos: any;

  @Output() modalEvent: EventEmitter<any> = new EventEmitter();

  text: string;
  url: string;

  ngOnInit() {
  }

  doOk() {
    this.modalEvent.emit(this.link);
  }

  doCancel() {
    this.modalEvent.emit();
  }

}
