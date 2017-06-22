import { Component, ElementRef, ViewChild, Renderer, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionService, UserService } from '../../../core/services';

@Component({
  selector: 'app-profile',
  template: `
    <section class="profile">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <a href="#" class="go-back">
              <i class="icon icon-go-back icon-middle"></i>
              <span>Return</span>
            </a>
          </div>
          <div class="col-sm-12">
            <h2 class="text-center">My profile</h2>
            <hr />
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4 col-sm-offset-1">
            <h3>
              <i class="icon icon-user icon-middle"></i>
              User information
              <hr />
            </h3>
            <form [formGroup]="profileForm" (ngSubmit)="updateUser()">
              <div class="form-group">
                <label for="image_src">Photo</label>
                <div class="media">
                  <div class="media-left">
                    <img src="assets/img/user-mask.png" class="user-mask" />
                    <img height="130" id="img" src="{{avatar}}" />
                  </div>
                  <div class="media-body media-middle">
                    <input #imageInput type="file" accept="image/*" formControlName="avatar"
                        name="image_src" id="image_src" class="input-file" 
                       (change)="changeListener($event)"/>
                    <span class="input-btn" (click)="showImageBrowseDialog()">
                      <i class="icon icon-image icon-middle"></i>Upload a file
                    </span>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="control-label" for="nameInput">Name</label>
                <input class="form-control" formControlName="name" id="nameInput" name="name">
              </div>
              <div class="form-group">
                <label class="control-label" for="emailInput">
                  Email
                  <span>(optional, you could recieved 
                  notifications about your documents)</span>
                </label>
                <input class="form-control" formControlName="email" id="emailInput" name="email">
              </div>
              <div class="form-group">
                <button class="btn btn-primary mar-top-20">Save</button>
              </div>
            </form>
          </div>
          <div class="col-sm-4 col-sm-offset-2">
            <h3>
              <i class="icon icon-lock icon-middle"></i>
              Change your password
              <hr />
            </h3>
            <form [formGroup]="changePasswordForm" style="margin-top:4em" 
                (ngSubmit)="changePassword()">
              <div class="form-group label-floating">
                <label class="control-label" for="nameInput">Old Password</label>
                <input class="form-control" formControlName="password" id="oldPasswordInput" 
                    type="password" name="oldPassword">
              </div>
              <div class="form-group label-floating">
                <label class="control-label" for="emailInput">New password</label>
                <input class="form-control" formControlName="newPassword" id="newPasswordInput" 
                    type="password" name="newPassword">
              </div>
              <div class="form-group label-floating">
                <label class="control-label" for="emailInput">Repeat new password</label>
                <input class="form-control" formControlName="repeatPassword" 
                    type="password" name="repeatNewPassword"  id="repeatNewPasswordInput">
              </div>
              <button class="btn btn-primary mar-top-20">Change password</button>
            </form>
          </div>
        </div>
      </div>
    </section>
    `
})

export class ProfileComponent implements OnInit {

  @ViewChild('imageInput') public imageInput: ElementRef;

  public profileForm = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      avatar: new FormControl()
  });

  public changePasswordForm = new FormGroup({
        newPassword: new FormControl(),
        repeatPassword: new FormControl(),
        password: new FormControl()
  });

  public name: string;
    public email: string;
    public avatar: string;
    public avatarData: any;

    public oldPassword: string;
    public newPassword: string;
    public repeatNewPassword: string;

  constructor(private userService: UserService, private sessionService: SessionService,
              private renderer: Renderer) {  }

    public updateUser() {
        this.userService.update(this.email, this.name, this.avatarData);
        if (this.avatarData) {
          this.avatarData = undefined;
        }
    }

    public ngOnInit () {
        this.sessionService.subject.subscribe((user) => {
            this.name = user.profile.name;
            this.email = user.profile.email;
            this.avatar = user.profile.avatar;
        });
    }

    public changePassword() {
        if (this.newPassword === this.repeatNewPassword) {
        this.userService.changePassword(this.oldPassword, this.newPassword);
        }
    }

    public showImageBrowseDialog() {
        this.renderer.invokeElementMethod(this.imageInput.nativeElement, 'click', []);
    }

    public changeListener($event): void {
        this.readThis($event.target);
    }

    public readThis(inputValue: any): void {
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
