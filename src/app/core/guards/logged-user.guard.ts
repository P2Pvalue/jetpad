import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/x-session.service';

@Injectable()
export class LoggedUserGuard implements CanActivate {

    private user: any;

    constructor(private sessionService: SessionService, private router: Router) {
        this.sessionService.subject.subscribe((user) => {
            this.user = user;
        });
    }

    public canActivate() {
        if (!this.user || !this.user.session) {
            this.router.navigate(['/login']);
            return false;
        } else if (this.user && !this.user.session.anonymous) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
