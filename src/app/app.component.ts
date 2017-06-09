import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BackendService, SwellService } from './core/services';


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
      <jetpad-modal-placeholder></jetpad-modal-placeholder>  
    </main>
    
  `
})

export class App implements OnInit {


  //
  // VERSION REFACTOR
  //

  constructor(private swell: SwellService) {
  }

  public ngOnInit() {

    this.swell.readySubject.subscribe( (isReady) => {
      if (isReady) {
        console.log('SwellRT client is ready');
      } else {
        console.log('SwellRT couldnt load');
      }
    });


    this.swell.startUp(15000);
  }


  //
  // VERSION EN PRODUCCION
  //


  /*
  constructor(private backend: BackendService) {
  }

  public ngOnInit() {

    

    // bind swellrt backend
    this.backend.bind(new Promise(
      (resolve, reject) => {
        swellrt.onReady( (s) => {
          console.log('swellrt client ready');
          resolve(s);
        });

        setTimeout( () => {
            reject(new Error('Timeout error loading SwellRT client (15s)'));
        }, 15000);
      }
    ));

    // resume existing session or start anonymous one
    this.backend.startDefaultSession();
  }
  */

}
