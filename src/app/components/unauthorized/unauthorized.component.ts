import { Component } from '@angular/core';

@Component({
    selector: 'app-unauthorized',
    template: `
    <div class="unauthorized">
      <div class="col-sm-12">
        <h2 class="text-center">{{title}}</h2>
        <hr />
      </div>
      <div class="row">
          <div class="panel panel-default text-center">
            <div class="panel-body">
                <div class="col-md-4 col-md-offset-4 login-container">
                  <app-login [hiddenDescription]=true></app-login>
                  <label>or</label>
                  <button class="btn btn-primary btn-lg btn-block mar-top-20">Register</button>
                </div>
            </div>
          </div>
      </div>
      <app-footer></app-footer>
    </div>
    `,
  })



export class UnauthorizedComponent {

    title: string = 'You need to login to open this document';
}
