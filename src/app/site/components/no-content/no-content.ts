import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <div class="no-content-panel container-fluid">
      <jp-site-header></jp-site-header>
      <h1>404: page missing</h1>
    </div>
  `
})
export class NoContentComponent {

}
