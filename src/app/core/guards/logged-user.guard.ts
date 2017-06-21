import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/x-session.service';

@Injectable()
export class LoggedUserGuard implements CanActivate {

    private user: any;
  constructor(private sessionService: SessionService, private router: Router) {}

  public canActivate() {
    let p = new Promise<any>((resolve) => resolve(this.checkLoggedUser(this.user)));
    this.sessionService.subject.subscribe((user) => {
        this.user = user;
        return p;
    });
    return p;
  }

  public checkLoggedUser(user) {
    if (!user.anonymous) { return true; }
    this.router.navigate(['/authentication']);
    return false;
  }
}
