import { Component, Input } from "@angular/core";

@Component({
  selector: 'jp-editor-header',
  templateUrl: 'editor-header.component.html',
})

export class EditorHeaderComponent {

  //document title
  @Input() title: string;
  @Input() participants: any;


}
