import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../core/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { equalValidator } from '../../../share/directives/equal-validator.directive';
import { onValueChanged } from '../../../share/components/utils';

@Component({
    selector: 'jp-register',
    template: `
<div class="row register-panel container-fluid">
    <jp-site-header></jp-site-header>
  <div class="row">
  <div class="col-xs-1 col-md-3"></div>
  <div class="col-xs-10 col-md-6">
    <form [formGroup]="registerForm" (ngSubmit)="register($event)">
        <div class="form-group">
          <label class="sr-only" for="registerMailInput">Mail</label>
          <input class="form-control" id="registerMailInput" 
            name="email" type="email" placeholder="Mail" 
            formControlName="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$" required>
            <div *ngIf="formErrors.email" class="alert alert-danger">
              {{ formErrors.email }}
            </div>
        </div>
        <div class="form-group">
            <label for="image_src">Photo</label>
            <div class="media">
                <div class="media-left">
                    <!--<img src="assets/img/user-mask.png" class="user-mask"/>-->
                    <img height="130" src="{{avatarData}}">
                </div>
                <div class="media-body media-middle">
                    <input type="file" accept="image/*" 
                        formControlName="avatar"
                       name="image_src" class="input-file"
                       (change)="changeListener($event)"/>
                  <i class="material-icons">photo</i>Upload a file
                </div>
                <div *ngIf="formErrors.avatar" class="alert alert-danger">
                  {{ formErrors.avatar }}
                </div>
            </div>
        </div>
        <div class="form-group">
          <label class="sr-only" for="registerNameInput">Username</label>
          <input class="form-control" id="registerNameInput" 
            name="name" placeholder="Username" formControlName="name" required>
            <div *ngIf="formErrors.name" class="alert alert-danger">
              {{ formErrors.name }}
            </div>
        </div>
        <div class="form-group">
          <label class="sr-only" for="registerPasswordInput">Password</label>
          <input #pass class="form-control" id="registerPasswordInput" 
            name="password" type="password" placeholder="Password" 
            formControlName="password" required>
            <div *ngIf="formErrors.password" class="alert alert-danger">
              {{ formErrors.password }}
            </div>
        </div>
        <div class="form-group">
          <label class="sr-only" for="registerRepeatPasswordInput">Password</label>
          <input class="form-control" id="registerRepeatPasswordInput" 
            name="repeatPassword" type="password" placeholder="Repeat password" 
            formControlName="repeatPassword" required>
            <div *ngIf="formErrors.repeatPassword" class="alert alert-danger">
              {{ formErrors.repeatPassword }}
            </div>
        </div>
        <div class="text-center">
          <label>
            <input type="checkbox" formControlName="acceptTerms" name="acceptTerms">
            <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
            Accept <a [routerLink]=" ['/terms']">terms and conditions</a>
          </label>
        </div>
        <button type="submit" [ngClass]="{'disabled': !registerForm.valid}" 
            class="btn btn-raised btn-primary btn-lg btn-block mar-top-20">
            Register
        </button>
    </form>
  </div>
</div>
</div>
    `,
    styles: [`
        input {
            color: white;
        }
    `]
})

export class RegisterComponent implements OnInit {

    // Form fields
    public registerForm: FormGroup;

    public ACCOUNT_ALREADY_EXISTS = 403;

    public avatarData: string;

    public formErrors = {
        name: '',
        password: '',
        repeatPassword: '',
        email: '',
        acceptTerms: '',
        avatar: ''
    };

    public avatar: string;

    private validationMessages = {
        name: {
            required:      'Name is required.',
            minlength:     'Name must be at least 1 characters long.',
            maxlength:     'Name cannot be more than 24 characters long.',
            exist:         'This name already exists.'
        },
        email: {
            required: 'Email is required.',
            pattern: 'Email is malformed'
        },
        password: {
            required: 'Password is required.',
            minlength: 'Password must be at leat 5 characters long.',
            maxlength: 'Password cannot be more than 50 characters long.',
            validateEqual: 'Password has to be equal to Repeated password.'
        },
        repeatPassword: {
            validateEqual: 'Repeated password has to be equal to password.'
        },
        acceptTerms: {
            required: 'Accept the terms is required.'
        },
        avatar: {
            load: 'There is not file loaded'
        }
    };

    constructor(private userService: UserService,
                private fb: FormBuilder,
                private router: Router,
                private renderer: Renderer) {    }

    public ngOnInit(): void {
        this.createForm();
    }

    public register(event: Event) {
        event.preventDefault();
        if (this.registerForm.valid) {
            this.userService.create(this.registerForm.get('name').value,
                this.registerForm.get('password').value,
                this.registerForm.get('email').value,
                this.avatarData)
                .subscribe(
                    () => {
                        this.router.navigate(['/']);
                    },
                    (error) => {
                        if (error.statusCode === this.ACCOUNT_ALREADY_EXISTS) {
                            this.formErrors['name'] = this.validationMessages['name']['exist'];
                            this.registerForm.get('name').setErrors({exist: true});
                        }
                    }
                );
        } else {
            onValueChanged(this.registerForm, this.formErrors, this.validationMessages);
        }
    }

    public changeListener($event): void {
        this.readThis($event.target);
    }

    private createForm() {
        this.registerForm = this.fb.group({
            name: ['', Validators.required ],
            password: ['', Validators.compose(
                [Validators.required, equalValidator('repeatPassword')])],
            repeatPassword: ['', Validators.compose(
                [Validators.required, equalValidator('password')])],
            email: ['', Validators.required],
            acceptTerms: ['', Validators.required],
            avatar: ''
        });

        this.registerForm.valueChanges
            .subscribe(() =>
                onValueChanged(this.registerForm, this.formErrors, this.validationMessages));
        onValueChanged(this.registerForm, this.formErrors, this.validationMessages);
    }

    private readThis(inputValue: any): void {
        let file: File = inputValue.files[0];
        this.avatar = file.name;
        let fileReader: FileReader = new FileReader();

        fileReader.onloadend = () => {
            this.avatarData = fileReader.result;
        };
        fileReader.readAsDataURL(file);
    }
}
