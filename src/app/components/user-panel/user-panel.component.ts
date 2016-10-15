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
              <img class="img-circle user-avatar" height="40" src="{{currentUser.avatarUrl}}" alt="">
              {{currentUser.name}}
            </span>
            <ul class="dropdown-menu">
              <li><a [routerLink]=" ['./profile'] ">MY PROFILE</a></li>
              <li><a href="javascript:void(0)" (click)="logout()">LOGOUT</a></li>
           </ul>
          </li>
          <li><span class="navbar-brand pipe"></span></li>
        </ul>

        <div class="media-left media-middle" style="display: none">
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

  logout() {
    this.userService.logout();
    this.router.navigate(['./']);
  }
}
