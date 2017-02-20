import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

@Component({
  selector: 'link-menu',
  template: `

      <div class="selection-menu form-group" [style.top.px]="at.y - 40 - 10" [style.left.px]="at.x">

        <div class="input-group">
          <span class="input-group-btn">
            <button type="button" class="btn btn-fab btn-fab-mini">
              <i class="material-icons">launch</i>
            </button>

            <button type="button" class="btn btn-fab btn-fab-mini">
              <i class="material-icons">mode_edit</i>
            </button>

            <button type="button" class="btn btn-fab btn-fab-mini">
              <i class="material-icons">delete</i>
            </button>
          </span>
        </div>

      </div>
  `,
  styles:[`
    .selection-menu {
      position: fixed;
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

  @Output() modalEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {

  }
}
