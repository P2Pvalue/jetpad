/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from "@angular/core";
import {SwellRTService} from "./services";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.scss'
  ],
  template: `
    <div class="container">
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
    
        <div id="snackbar-container"></div>
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `
})

export class App {

  constructor(private swellrt: SwellRTService) {
  }

  ngOnInit() {
    this.swellrt.bindListeners();
    this.swellrt.resume(true);
  }

}
