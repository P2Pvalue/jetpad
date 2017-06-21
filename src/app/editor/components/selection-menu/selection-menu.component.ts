import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'selection-menu',
  template: `

      <div class="selection-menu form-group" [style.top.px]="at.y - 40 - 10"
        [style.left.px]="at.x - 14">

        <div class="input-group">
          <span class="input-group-btn">
            <button type="button" class="btn btn-fab btn-fab-mini"
                (click)="actionEvent.emit('link')">
              <i class="material-icons">insert_link</i>
            </button>

            <button type="button" class="btn btn-fab btn-fab-mini"
                (click)="actionEvent.emit('bookmark')">
              <i class="material-icons">bookmark</i>
            </button>

            <button type="button" class="btn btn-fab btn-fab-mini"
                (click)="actionEvent.emit('comment')">
              <i class="material-icons">mode_comment</i>
            </button>
          </span>
        </div>

      </div>
  `,
  styles: [`
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

export class SelectionMenuComponent {

  @Input() public at: any;

  @Output() public actionEvent: EventEmitter<any> = new EventEmitter();

}
