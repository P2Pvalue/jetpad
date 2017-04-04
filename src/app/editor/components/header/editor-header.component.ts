import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'jp-editor-header',
  templateUrl: 'editor-header.component.html',
})

export class EditorHeaderComponent {

  @Input() status: string;

  @Input() title: string;

  @Input() participants: any;
  @Input() participantsPast: any;
  @Input() me: any;

  @Input() headers: any;

  @Output() menuActionEvent: EventEmitter<any> = new EventEmitter();
}
