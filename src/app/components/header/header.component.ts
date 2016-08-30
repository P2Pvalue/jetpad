import {Component} from "@angular/core";

@Component({
  selector: 'app-header',
  template: `
        <header>
          <div class="row">
            <nav class="navbar navbar-default">
              <div class="container-fluid">
                <div class="navbar-header">
                  <a class="navbar-brand" [routerLink]=" ['./'] "><b>Jetpad</b></a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul class="nav navbar-nav navbar-right">
                    <app-user-panel></app-user-panel>         
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </header>
        `
})

export class HeaderComponent {

  constructor() {
  }

}
