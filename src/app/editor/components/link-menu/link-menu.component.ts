import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

@Component({
  selector: 'link-menu',
  template: `

      <div class="selection-menu form-group" [style.top.px]="at.y - 40 - 10" [style.left.px]="at.x - 14">

        <div class="input-group">
          <span class="input-group-btn">
            <button type="button" class="btn btn-fab btn-fab-mini">
              <a [href]="link.value" target="_blank"><i class="material-icons">launch</i></a>
            </button>

            <button type="button" class="btn btn-fab btn-fab-mini" (click)="actionEvent.emit('edit')">
              <i class="material-icons">mode_edit</i>
            </button>

            <button type="button" class="btn btn-fab btn-fab-mini" (click)="actionEvent.emit('delete')">
              <i class="material-icons">delete</i>
            </button>
          </span>
        </div>

      </div>
  `,
  styles:[`
    .selection-menu {
      position: absolute;
      z-index: 400;
      margin: 0px 0px;
    }

    .selection-menu i.material-icons {
      font-size: 14pt;
    }

    .selection-menu .input-group-btn {
      width: initial;
    }

    .selection-menu .btn {
      background-color: white;
    }

    .selection-menu .btn:hover {
      background-color: white;
    }

  `]
})

export class LinkMenuComponent implements OnInit {

  @Input() at: any;
  @Input() link: any;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {

  }
}
