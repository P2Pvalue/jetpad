import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { equalValidator } from '../../directives/equal-validator.directive';
import { onValueChanged } from './../utils';

@Component({
    selector: 'jp-change-password',
    template: `
        <form [formGroup]="changePasswordForm" style="margin-top:4em"
              (ngSubmit)="onSubmit($event)">
            <div class="form-group label-floating">
                <label class="control-label" 
                    for="nameInput">Old Password</label>
                <input class="form-control" formControlName="password" 
                    id="oldPasswordInput" type="password" name="oldPassword">
                <div *ngIf="formErrors.password" class="alert alert-danger">
                  {{ formErrors.password }}</div>
            </div>
            <div class="form-group label-floating">
                <label class="control-label" for="emailInput">
                    New password</label>
                <input class="form-control" formControlName="newPassword" 
                    id="newPasswordInput" type="password" name="newPassword">
                <div *ngIf="formErrors.newPassword" class="alert alert-danger">
                  {{ formErrors.newPassword }}</div>
            </div>
            <div class="form-group label-floating">
                <label class="control-label" for="emailInput">
                    Repeat new password</label>
                <input class="form-control" formControlName="repeatPassword"
                       type="password" name="repeatNewPassword" 
                       id="repeatNewPasswordInput">
                <div *ngIf="formErrors.repeatPassword" class="alert alert-danger">
                  {{ formErrors.repeatPassword }}</div>
            </div>
            <button type="submit" 
                class="btn btn-primary btn-block mar-top-20">Change password</button>
            <div *ngIf="success" class="alert alert-success">Password Changed</div>
        </form>
    `,
    styles: [`
        input {
            color:black
        }
    `]
})

export class ChangePasswordComponent implements OnInit {

    @Input() public success: boolean = false;

    @Output() public newPassword = new EventEmitter<any>();

    public changePasswordForm: FormGroup;

    public formErrors = {
        password: '',
        newPassword: '',
        repeatPassword: ''
    };

    private validationMessages = {
        password: {
            required: 'Password is required.',
            minlength: 'Password must be at leat 5 characters long.',
            maxlength: 'Password cannot be more than 50 characters long.'
        },
        newPassword: {
            required: 'Password is required.',
            minlength: 'Password must be at leat 5 characters long.',
            maxlength: 'Password cannot be more than 50 characters long.',
            validateEqual: 'Password has to be equal to Repeated password.'
        },
        repeatPassword: {
            validateEqual: 'Repeated password has to be equal to password.'
        }
    };

    constructor(private fb: FormBuilder) { }

    public ngOnInit(): void {
        this.createForm();
        this.changePasswordForm.valueChanges
            .subscribe((data) =>
                onValueChanged(this.changePasswordForm, this.formErrors, this.validationMessages));
    }

    public onSubmit(event: Event) {
        debugger
        event.preventDefault();
        if (this.changePasswordForm.valid) {
            this.newPassword.emit({
                pass: this.changePasswordForm.get('password').value,
                newPass: this.changePasswordForm.get('newPassword').value
            });
        }
    }

    private createForm() {
        this.changePasswordForm = this.fb.group({
            password: ['', Validators.compose(
                [
                    Validators.required
                ])
            ],
            newPassword: ['', Validators.compose(
                [
                    Validators.minLength(5),
                    Validators.maxLength(50),
                    Validators.required,
                    equalValidator('repeatPassword')
                ])
            ],
            repeatPassword: ['', Validators.compose(
                [
                    equalValidator('newPassword')
                ])
            ]
        });
        onValueChanged(this.changePasswordForm, this.formErrors, this.validationMessages);
    }
}
