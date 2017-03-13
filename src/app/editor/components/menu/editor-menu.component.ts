import { Component, Input } from '@angular/core';
import { JetpadModalService } from '../../../core/services';
import { EditorModule } from '../../index';
import { EditorParticipantsModalComponent } from '../participants'

@Component({
  selector: 'jp-editor-menu',
  templateUrl: 'editor-menu.component.html'
})


export class EditorMenuComponent {

  // For Contributors Modal
  @Input() participantsRecent: Array<any>;
  @Input() participantsPast: Array<any>;
  @Input() me: any;

  constructor(private modalService: JetpadModalService) {
  }

  private contributorsModal: any = null;


  public showContributorsModal() {
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


}
