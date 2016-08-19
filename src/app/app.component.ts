/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { LandingComponent } from './landing';
import { UserSpaceComponent } from './user-space';
import { EditorComponent } from './editor';
import { SwellRTService } from './services';

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

      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" [routerLink]=" ['./'] ">SwellRT Editor</a>
          </div>
        </div>
      </nav>

      <router-outlet></router-outlet>

      <div id="snackbar-container"></div>
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
