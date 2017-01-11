import {Component} from '@angular/core';
import { UserService } from "../../../core/services/user.service";


@Component({
    selector: 'jp-register',
    template: `
      <form (ngSubmit)="register()">
        <div class="form-group">
          <label class="sr-only" for="registerMailInput">Mail</label>
          <input class="form-control" id="registerMailInput" name="email" type="email" placeholder="Mail" [(ngModel)]="mailInput">
        </div>
        <div class="form-group">
          <label class="sr-only" for="registerNameInput">Username</label>
          <input class="form-control" id="registerNameInput" name="name" placeholder="Username" [(ngModel)]="nameInput">
        </div>
        <div class="form-group">
          <label class="sr-only" for="registerPasswordInput">Password</label>
          <input class="form-control" id="registerPasswordInput" name="password" type="password" placeholder="Password" [(ngModel)]="passwordInput">
        </div> 
        <button [disabled]="!acceptTermsInput" class="btn btn-primary btn-lg btn-block mar-top-20">Register</button>
         
        <div class="checkbox text-center">
          <label>
            <input type="checkbox" [(ngModel)]="acceptTermsInput" name="acceptTerms">
            <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
            By clicking you accept <a [routerLink]=" ['/terms']">terms and conditions</a>
          </label>
        </div>
        
      </form>
    `
  })

export class RegisterComponent {

  // Form fields
  nameInput: string;
  passwordInput: string;
  mailInput: string;
  acceptTermsInput: boolean = false;
  constructor(private userService: UserService) {}

  register() {
    this.userService.create(this.nameInput, this.passwordInput, this.mailInput);
  }
}
