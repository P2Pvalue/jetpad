import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

@Component({
  selector: 'selection-menu',
  template: `

        <div class="selection-menu" [style.top.px]="pos.y" [style.left.px]="pos.x">

            <div class="btn-group" role="group" aria-label="Context toolbar">
              <button type="button" class="btn btn-default">
                <span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span>
              </button>
              <button type="button" class="btn btn-default">
                <span class="glyphicon glyphicon-comment" aria-hidden="true"></span>
              </button>
            </div>

        </div>
  `,
  styles:[`
    .selection-menu {
      position: absolute;
      float: right;
      z-index: 400;
    }
  `]
})

export class SelectionMenuComponent implements OnInit {

  @Input() pos: any;

  @Output() modalEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {

  }
}
