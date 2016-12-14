import {Component, ViewEncapsulation} from "@angular/core";
import {ListenerService, UserService} from "./services";

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.scss'
  ],
  template: `
    <main>
      <div class="container">
        <jp-site-header></jp-site-header>
        <router-outlet></router-outlet>
        <jp-site-footer></jp-site-footer>
      </div>
    </main>

  `
})

export class App {

  constructor(private listenerService: ListenerService, private userService: UserService) {
  }

  ngOnInit() {
    this.listenerService.bindListeners();
    this.userService.resume();
  }
}
