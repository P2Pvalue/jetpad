import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
    selector: 'jp-landing',
    templateUrl: 'landing.component.html'
})

export class LandingComponent {
    public documentId;

    public landingForm: FormGroup;

    public user: any;

    constructor(private router: Router, private fb: FormBuilder,
                private userService: UserService) {
        this.createForm();
        this.userService.currentUser.subscribe((user) => {
            // TODO check how to test if user is anonymous. swellrt.Constants.ANONO... does not work
            if (user && user.session && !user.session.anonymous) {
                this.user = user.session;
                console.log(this.user);
            }
        });
    }

    public openDocument(_id: string) {
        if (_id) {
            // [$&+,:;=?@#|'<>.-^*()%!]" -> regexp special chars
            // remove all special chars of URIs and regexp
            /*
             Test:
             var s = "A[B$C&D+E,F:G;H=I?J@K#L|M'N<O>P.Q-R^S*U(V)W%X!Y]Z\"A";
             var pattern = /[\:/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\"\|\<\>\-\^\%\.]/g
             s.replace(pattern, s) == "ABCDEFGHIJKLMNOPQRSUVWXYZA"
             */

            let pattern = /[\:/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\"\|\<\>\-\^\%\.]/g;
            _id = _id.replace(pattern, '');
            _id = _id.split(' ').join('-').substr(0, 64).toLowerCase();
            let link = ['edit', _id];
            this.router.navigate(link);
        }
    }

    private createForm() {
        this.landingForm = this.fb.group({
            documentId: ['', Validators.required ]
        });
    }

}
