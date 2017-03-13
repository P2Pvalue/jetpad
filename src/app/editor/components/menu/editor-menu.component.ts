import { Component, Input } from '@angular/core';
import { JetpadModalService } from '../../../core/services';
import { EditorModule } from '../../index';
import { EditorParticipantsModalComponent } from '../participants';
import { EditorOutlineModalComponent } from '../outline'

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

  constructor(private modalService: JetpadModalService) {
  }


  public showContributorsModal() {

    if (this.contributorsModal) {
      this.contributorsModal.destroy();
      this.contributorsModal = null;
    }

    let modal$ = this.modalService.create(EditorModule, EditorParticipantsModalComponent, {
      participantsRecent: this.participantsRecent,
      participantsPast: this.participantsPast,
      me: this.me,
      ok: () => {
      }
    });

    modal$.subscribe((modal) => {
      setTimeout(() => {
        this.contributorsModal = modal;
          // close the modal after 5 seconds
          //modal.destroy();
      }, 5000)
    });
  }


  public showOutlineModal() {

    if (this.outlineModal) {
      this.outlineModal.destroy();
      this.outlineModal = null;
    }

    let modal$ = this.modalService.create(EditorModule, EditorOutlineModalComponent, {
      headers: this.headers,
      ok: () => {
      }
    });

    modal$.subscribe((modal) => {
      setTimeout(() => {
        this.outlineModal = modal;
          // close the modal after 5 seconds
          //modal.destroy();
      }, 5000)
    });
  }

}
