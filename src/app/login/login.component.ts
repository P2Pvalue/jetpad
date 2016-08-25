import { Component, OnInit } from '@angular/core';
import { SwellRTService } from '../services';
import { User } from '../shared';
import {Router} from "@angular/router";


@Component({
    selector: 'app-login',
    template: `
      <div class="panel panel-default text-center">
        <div class="panel-body">
          <h4>LOGIN</h4>
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

        </div><!-- panel-body -->
      </div><!-- panel -->
    `
  })

export class LoginComponent implements OnInit {

  // The logged in user
  loggedInUser: User;
  // Form fields
  nameInput: string;
  passwordInput: string;


  constructor(private swellrt: SwellRTService, private router: Router) {}

  ngOnInit() {
    this.swellrt.getUser().then(user => {
        this.loggedInUser = user;
    });
  }

  login() {
    this.swellrt.login(this.nameInput + this.swellrt.domain, this.passwordInput).then(
      user => {
        this.loggedInUser = user;
        this.router.navigate(['./']);
      }
    );
  }

}
