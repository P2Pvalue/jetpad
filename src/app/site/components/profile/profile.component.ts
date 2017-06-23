import { Component, OnInit } from '@angular/core';
import { SessionService, UserService } from '../../../core/services';

@Component({
    selector: 'jp-profile',
    template: `
    <div class="row">
        <div class="col-sm-12">
            <h2 class="text-center">My profile</h2>
            <hr/>
        </div>
    </div>
    
    <div class="row">
        <div class="col-sm-4 col-sm-offset-1">
            <h3>
                <i class="icon icon-user icon-middle"></i>
                User information
                <hr/>
            </h3>
            <jp-user-form (updateUser)="onUpdateUser($event)"></jp-user-form>
        </div>
        <div class="col-sm-4 col-sm-offset-2">
            <h3>
                <i class="icon icon-lock icon-middle"></i>
                Change your password
                <hr/>
            </h3>
            <jp-change-password [success]="changePasswordSuccess"
                (newPassword)="onChangePassword($event)"></jp-change-password>
        </div>
    </div>
    `
})

export class ProfileComponent implements OnInit {

    public changePasswordSuccess: boolean;

    constructor(private userService: UserService, private sessionService: SessionService) {  }

    public ngOnInit () {
        this.changePasswordSuccess = false;
    }

    public onChangePassword(user) {
        debugger
        this.userService.changePassword(user.pass, user.newPass)
            .subscribe(() => {
                this.changePasswordSuccess = true;
            });
    }

    public onUpdateUser(user) {
        this.userService.update(user.email, user.name, user.avatarData);
    }
}
