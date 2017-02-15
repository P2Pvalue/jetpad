import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

@Component({
  selector: 'link-modal',
  template: `

        <div class="link-modal" [style.top.px]="pos.y" [style.left.px]="pos.x">

            <div class="form-group">
              <label for="name" class="control-label">Text</label>
              <input type="text" [(ngModel)]="link.text" class="form-control" id="text" required>
            </div>

            <div class="form-group">
              <label for="linkurl" class="control-label">Link URL</label>
              <input type="url" [(ngModel)]="link.url" class="form-control" id="linkurl">
            </div>

            <div class="form-group" style="float:right">
                <button type="button" class="btn" (click)="doCancel()">Cancel</button>
                <button type="button" class="btn" (click)="doOk()">Ok</button>
            </div>

        </div>
  `,
  styles:[`
    .link-modal {

      position: absolute;
      float: right;
      background-color: linen;
      font-size: 8pt;
      z-index: 400;
      padding: 10px;

      border-radius: 5px;

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
