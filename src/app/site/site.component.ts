import { Component } from "@angular/core";

@Component({
  selector: 'jp-site',
  template: `
    <jp-site-header></jp-site-header>
    <div class="container-fluid contenido">
      <router-outlet></router-outlet>
    </div>
    <jp-site-footer></jp-site-footer>
  `,
})

export class SiteComponent {

}
