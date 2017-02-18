import { Component } from "@angular/core";

@Component({
  selector: 'jp-site',
  template: `
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  `,
})

export class SiteComponent {

}
