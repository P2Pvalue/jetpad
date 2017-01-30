import {Component, ElementRef, ViewChild, Renderer} from "@angular/core";
import { UserService } from "../../../core/services";

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
            <form (ngSubmit)="updateUser()">
              <div class="form-group">
                <label for="image_src">Photo</label>
                <div class="media">
                  <div class="media-left">
                    <img src="assets/img/user-mask.png" class="user-mask" />
                    <img height="130" id="img" src="{{avatar}}" />
                  </div>
                  <div class="media-body media-middle">
                    <input #imageInput type="file" accept="image/*" name="image_src" id="image_src" class="input-file" (change)="changeListener($event)"/>
                    <span class="input-btn" (click)="showImageBrowseDialog()">
                      <i class="icon icon-image icon-middle"></i>Upload a file
                    </span>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="control-label" for="nameInput">Name</label>
                <input class="form-control" id="nameInput" name="name" [(ngModel)]="name">
              </div>
              <div class="form-group">
                <label class="control-label" for="emailInput">
                  Email
                  <span>(optional, you could recieved notifications about your documents)</span>
                </label>
                <input class="form-control" id="emailInput" name="email" [(ngModel)]="email">
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
            <form style="margin-top:4em" (ngSubmit)="changePassword()">
              <div class="form-group label-floating">
                <label class="control-label" for="nameInput">Old Password</label>
                <input class="form-control" id="oldPasswordInput" type="password" name="oldPassword" [(ngModel)]="oldPassword">
              </div>
              <div class="form-group label-floating">
                <label class="control-label" for="emailInput">New password</label>
                <input class="form-control" id="newPasswordInput" type="password" name="newPassword" [(ngModel)]="newPassword">
              </div>
              <div class="form-group label-floating">
                <label class="control-label" for="emailInput">Repeat new password</label>
                <input class="form-control" id="repeatNewPasswordInput" type="password" name="repeatNewPassword" [(ngModel)]="repeatNewPassword">
              </div>
              <button class="btn btn-primary mar-top-20">Change password</button>
            </form>
          </div>
        </div>
      </div>
    </section>
    `
})


export class ProfileComponent {

  @ViewChild('imageInput') imageInput: ElementRef;

  name: string;
  email: string;
  avatar: string;
  avatarData: any;

  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;

  constructor(private userService: UserService, private renderer: Renderer) {
    this.name = userService.getUser().name;
    this.email = userService.getUser().email;
    this.avatar = userService.getUser().avatarUrl;
  }

  updateUser() {
    this.userService.update(this.email, this.name, this.avatarData);
    if(this.avatarData) {
      this.avatarData = undefined;
    }
  }

  changePassword() {
    if(this.newPassword === this.repeatNewPassword) {
      this.userService.changePassword(this.oldPassword, this.newPassword);
    }
  }

  showImageBrowseDialog() {
    this.renderer.invokeElementMethod(this.imageInput.nativeElement, 'click', []);
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any) : void {
    var file: File = inputValue.files[0];
    var fileReader: FileReader = new FileReader();
    var that = this;
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      that.avatarData = fileReader.result;
      that.avatar = fileReader.result;
    }
  }
}
