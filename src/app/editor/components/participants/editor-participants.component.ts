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

  private getMomentFromNow(timestamp) {
    return Moment(timestamp).fromNow();
  }

  private getParticipantsRecent() {
    return this.participantsRecent.sort((a, b) => {
      return b.session.lastActivityTime - a.session.lastActivityTime;
    });
  }

  private getParticipantsPast() {
    return this.participantsPast.sort((a, b) => {

      if (a.profile.anonymous && b.profile.anonymous) {

        if (a.profile.name == b.profile.name)
          return b.session.lastActivityTime - a.session.lastActivityTime;

       if (a.profile.name != "Anonymous")
        return -1;

        return 1;
      }

      if (a.profile.anonymous) {
        return 1;
      }
      return -1;
    });
  }

  private isNotRegistered(profile) {
    return profile.anonymous && profile.name != "Anonymous";
  }



}
