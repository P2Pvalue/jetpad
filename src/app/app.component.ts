import {Component, ViewEncapsulation} from "@angular/core";
import {ListenerService, UserService} from "./services";

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.scss'
  ],
  template: `
    <div class="container">
      <router-outlet></router-outlet>
    </div>
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
