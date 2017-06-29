import {
    Component, OnInit, Output, EventEmitter, Renderer, ViewChild, ElementRef, Input,
    OnChanges, SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { onValueChanged } from './utils';

@Component({
    selector: 'jp-user-form',
    template: `
        <form [formGroup]="userForm" (ngSubmit)="onUpdateUser($event)">
            <div class="form-group">
                <label for="image_src">Photo</label>
                <div class="media">
                    <div class="media-left">
                        <img *ngIf="!user || !user.avatarUrl" 
                            src="assets/img/user-mask.png" class="user-mask"/>
                        <img src="{{user.avatarUrl}}" *ngIf="user && user.avatarUrl"/>
                        <img height="130" *ngIf="user && avatarData" 
                            id="img" src="{{avatarData}}"/>
                    </div>
                    <div class="media-body media-middle">
                        <input #imageInput type="file" accept="image/*" formControlName="avatar"
                               name="image_src" id="image_src" class="input-file"
                               (change)="changeListener($event)"/>
                        <span class="input-btn" (click)="showImageBrowseDialog()">
                      <i class="icon icon-image icon-middle"></i>Upload a file
                    </span>
                    </div>
                    <div *ngIf="formErrors.avatar" class="alert alert-danger">
                      {{ formErrors.avatar }}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label" for="nameInput">Name</label>
                <input class="form-control" formControlName="name" 
                    id="nameInput" name="name">
                <div *ngIf="formErrors.name" class="alert alert-danger">
                  {{ formErrors.name }}
                </div>
            </div>
            <div class="form-group">
                <label class="control-label" for="emailInput">
                    Email
                    <span>(optional, you could recieved
                  notifications about your documents)</span>
                </label>
                <input class="form-control" formControlName="email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$" id="emailInput" name="email">
                <div *ngIf="formErrors.email" class="alert alert-danger">
                  {{ formErrors.email }}
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-block">Save</button>
            </div>
        </form>
    `,
    styles: [`
        input {
            color:black
        }
    `]
})

export class UserFormComponent implements OnInit, OnChanges {

    @ViewChild('imageInput') public imageInput: ElementRef;

    @Input() public user: any;

    @Output() public updateUser: EventEmitter<any>;

    public avatarData: any;

    public userForm: FormGroup;

    public formErrors = {
        name: '',
        email: '',
        avatar: ''
    };

    private validationMessages = {
        name: {
            required: 'Name is required.',
            minlength: 'Name must be at leat 5 characters long.',
            maxlength: 'Name cannot be more than 50 characters long.'
        },
        email: {
            required: 'Email is required.',
            pattern: 'Email is malformed'
        },
        avatar: {
            load: 'There is not file loaded'
        }
    };

    private avatar: string;

    constructor(private fb: FormBuilder, private renderer: Renderer) {
        this.createForm();
    }

    public ngOnInit() {
        this.userForm.valueChanges
            .subscribe(() =>
                onValueChanged(this.userForm, this.formErrors, this.validationMessages));
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.userForm.setValue({
            name:   this.user.name,
            email:  this.user.email,
            avatar: '',
        });
        this.avatarData = this.user.avatarData;
    }

    public showImageBrowseDialog() {
        this.renderer.invokeElementMethod(this.imageInput.nativeElement, 'click', []);
    }

    public onUpdateUser(event) {
        event.preventDefault();
        if (this.userForm.valid) {
            let u = Object.assign({}, this.user, {
                name: this.userForm.get('name').value,
                email: this.userForm.get('email').value,
                avatarData: this.avatarData
            });
            this.updateUser.emit(u);
        }
    }

    public changeListener($event): void {
        this.readThis($event.target);
    }

    private createForm() {
        this.userForm = this.fb.group({
            avatar: '',
            name: ['', Validators.required],
            email: ['', Validators.required]
        });
        onValueChanged(this.userForm, this.formErrors, this.validationMessages);
    }

    private readThis(inputValue: any): void {
        let file: File = inputValue.files[0];
        let fileReader: FileReader = new FileReader();
        let that = this;
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
            that.avatarData = fileReader.result;
            that.avatar = fileReader.result;
        };
    }
}
