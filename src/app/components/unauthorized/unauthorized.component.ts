import { Component } from '@angular/core';

@Component({
    selector: 'app-unauthorized',
    template: `
    <div class="row">
        <div class="panel panel-default text-center">
          <div class="panel-body">
              <div class="col-md-4 col-md-offset-4">
                <app-login [title]="title"></app-login>         
              </div>
          </div>
        </div>
    </div>
    <app-footer></app-footer>
    `,
  })



export class UnauthorizedComponent {

    title: string = 'YOU NEED TO LOGIN TO OPEN THIS DOCUMENT';
}
