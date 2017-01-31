import { Component, ViewEncapsulation } from "@angular/core";
import { BackendService } from "./core/services";

declare let swellrt: any;

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.scss'
  ],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>

  `
})

export class App {


  constructor(private backend: BackendService) {
  }

  ngOnInit() {

    // bind swellrt backend
    this.backend.bind(new Promise(
      (resolve, reject) => {
        swellrt.onReady( (s) => {
          resolve(s);
        });
      }
    ));

    // resume existing session
    this.backend.resume();
  }
}
