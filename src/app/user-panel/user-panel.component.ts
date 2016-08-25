import { Component, OnInit } from '@angular/core';
import { SwellRTService } from '../services';
import { User } from '../shared';


@Component({
    selector: 'app-user-panel',
    template: `
      <div *ngIf="loggedInUser">
        <div>
          <!-- Logged In user -->
          <div class="media" *ngIf="!loggedInUser.anonymous">
            <div class="media-left media-middle">
              <a>
                <img class="media-object img-circle" height="40" src="{{loggedInUser.avatarUrl}}" alt="">
              </a>
            </div>
            <div class="media-right media-middle text-capitalize">
              <a class="navbar-brand" href="javascript:void(0)" (click)="logout()">
                <span>{{loggedInUser.name}}</span>
                <small><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span></small>
              </a>
            </div>
          </div>

          <!-- Not Logged In user -->
          <div class="media" *ngIf="!loggedInUser || loggedInUser.anonymous">
            <a class="navbar-brand" [routerLink]=" ['./authentication'] ">Login &nbsp;| &nbsp;Register</a>
          </div>

          <form style="margin-top:4em" *ngIf="panelState == 'registerForm'" (ngSubmit)="create()">

            <div class="form-group label-floating">
              <label class="control-label" for="registerNameInput">Name</label>
              <input class="form-control" id="registerNameInput" name="name" [(ngModel)]="nameInput">
            </div>
            <div class="form-group label-floating">
              <label class="control-label" for="registerPasswordInput">Password</label>
              <input class="form-control" id="registerPasswordInput" name="password" type="password" [(ngModel)]="passwordInput">
            </div>
            <div class="form-group label-floating">
              <label class="control-label" for="registerRepasswordInput">Repeat Password</label>
              <input class="form-control" id="registerRepasswordInput" name="repassword" type="password" [(ngModel)]="repasswordInput">
            </div>

            <a class="btn btn-default" (click)="cancelForm()">Cancel</a>
            <button class="btn btn-primary">Create</button>
          </form>


        </div><!-- panel-body -->
      </div><!-- panel -->
    `
  })

export class UserPanelComponent implements OnInit {

  // The logged in user
  loggedInUser: User;

  constructor(private swellrt: SwellRTService) {}

  ngOnInit() {
    this.swellrt.getUser().then(user => {
        this.loggedInUser = user;
    });
  }

  logout() {
    this.swellrt.logout(true).then(user => this.loggedInUser = user);
  }
}
