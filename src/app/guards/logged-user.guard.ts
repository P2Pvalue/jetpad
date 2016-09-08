import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from "../services";

@Injectable()
export class LoggedUserGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate() {
    if(this.userService.getUser() !== undefined) {
      return new Promise<any>(resolve => resolve(this.checkLoggedUser(this.userService.getUser())));
    } else {
      return this.userService.getSession().then(user => this.checkLoggedUser(user));
    }
  }

  checkLoggedUser(user) {
    if (!user.anonymous) { return true; }
    this.router.navigate(['/authentication']);
    return false;
  }
}
