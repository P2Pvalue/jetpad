import {Component, Input} from '@angular/core';


@Component({
    selector: 'app-user-icon',
    template: `
      <div class="user-icon" tooltip="{{ this.getUserName(user) }}" tooltipPlacement="bottom">
        <div class="avatar">
          <img  *ngIf="user.avatarUrl" src="{{user.avatarUrl}}" alt="{{ this.getUserName(user) }}" class="img-circle user-avatar"/>
        </div>
        <span *ngIf="!user.avatarUrl" class="not-avatar">{{this.getUserInitials(user)}}</span>
      </div>
    `
  })

export class UserIconComponent {

  @Input() user: any;

  getUserName(user) {
    return user.name ? user.name : user.id.slice(0, user.id.indexOf('@'));
  }

  getUserInitials(user) {
    let initials = "";
    let name = this.getUserName(user);
    name.split(" ").forEach(function (word) {
      initials = initials.concat(word.charAt(0))
    });
    return initials.toUpperCase();
  }
}
