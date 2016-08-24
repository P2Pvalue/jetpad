import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-footer',
  template: `
        <footer>
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                Created by <a href="http://twitter.com/DanWahlin" target="_blank">Dan Wahlin</a>
              </div>
            </div>
          </div>
        </footer>
        `
})

export class FooterComponent {

  constructor() {
  }

}
