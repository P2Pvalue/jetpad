import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";

@Component({
  selector: 'editor-assessment',
  template: `
        <div class="tooltip-editor" [hidden]="hidden" [style.top.px]="posY">
            <button class="action-button btn btn-success" (click)="vote(true)"><span class="action-icon glyphicon glyphicon-ok"></span></button>
            <button class="action-button btn btn-danger" (click)="vote(false)"><span class="action-icon glyphicon glyphicon-remove"></span></button>
        </div>
  `,
  styles:[`
    .tooltip-editor {
      float: right;
      position: absolute;
      background-color: rgba(255,255,255,0.5);
      color: white;
      margin-top: -20px;
      margin-left: -2px;
      font-size: 9pt;
      font-weight: normal;
      font-style: normal;
      font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
      z-index: 400;
      padding: 20px;
    }
  `]
})

export class InlineAssessment implements OnInit {

  @Input() posY: number;
  @Input() hidden: boolean;
  @Output() onVoted = new EventEmitter<boolean>();
  voted = false;

  ngOnInit() {
    this.hidden = false;
  }

  vote(agreed: boolean) {
    console.log("Emitiendo voto... ");
    this.onVoted.emit(agreed);
    this.voted = true;
  }

}