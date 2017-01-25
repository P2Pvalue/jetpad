import {Component, Input} from "@angular/core";

@Component({
    selector: 'jp-editor-outline',
    templateUrl: './editor-outline.component.html',
    styles: [`
      .outline-h2 {
        margin-left: 15px
      }
      .outline-h3 {
        margin-left: 30px
      }
      .outline-h4 {
        margin-left: 45px
      }
      .outline-h5 {
        margin-left: 60px
      }
      .outline-h6 {
        margin-left: 75px
      }
    `],
})

export class EditorOutlineComponent {
    @Input() outline: Array<any>;
    documentLink(hash) {
      let link:string = window.location.origin + window.location.pathname;
      return link + (hash ? '#' + hash : '');
    }
}
