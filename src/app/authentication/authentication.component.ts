import { Component } from '@angular/core';

@Component({
    selector: 'app-authentication',
    template: `
    <div class="row">
        <div class="panel panel-default text-center">
          <div class="panel-body">
              <div class="col-md-4 col-md-offset-1">
                <app-login></app-login>         
              </div>
              <div class="col-md-4 col-md-offset-2">
                <app-login></app-login>         
              </div>
          </div>
        </div>
    </div>
    <app-footer></app-footer>
    `,
  })



export class AuthenticationComponent {}
