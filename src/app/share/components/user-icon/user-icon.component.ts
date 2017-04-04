import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-user-icon',
    template: `
      <div class="user-icon" tooltip="{{participantSession.profile.name}}" placement="bottom">
        <div class="avatar">
          <img  *ngIf="image()" src="{{image()}}" alt="{{getName()}}" class="img-circle user-avatar"/>
        </div>
        <span *ngIf="!image()" class="not-avatar" [ngStyle]="{ 'background-color' : participantSession.profile.color.cssColor }">{{this.getInitial()}}</span>
        <span *ngIf="participantSession.session.online" [ngStyle]="{ 'background-color' : participantSession.profile.color.cssColor }" class="online-mark"></span>
      </div>
    `
  })

export class UserIconComponent {

  @Input() participantSession: any;

  private image() {
    if (this.participantSession.profile.anonymous && this.participantSession.profile.name == "Anonymous") {
      return "assets/img/anonymous.png";
    } else if (this.participantSession.profile.imageUrl) {
      return this.participantSession.profile.imageUrl;
    }

    return false;
  }

  private getName() {
    if (this.participantSession.profile.anonymous && this.participantSession.profile.name != "Anonymous") {
      return this.participantSession.profile.name + " (Not registered)";
    }

    return this.participantSession.profile.name;
  }

  private getInitial() {
    let initials = "";
    let name = this.participantSession.profile.name;
    name.split(" ").forEach(function (word) {
      initials = initials.concat(word.charAt(0))
    });
    return initials.toUpperCase();
  }
}
