import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators }  from '@angular/forms';
import * as TitleUtils from '../../../share/components/title-utils';

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

  @Output() public menuActionEvent: EventEmitter<any> = new EventEmitter();
  @Output() public titleChangedEvent: EventEmitter<any> = new EventEmitter();

  public titleFC: FormControl
    = new FormControl('',
    [Validators.required, Validators.minLength(4), TitleUtils.titleValidator]);

  public titleEdit: boolean = false;

  public startTitleEdit() {
    this.titleEdit = true;
    this.titleFC.setValue(this.title);
  }

  public saveTitleEdit() {
    if (!this.titleFC.invalid) {
        this.titleEdit = false;
        this.titleChangedEvent.emit(this.titleFC.value);
    }
  }

  public cancelTitleEdit() {
    this.titleEdit = false;
  }

}
