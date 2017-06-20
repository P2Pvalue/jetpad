import { Component, Input, Output, EventEmitter } from '@angular/core';
import { JetpadModalService } from '../../../core/services';
import { EditorModule } from '../../index';
import { EditorParticipantsModalComponent } from '../participants';
import { EditorOutlineModalComponent } from '../outline'
import { CommentsModalComponent } from '../comments'

@Component({
  selector: 'jp-editor-menu',
  templateUrl: 'editor-menu.component.html'
})


export class EditorMenuComponent {

  // For Contributors Modal
  @Input() participantsRecent: Array<any>;
  @Input() participantsPast: Array<any>;
  @Input() me: any;
  private contributorsModal: any = null;

  // For Outline modal
  @Input() headers: any;
  private outlineModal: any = null;

  // For Comments modal
  private commentsModal: any = null;
  @Input() commentAction: string;
  @Input() comment: any;
  @Input() commentSelection: any;

  @Output() menuActionEvent: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: JetpadModalService) {
  }


  public showContributorsModal() {

    if (this.contributorsModal) {
      this.contributorsModal.destroy();
      this.contributorsModal = undefined;
    }

    let modal$ = this.modalService.create(EditorModule, EditorParticipantsModalComponent, {
      participantsRecent: this.participantsRecent,
      participantsPast: this.participantsPast,
      me: this.me,
      ok: () => {
        this.contributorsModal.destroy();
        this.contributorsModal = undefined;
      }
    });

    modal$.subscribe((modal) => {
        this.contributorsModal = modal;
    });
  }


  public showOutlineModal() {

    if (this.outlineModal) {
      this.outlineModal.destroy();
      this.outlineModal = undefined;
    }

    let modal$ = this.modalService.create(EditorModule, EditorOutlineModalComponent, {
      headers: this.headers,
      ok: () => {
        this.outlineModal.destroy();
        this.outlineModal = undefined;
      }
    });

    modal$.subscribe((modal) => {
        this.outlineModal = modal;
    });
  }


  public showCommentsModal() {

    if (this.commentsModal) {
      this.commentsModal.destroy();
      this.commentsModal = undefined;
    }

    if (this.commentAction == "none" || (!this.comment && !this.commentSelection)) {

    }

    let modal$ = this.modalService.create(EditorModule, CommentsModalComponent, {
      action: this.commentAction,
      me: this.me,
      comment: this.comment,
      selection: this.commentSelection,
      ok: (event) => {

        if (!event || (event && event.type == "close")) {
          this.commentsModal.destroy();
          this.commentsModal = undefined;
        }

        if (event) {
          this.menuActionEvent.emit({
            event: "comment-event",
            data: event
          });
        }
      }
    });

    modal$.subscribe((modal) => {
        this.commentsModal = modal;
    });


  }


  public showShareModal() {
    this.menuActionEvent.emit({
      event: "share"
    });
  }

  public showContributorsPanel() {
    this.menuActionEvent.emit({
      event: "contributors"
    });
  }

  public showCommentsPanel() {
    this.menuActionEvent.emit({
      event: "comments"
    });
  }
}
