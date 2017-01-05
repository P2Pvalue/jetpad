import {Component, Input, OnDestroy} from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../../core/services/user.service";


@Component({
    selector: 'jp-login',
    template: `
      <div [ngClass]="customStyle">
        <h2  class="h2 text-center">{{title}}</h2>
        <p *ngIf="!hiddenDescription" class="text text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label class="sr-only" for="loginNameInput">Name</label>
            <input class="form-control" id="loginNameInput" name="name" placeholder="Username or email" [(ngModel)]="nameInput">
          </div>
          <div class="form-group label-floating">
            <label class="sr-only" for="loginPasswordInput">Password</label>
            <input class="form-control" id="loginPasswordInput" name="password" type="password" placeholder="Password" [(ngModel)]="passwordInput">
          </div>
          <!-- TODO: Forget password doesn't work in server
          <div class="form-group text-center">
            <a href="javascript:void(0)" (click)="recoverPassword()">Do you forget your password?</a>
          </div>
          -->
          <button class="btn btn-primary btn-lg btn-block mar-top-20">Login</button>
        </form>
      </div>
    `
  })

export class LoginComponent {

  @Input() title: string;
  @Input() hiddenDescription: boolean;
  @Input() customStyle: string;

  // Form fields
  nameInput: string;
  passwordInput: string;


  constructor(private userService: UserService, private router: Router) {
    userService.userLogged.subscribe(user => {
        router.navigate(['']);
    });
  }

  recoverPassword() {
    if(this.nameInput) {
      this.userService.recoverPassword(this.nameInput);
    }
  }

  login() {
    this.userService.login(this.nameInput, this.passwordInput);
  }
}
