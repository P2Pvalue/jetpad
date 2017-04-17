import { Component, Input } from "@angular/core";

declare let window: any;

@Component({
    selector: 'jp-editor-outline',
    templateUrl: './editor-outline.component.html'
})

export class EditorOutlineComponent {

  @Input() headers: Array<any>;
  @Input() showInDialog: boolean = false;

  getHeaderUrl(id: string) {
    let link:string = window.location.origin + window.location.pathname;
    return link + (id ? '#' + id : '');
  }

}
