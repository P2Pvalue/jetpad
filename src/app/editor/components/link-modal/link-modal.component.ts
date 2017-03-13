import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

@Component({
  selector: 'link-modal',
  template: `


          <div class="link-modal modal-dialog modal-dialog-sm" [style.top.px]="at.y - 155">
            <div class="modal-content">

              <div class="modal-body">
                <div class="form-group">
                  <label for="name" class="control-label">Text</label>
                  <input type="text" [(ngModel)]="link.text" class="form-control" id="text" required>
                </div>
                <div class="form-group">
                  <label for="linkurl" class="control-label">URL</label>
                  <input type="url" [(ngModel)]="link.url" class="form-control" id="linkurl">
                </div>
              </div>

              <div class="modal-footer">
                <button (click)="doCancel()"  type="button" class="btn btn-default">Cancel</button>
                <button (click)="doOk()" type="button" class="btn btn-primary">Ok</button>
              </div>
            </div><!-- /.modal-content -->
          </div><!-- /.modal-dialog -->

  `,
  styles:[`
    .link-modal {
      width: 330px;
      position: absolute;
      z-index: 400;
      left: calc( (100vw / 2) - 170px );
    }
  `]
})

export class LinkModalComponent implements OnInit {

  @Input() link: any;
  @Input() visible: boolean;

  @Input() at: any;

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
