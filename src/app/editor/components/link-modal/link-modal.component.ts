import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

@Component({
  selector: 'link-modal',
  template: `

        <div class="link-modal" [style.top.px]="pos.x">

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
      z-index: 100;

      width: 65%;
      margin-left: 18%;

      max-width: 450px;

      background-color: linen;
      padding: 0.8em;


      font-size: 9pt;
      font-weight: normal;
      font-style: normal;
      font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;

      border-radius: 7px;

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
    this.pos.x = 100;
    this.pos.y = 100;
  }

  doOk() {
    this.modalEvent.emit(this.link);
  }

  doCancel() {
    this.modalEvent.emit();
  }

}
