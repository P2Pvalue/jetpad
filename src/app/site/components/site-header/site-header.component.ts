import { Component, Input } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { AlertModalComponent } from '../../../share/components/alert-modal.component';
import { SiteModule } from '../../site.module';
import { JetpadModalService } from '../../../core/services/jetpad-modal.service';

@Component({
  selector: 'jp-site-header',
  template: `
    <nav class="navbar navbar-default navbar-fixed-top navbar-inverse">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" 
                data-toggle="collapse" data-target="#jp-menu-collapse" 
                aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" routerLink="/">
                <img alt="Jetpad" height="40" src="assets/img/jetpad-logo.png">
            </a>
        </div>

        <div class="collapse navbar-collapse" id="jp-menu-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li>
                    <button class="btn btn-link btn-default">
                        <a routerLink="/">Open document</a>
                    </button>
                </li>
                <li>
                    <button class="btn btn-link btn-default" *ngIf="!user">
                        <a routerLink="/login">Login</a>
                    </button>
                </li>
                <li>
                    <button class="btn btn-link  btn-default" *ngIf="!user">
                        <a routerLink="/register">Register</a>
                    </button>
                </li>
                <li>
                    <button class="btn btn-link  btn-default" *ngIf="user">
                        <a routerLink="/profile">Profile</a>
                    </button>
                </li>
                <li>
                    <button class="btn btn-link  btn-default" *ngIf="user">
                        <a routerLink="/documents">My Documents</a>
                    </button>
                </li>
                <li>
                    <button class="btn btn-link  btn-default" *ngIf="user">
                        <a (click)="logout()" data-toggle="collapse" 
                            href="#jp-menu-collapse">Logout</a>
                    </button>
                </li>
            </ul>
        </div>
    </nav>
    `
})

export class SiteHeaderComponent {

  @Input() public user: any;
  public message: string = '';

    private alertModal: any;

  constructor(private userService: UserService,
              private modalService: JetpadModalService,
              private router: Router) { }

  public logout() {
      this.userService.logout(this.user.id).subscribe(
          () => console.debug('User logged out'),
          (error) => {
              this.message = 'Logout Error';
              this.showAlertModal();
          });
      this.router.navigate(['/']);
  }

    public showAlertModal() {
        if (this.alertModal) {
            this.alertModal.destroy();
            this.alertModal = undefined;
        }
        let modal$ = this.modalService.create(SiteModule, AlertModalComponent, {
            message: this.message,
            ok: (event) => {

                if (!event || (event && event.type === 'close')) {
                    this.alertModal.destroy();
                    this.alertModal = undefined;
                }
            }
        });
        modal$.subscribe((modal) => {
            this.alertModal = modal;
        });
    }

}
