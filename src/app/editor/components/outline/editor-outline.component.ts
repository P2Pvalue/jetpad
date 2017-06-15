import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

declare let window: any;

@Component({
    selector: 'jp-editor-outline',
    templateUrl: './editor-outline.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditorOutlineComponent {

  @Input() public headers: any[];
  @Input() public showInDialog: boolean = false;

  public getHeaderUrl(id: string) {
    let link: string = window.location.origin + window.location.pathname;
    return link + (id ? '#' + id : '');
  }

}
