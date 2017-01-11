import {Component, Input} from "@angular/core";

@Component({
    selector: 'jp-editor-outline',
    template: `
    <div class="panel" >
      <div class="panel-body">
        <ul>
          <li *ngFor="let heading of outline" class="outline-{{heading.value}}"><a [href]="documentLink(heading.id)">{{heading.text}}</a></li>
        </ul>
      </div>
    </div>
    `,
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

export class EditorOutline {
    @Input() outline: Array<any>;
    documentLink(hash) {
      let link:string = window.location.origin + window.location.pathname;
      return link + (hash ? '#' + hash : '');
    }
}
