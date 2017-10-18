import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService, AppState } from '../../../core/services';
import * as TitleUtils from '../../../share/components/title-utils';


@Component({
    selector: 'jp-landing',
    templateUrl: 'landing.component.html'
})

export class LandingComponent {

    public documentTitle: any;
    public landingForm: FormGroup;
    public user: any;

    constructor(private router: Router, private fb: FormBuilder,
                private userService: UserService,
                private appState: AppState) {
        this.createForm();
        this.userService.currentUser.subscribe((user) => {
            this.user = user;
        });
    }

    public goToDocument(rawtitle: string) {
        // at this point title is already validated
        if (rawtitle) {
            // pass the original title to the editor
            // avoiding url parameters
            this.appState.set('action', {
                name: 'setTitle',
                value: rawtitle
             });

            let urlTitle = TitleUtils.titleToUrl(rawtitle);
            let link = ['edit', urlTitle];
            this.router.navigate(link);
        }
    }

    private createForm() {
        this.landingForm = this.fb.group({
            documentTitle: ['',
                [Validators.required, Validators.minLength(4), TitleUtils.titleValidator]
             ]
        });
    }

}
