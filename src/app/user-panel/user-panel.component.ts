import { Component } from '@angular/core';
import { User } from '../shared';
import { UserService } from "../services";

@Component({
    selector: 'app-user-panel',
    template: `
        <div>
          <!-- Logged In user -->
          <div class="media" *ngIf="currentUser && !currentUser.anonymous">
            <div class="media-left media-middle">
              <a>
                <img class="media-object img-circle" height="40" src="{{currentUser.avatarUrl}}" alt="">
              </a>
            </div>
            <div class="media-right media-middle text-capitalize dropdown" dropdown>
              <a class="navbar-brand" dropdown-open>
                <span>{{currentUser.name}}</span>
                <small><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span></small>
              </a>        
              <ul class="dropdown-menu">
                  <li><a [routerLink]=" ['./profile'] ">MY PROFILE</a></li>
                  <li><a href="javascript:void(0)" (click)="logout()">LOGOUT</a></li>
             </ul>
            </div>
          </div>

          <!-- Not Logged In user -->
          <div class="media" *ngIf="!currentUser || currentUser.anonymous">
            <a class="navbar-brand" [routerLink]=" ['./authentication'] ">Login &nbsp;| &nbsp;Register</a>
          </div>
          
        </div><!-- panel-body -->
    `
  })

export class UserPanelComponent {

  // The logged in user
  currentUser: User;

  constructor(private userService: UserService) {
    userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.userService.logout();
  }
}
