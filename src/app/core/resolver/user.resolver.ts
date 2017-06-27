import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class UserResolve implements Resolve<any> {

    constructor(private userService: UserService) {}

    public resolve(route: ActivatedRouteSnapshot) {
        return new Promise<any>((resolve) => {
            this.userService.currentUser.subscribe((user) => {
                resolve(user);
            });
        });
    }
}
