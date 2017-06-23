import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
    selector: 'jp-my-documents',
    template: `
        <div class="row my-documents-panel container-fluid">
            <jp-site-header [user]="userService.currentUser| async"></jp-site-header>
            <div class="row">
                <div class="col-xs-12">
                    <h2 class="text-center">My documents</h2>
                    <hr/>
                </div>
            </div>
        </div>
    `
})

export class MyDocumentsComponent {

    constructor(public userService: UserService) { }

}
