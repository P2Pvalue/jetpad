import { Component, ViewEncapsulation } from '@angular/core';

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

export class AppComponent {

}
