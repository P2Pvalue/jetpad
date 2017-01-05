import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-unauthorized',
    template: `
    <div class="unauthorized">
      <div class="col-sm-12 title">
        <h2 class="text-center">{{title}}</h2>
        <hr />
      </div>
      <div class="row">
          <div class="panel panel-default text-center">
            <div class="panel-body">
                <div class="col-md-4 col-md-offset-4 login-container">
                  <i class="icon icon-edit"></i><span>Name of the document</span>
                  <jp-login [customStyle]="'login-unauthorized'" [hiddenDescription]=true></jp-login>
                  <label><hr class="line-decoration-left"> or <hr class="line-decoration-right"></label>
                  <p class="register-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <button class="btn btn-primary btn-lg btn-block btn-register mar-bottom-50" (click)="goToAuthenticationScreen()">Register</button>
                </div>
            </div>
          </div>
      </div>
    </div>
    `,
  })



export class UnauthorizedComponent {

    title: string = 'You need to login to open this document';

  constructor(private router: Router) {

  }

  goToAuthenticationScreen() {
    this.router.navigate(['authentication']);
  }
}
