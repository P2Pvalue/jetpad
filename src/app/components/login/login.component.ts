import {Component, Input, OnDestroy} from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../services";


@Component({
    selector: 'app-login',
    template: `
      <h2 class="h2 text-center">{{title}}</h2>
      <p class="text text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <form (ngSubmit)="login()">
        <div class="form-group">
          <label class="sr-only" for="loginNameInput">Name</label>
          <input class="form-control" id="loginNameInput" name="name" placeholder="Username o mail" [(ngModel)]="nameInput">
        </div>
        <div class="form-group label-floating">
          <label class="sr-only" for="loginPasswordInput">Password</label>
          <input class="form-control" id="loginPasswordInput" name="password" type="password" placeholder="Password" [(ngModel)]="passwordInput">
        </div>
        <div class="form-group text-center">
          <a href="javascript:void(0)" (click)="recoverPassword()">Do you forget your password?</a>
        </div>
        <button class="btn btn-primary btn-lg btn-block">Login</button>
      </form>
    `
  })

export class LoginComponent {

  @Input() title: string;

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
