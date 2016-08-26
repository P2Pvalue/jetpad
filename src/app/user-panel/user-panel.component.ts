import { Component } from '@angular/core';
import { User } from '../shared';
import { UserService } from "../services";


@Component({
    selector: 'app-user-panel',
    template: `
        <div>
          <!-- Logged In user -->
          <div class="media" *ngIf="loggedUser && !loggedUser.anonymous">
            <div class="media-left media-middle">
              <a>
                <img class="media-object img-circle" height="40" src="{{loggedUser.avatarUrl}}" alt="">
              </a>
            </div>
            <div class="media-right media-middle text-capitalize">
              <a class="navbar-brand" href="javascript:void(0)" (click)="logout()">
                <span>{{loggedUser.name}}</span>
                <small><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span></small>
              </a>
            </div>
          </div>

          <!-- Not Logged In user -->
          <div class="media" *ngIf="!loggedUser || loggedUser.anonymous">
            <a class="navbar-brand" [routerLink]=" ['./authentication'] ">Login &nbsp;| &nbsp;Register</a>
          </div>
          
        </div><!-- panel-body -->
    `
  })

export class UserPanelComponent {

  // The logged in user
  loggedUser: User;

  constructor(private userService: UserService) {
    userService.userLogged.subscribe(user => {
      this.loggedUser = user;
    });
  }

  logout() {
    this.userService.logout();
  }
}
