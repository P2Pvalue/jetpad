import { Component } from '@angular/core';
import { UserService } from "../../services";
import {Router} from "@angular/router";

@Component({
    selector: 'app-user-panel',
    template: `

      <!-- Logged In user -->
      <div class="clearfix" *ngIf="currentUser && !currentUser.anonymous">
        <ul class="list-inline">
          <li class="dropdown cursor-pointer" dropdown>
            <span class="navbar-brand" dropdown-open>
              <img *ngIf="currentUser.avatarUrl" class="img-circle user-avatar" height="40" src="{{currentUser.avatarUrl}}" alt="">
              <span *ngIf="!currentUser.avatarUrl" class="not-avatar">{{this.getInitials()}}</span>
              {{currentUser.name}}
            </span>
            <ul class="dropdown-menu">
              <li><a [routerLink]=" ['./profile'] ">MY PROFILE</a></li>
              <li><a href="javascript:void(0)" (click)="logout()">LOGOUT</a></li>
           </ul>
          </li>
          <li><span class="navbar-brand pipe"></span></li>
        </ul>
      </div>

      <!-- Not Logged In user -->
      <div class="clearfix" *ngIf="!currentUser || currentUser.anonymous">
        <ul class="list-inline">
          <li>
            <a class="navbar-brand" [routerLink]=" ['./authentication'] ">
              <i class="icon icon-lock"></i> Login
            </a>
          </li>
          <li><span class="navbar-brand pipe"></span></li>
          <li>
            <a class="navbar-brand" [routerLink]=" ['./authentication'] ">
              <i class="icon icon-user"></i> Register
            </a>
          </li>
        </ul>
      </div>

    `
  })

export class UserPanelComponent {

  // The logged in user
  currentUser: any;

  constructor(private userService: UserService, private router: Router) {
    userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  getInitials() {
    let initials = "";
    let name = this.currentUser.name;
    name.split(" ").forEach(function (word) {
      initials = initials.concat(word.charAt(0))
    });
    return initials.toUpperCase();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['./']);
  }
}
