import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from "../services";

@Injectable()
export class LoggedUserGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate() {
    if (!this.userService.loggedUser()) { return true; }
    this.router.navigate(['/authentication']);
    return false;
  }
}
