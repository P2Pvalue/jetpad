import { Component, Input } from "@angular/core";
import * as Moment from "moment";

declare let window: any;

@Component({
    selector: 'jp-editor-participants',
    templateUrl: './editor-participants.component.html'
})

export class EditorParticipantsComponent {

  @Input() participantsRecent: Array<any>;
  @Input() participantsPast: Array<any>;

  @Input() me: any;

  private name: string;
  private showEditNameForm: boolean = false;
  private showParticipantsPastList: boolean = false;



  private saveEditNameForm() {
    this.showEditNameForm = false;

    if (!this.name) {
      if (!this.me.profile.name)
        this.me.profile.setName("Anonymous");

    } else
      this.me.profile.setName(this.name);
  }

  private displayEditNameForm(display) {
    if (display)
      this.name = this.me.profile.name;
    this.showEditNameForm = display;
  }

  private isNotRegistered(profile) {
    return profile.anonymous && profile.name != "Anonymous";
  }

  private toggleParticipantPastList() {
    this.showParticipantsPastList = !this.showParticipantsPastList;
  }


}
