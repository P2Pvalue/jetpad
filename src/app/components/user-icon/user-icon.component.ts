import {Component, Input} from '@angular/core';


@Component({
    selector: 'app-user-icon',
    template: `
      <div class="user-icon">
        <img  *ngIf="user.avatarUrl" src="{{user.avatarUrl}}" alt="{{ user }}" class="img-circle user-avatar" />
        <span *ngIf="!user.avatarUrl" class="not-avatar">{{this.getUserInitials(user)}}</span>
      </div>
    `
  })

export class UserIconComponent {

  @Input() user: any;

  getUserInitials(user) {
    let initials = "";
    let name = user.name ? user.name : user.id.slice(0, user.id.indexOf('@'));
    name.split(" ").forEach(function (word) {
      initials = initials.concat(word.charAt(0))
    });
    return initials.toUpperCase();
  }
}
