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
            <a class="navbar-brand">Login &nbsp;| &nbsp;Register</a>
          </div>

          <form style="margin-top:4em" *ngIf="panelState == 'loginForm'" (ngSubmit)="login()">

            <div class="form-group label-floating">
              <label class="control-label" for="loginNameInput">Name</label>
              <input class="form-control" id="loginNameInput" name="name" [(ngModel)]="nameInput">
            </div>
            <div class="form-group label-floating">
              <label class="control-label" for="loginPasswordInput">Password</label>
              <input class="form-control" id="loginPasswordInput" name="password" type="password" [(ngModel)]="passwordInput">
            </div>

            <a class="btn btn-default" (click)="cancelForm()">Cancel</a>
            <button class="btn btn-primary">Login</button>
          </form>


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
  // panelState = "collapsed | loginForm | registerForm"
  panelState: string;
  // Form fields
  nameInput: string;
  passwordInput: string;
  repasswordInput: string;


  constructor(private swellrt: SwellRTService) {
        this.panelState = 'collapsed';
    }

  ngOnInit() {
    this.swellrt.getUser().then(user => {
        this.loggedInUser = user;
    });
  }


  clearForms() {
    this.nameInput = null;
    this.passwordInput = null;
    this.repasswordInput = null;
  }

  login() {
    this.panelState = 'collapsed';
    this.swellrt.login(this.nameInput + this.swellrt.domain, this.passwordInput).then(
      user => {
        this.loggedInUser = user;
        this.clearForms();
      }
    );
  }

  create() {
    this.panelState = 'collapsed';
    this.swellrt.createUser(this.nameInput, this.passwordInput).then(() => {
      return this.swellrt.login(this.nameInput, this.passwordInput);
    }).then(
      user => {
        this.loggedInUser = user;
        this.clearForms();
      }
    );
  }

  logout() {
    this.swellrt.logout(true).then(user => this.loggedInUser = user);
  }

  showLoginForm() {
    this.panelState = 'loginForm';
  }

  showRegisterForm() {
    this.panelState = 'registerForm';
  }

  cancelForm() {
    this.panelState = 'collapsed';
  }

}
