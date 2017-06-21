import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'jp-editor-header',
  templateUrl: 'editor-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditorHeaderComponent {

  @Input() public status: string = 'DISCONNECTED';

  @Input() public title: string;

  @Input() public participants: any;
  @Input() public participantsPast: any;
  @Input() public me: any;

  @Input() public headers: any;

  @Input() public commentAction: string;
  @Input() public comment: any;
  @Input() public commentSelection: any;

  @Input() public newTitle: any;

  @Output() public menuActionEvent: EventEmitter<any> = new EventEmitter();
  @Output() public changeTitle: EventEmitter<any> = new EventEmitter();

  public editing = false;

  private titleChange = '';

  public toggleTitle() {
    this.editing = !this.editing;
  }

  public updateTitle(title) {
      this.titleChange = title.value;
      title.style.width = ((title.value.length) * 8) + 'px';
  }

  public changeTitleClick() {
      if (this.titleChange && this.titleChange.length > 0) {
          this.changeTitle.emit(this.titleChange);
          this.toggleTitle();
      }
  }
}
