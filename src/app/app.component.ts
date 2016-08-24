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
        <app-header></app-header>
        <main>
          <router-outlet></router-outlet>
          <div id="snackbar-container"></div>
        </main>
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
