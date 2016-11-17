import { Component } from '@angular/core';

@Component({
    selector: 'app-authentication',
    template: `
    <section class="authentication">
      <div class="container-fluid">
        <div class="row row-eq-height">
          <div class="col-sm-6 left-content">
            <div class="row-centered">
              <div class="col-sm-7 col-centered">
                <app-login [title]="'Login'"></app-login>
              </div>
            </div>
          </div>
          <div class="col-sm-6 right-content">
            <div class="row-centered">
              <div class="col-sm-7 col-centered">
                <app-register></app-register>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <app-footer></app-footer>
    `,
  })



export class AuthenticationComponent {}
