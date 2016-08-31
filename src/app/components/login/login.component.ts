import {Component, Input} from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../services";


@Component({
    selector: 'app-login',
    template: `
      <div class="panel panel-default">
        <div class="panel-body text-center">
          <h4>{{title}}</h4>
          <form style="margin-top:4em" (ngSubmit)="login()">
            <div class="form-group label-floating">
              <label class="control-label" for="loginNameInput">Name</label>
              <input class="form-control" id="loginNameInput" name="name" [(ngModel)]="nameInput">
            </div>
            <div class="form-group label-floating">
              <label class="control-label" for="loginPasswordInput">Password</label>
              <input class="form-control" id="loginPasswordInput" name="password" type="password" [(ngModel)]="passwordInput">
            </div>
            <button class="btn btn-primary">Login</button>
          </form>
          <a href="javascript:void(0)" (click)="recoverPassword()">Do you forget your password?</a>
        </div>
      </div>
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
