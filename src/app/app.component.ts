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

        swellrt.onReady( s => {
          console.log("swellrt client ready");
          resolve(s);
        });

        setTimeout(function () {
            reject(new Error('Timeout error loading SwellRT client (15s)'));
        }, 15000);
      }
    ));

    // resume existing session or start anonymous one
    this.backend.startDefaultSession();
  }
}
