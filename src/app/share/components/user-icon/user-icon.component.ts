import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-user-icon',
    template: `
      <div class="user-icon" tooltip="{{user.profile.name}}" placement="bottom">
        <div class="avatar">
          <img  *ngIf="image()" src="{{image()}}" alt="{{user.profile.name}}" class="img-circle user-avatar"/>
        </div>
        <span *ngIf="!image()" class="not-avatar" [ngStyle]="{ 'background-color' : user.session.color.cssColor }">{{this.getInitial()}}</span>
        <span *ngIf="user.session.online" [ngStyle]="{ 'background-color' : user.session.color.cssColor }" class="online-mark"></span>
      </div>
    `
  })

export class UserIconComponent {

  @Input() user: any;

  private image() {
    if (this.user.profile.shortName.charAt(0) == '_') {
      return "assets/img/anonymous.png";
    } else if (this.user.profile.imageUrl) {
      return this.user.profile.imageUrl;
    }

    return false;
  }

  private getInitial() {
    let initials = "";
    let name = this.user.profile.name;
    name.split(" ").forEach(function (word) {
      initials = initials.concat(word.charAt(0))
    });
    return initials.toUpperCase();
  }
}
