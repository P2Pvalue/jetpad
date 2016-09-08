import {Component, ElementRef, ViewChild, Renderer} from "@angular/core";
import { UserService } from "../../services";

@Component({
  selector: 'app-profile',
  template: `
    <div class="row">
        <div class="panel panel-default">
          <div class="panel-body text-center">
            <div class="col-md-4 col-md-offset-4">
              <h4>MY PROFILE</h4>
            </div>
          </div>
          <div class="panel-body">
            <div class="col-md-4 col-md-offset-4">
              <h5>USER INFORMATION</h5>
              <h6>Photo</h6>
              <img height="200" id="img" src="{{avatar}}" (click)="showImageBrowseDialog()"/>
              <input #imageInput type="file" name="image_src" id="image_src" (change)="changeListener($event)"/>
              <br>
              <form style="margin-top:4em" (ngSubmit)="updateUser()">
                <div class="form-group label-floating">
                  <label class="control-label" for="nameInput">Name</label>
                  <input class="form-control" id="nameInput" name="name" [(ngModel)]="name">
                </div>
                <div class="form-group label-floating">
                  <label class="control-label" for="emailInput">Email</label>
                  <input class="form-control" id="emailInput" name="email" [(ngModel)]="email">
                </div>
                <button class="btn btn-primary">Save</button>
              </form>
            </div>
           <div class="col-md-12"><hr></div>
           <div class="col-md-4 col-md-offset-4">
              <h5>CHANGE YOUR PASSWORD</h5>
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
                <button class="btn btn-primary">Change password</button>
              </form>
            </div>
          </div>
        </div>
    </div>
    <app-footer></app-footer>
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
    this.avatar = this.avatarData;
    this.avatarData = undefined;
  }

  changePassword() {
    if(this.newPassword === this.repeatNewPassword) {
      this.userService.changePassword(this.oldPassword, this.newPassword);
    }
  }

  showImageBrowseDialog() {
    let event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.imageInput.nativeElement, 'dispatchEvent', [event]);
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any) : void {
    var file: File = inputValue.files[0];
    var fileReader: FileReader = new FileReader();
    var that = this;
    fileReader.readAsDataURL(file);
    fileReader.onloadend = function(e){
      that.avatarData = fileReader.result;
    }
  }
}
