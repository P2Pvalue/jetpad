import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
    selector: 'jp-login',
    template: `
<div class="row landing-panel container-fluid">
<div class="row top-bar">

    <div class="col-md-offset-1 col-xs-2 col-md-offset-2 col-md-2 logo">
      <a href="/"><img alt="Jetpad" height=40 src="assets/img/jetpad-logo.png"></a>
    </div>

    <div class="col-xs-6 col-md-6 menu">


      <div class="pull-right"></div>
       
    </div>

    <div class="col-xs-4 col-md-2 menu">
     <button class="btn btn-link">
          <a routerLink="/register">
            Register
          </a>
        </button>
      </div>
</div>    


  <div class="row">
    <div class="col-xs-1 col-md-3"></div>
    <div class="col-xs-10 col-md-6">
  
      <div [ngClass]="customStyle">
        <!--<h2  class="h2 text-center">{{title}}</h2>-->
        <p *ngIf="unauthorized" class="text text-center">
            Enter your nick and password to access the resource.
        </p>
        <form [formGroup]="loginForm" (ngSubmit)="login($event)">
          <div class="form-group">
            <label class="sr-only" for="loginNameInput">Name</label>
            <input class="form-control" id="loginNameInput" name="name" 
                placeholder="Username or email" formControlName="name">
          </div>
          <div class="form-group label-floating">
            <label class="sr-only" for="loginPasswordInput">Password</label>
            <input class="form-control" id="loginPasswordInput" name="password" 
                type="password" placeholder="Password" formControlName="password">
          </div>
          <div *ngIf="formErrors.name" class="alert alert-danger">
                  {{ formErrors.name }}
                </div>
          <!-- TODO: Forget password doesn't work in server
          <div class="form-group text-center">
            <a href="javascript:void(0)" 
                (click)="recoverPassword()">Do you forget your password?</a>
          </div>
          -->
          <button type="submit" [ngClass]="{'disabled': loginForm.invalid}"
          class="btn btn-raised btn-primary btn-lg btn-block mar-top-20">Login</button>
        </form>
        <div class="goToRegister">
          <p class="text text-center">
          If you do not have an account click 
            <a style="color:white;" routerLink="/register">here</a></p>
        </div>       
      </div>
      </div>
  </div>
</div>
    `
})

export class LoginComponent implements OnInit {
    // TODO this class is a container. Move to containers/pages folder

    public LOGIN_FAILED = 403;
    @Input() public unauthorized: boolean;
    @Input() public customStyle: string = 'not-logged';

    public loginForm: FormGroup;

    public formErrors = {
        name: '',
        password: ''
    };

    private validationMessages = {
        name: {
            required:      'Name is required.',
            minlength:     'Name must be at least 1 characters long.',
            maxlength:     'Name cannot be more than 24 characters long.',
            loginFailed:         'Login failed'
        },
        password: {
            required: 'Password is required.',
            minlength: 'Password must be at leat 5 characters long.',
            maxlength: 'Password cannot be more than 50 characters long.'
        }
    };

    constructor(private router: Router,
                private fb: FormBuilder,
                private userService: UserService) {    }

    public ngOnInit(): void {
        this.createForm();
    }

    public recoverPassword() {
        if (this.loginForm.get('name').value !== '') {
            this.userService.recoverPassword(this.loginForm.get('name').value);
        }
    }

    public login(event: Event) {
        event.preventDefault();
        if (this.loginForm.valid) {
            this.userService.login(
                this.loginForm.get('name').value,
                this.loginForm.get('password').value)
                .subscribe((user) => {
                    console.log(user);
                    this.router.navigate(['/']);
                }, (error) => {
                    if (error.statusCode === this.LOGIN_FAILED) {
                        this.formErrors['name'] = this.validationMessages['name']['loginFailed'];
                        this.loginForm.get('password').setErrors({loginFailed: true});
                    }
                });
        } else {
            this.onValueChanged();
        }
    }

    private createForm() {
        this.loginForm = this.fb.group({
            name: ['', Validators.required ],
            password: ['', Validators.required ]
        });
        this.loginForm.valueChanges
            .subscribe((data) => this.onValueChanged(data));
        this.onValueChanged();
    }

    // TODO refactor in one service
    private onValueChanged(data?: any) {
        if (!this.loginForm) { return; }
        const form = this.loginForm;
        for (const field in this.formErrors) {
            if (field) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                if (control && control.dirty && !control.valid) {
                    const messages = this.validationMessages[field];
                    for (const key in control.errors) {
                        if (key) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    }
}
