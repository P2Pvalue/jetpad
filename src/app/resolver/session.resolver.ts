import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Injectable} from '@angular/core';

import {UserService} from "../services";
import {Observable} from "rxjs";

@Injectable()
export class SessionResolver implements Resolve<any> {

  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return Observable.fromPromise(this.userService.getSession());
  }
}
