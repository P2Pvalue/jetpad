import { Component, OnInit } from '@angular/core';
import { SessionService, UserService } from '../../../core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jp-profile',
    template: `
    <div class="row profile-panel container-fluid">
        <jp-site-header [user]="user">
        
        </jp-site-header>
        <div class="row">
            <div class="col col-xs-12">
                <h3 clss="text-center">My profile</h3>
            </div>
        </div>
        
       
        <div class="row">            
            <div class="col col-sm-4 col-sm-offset-1 ">
                <div class="panel panel-default">
                    <div class="profile-subtitle">
                        <h4>
                            User information
                        </h4>
                        <i class="material-icons">person</i></div>
                    <hr/>
                    <jp-user-form [user]="user"
                                  [success]="updateUserSuccess"
                                  (updateUser)="onUpdateUser($event)"></jp-user-form>
                </div>
            </div>
            <div class="col col-sm-4 col-sm-offset-2">
                <div class="panel panel-default">
                    <div class="profile-subtitle">
                        <h4>
                            Change your password
                        </h4>
                        <i class="material-icons">lock</i>
                    </div>
                    <hr/>
                    <jp-change-password [success]="changePasswordSuccess"
                            (newPassword)="onChangePassword($event)"></jp-change-password>
                </div>
              
            </div>
        </div>
    </div>
    `
})

export class ProfileComponent implements OnInit {

    public user: any;

    public changePasswordSuccess: boolean;
    public updateUserSuccess: boolean;

    constructor(public userService: UserService, private route: ActivatedRoute) {  }

    public ngOnInit () {
        this.user = this.route.snapshot.data['user'];
        this.changePasswordSuccess = false;
        this.updateUserSuccess = false;
    }

    public onChangePassword(user) {
        this.userService.changePassword(user.pass, user.newPass)
            .subscribe(() => {
                this.changePasswordSuccess = true;
            });
    }

    public onUpdateUser(user) {
        this.userService.update(user.id, user)
            .subscribe((u) => {
                this.user = u;
                this.updateUserSuccess = true;
            });
    }
}
