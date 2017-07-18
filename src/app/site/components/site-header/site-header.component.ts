import { Component, Input } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalComponent } from '../../../share/components/alert-modal.component';
import { SiteModule } from '../../site.module';
import { JetpadModalService } from '../../../core/services/jetpad-modal.service';
import { UsersModalComponent } from '../../../share/components/users-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'jp-site-header',
  template: `
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" 
                data-toggle="collapse" data-target=".navbar-responsive-collapse" 
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

        <div class="collapse navbar-collapse navbar-responsive-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li [ngClass]="{'active': page == 'login'}">
                    <button class="btn btn-link btn-default" *ngIf="!user"
                        routerLink="/login">
                        Login
                    </button>
                </li>
                <li [ngClass]="{'active': page == 'register'}">
                    <button class="btn btn-link  btn-default" *ngIf="!user"
                        routerLink="/register">
                        Register
                    </button>
                </li>
                <li [ngClass]="{'active': page == 'profile'}">
                    <button class="btn btn-link  btn-default" *ngIf="user"
                        routerLink="/profile">
                        Profile
                    </button>
                </li>
                <li [ngClass]="{'active': page == 'documents'}">
                    <button class="btn btn-link  btn-default" *ngIf="user"
                        routerLink="/documents">
                        My documents
                    </button>
                </li>
                <li [ngClass]="{'active': page == 'groups'}">
                    <button class="btn btn-link  btn-default" *ngIf="user"
                        routerLink="/groups">
                        My groups
                    </button>
                </li>
                <li class="account">
                    <button class="btn btn-raised" *ngIf="user"
                        (click)="accounts()" data-toggle="collapse"
                        data-target=".navbar-collapse">
                        <span class="visible-xs">Account</span>
                        <i class="material-icons">person</i>
                    </button>
                </li>
            </ul>
        </div>
    </nav>
    `,
    styles: [`
        .active > button {
            color: white;
        }
    `]
})

export class SiteHeaderComponent {

  @Input() public user: any;
  public message: string = '';
  public page: string;

    private alertModal: any;
    private accountModal: any;

  constructor(private userService: UserService,
              private modalService: JetpadModalService,
              public route: ActivatedRoute,
              private router: Router) {
      this.route.url.subscribe((paths) => {
          if (paths && paths[0]) {
              this.page = paths[0].path;
          } else {
              this.page = '';
          }
      });
  }

  public accounts() {
      this.userService.getUsers()
          .subscribe((result) => {
              console.log('accounts', result);
              let modal$ = this.modalService.create(SiteModule, UsersModalComponent, {
                  accounts: result,
                  logout: (account) => {
                      this.userService.logout(account.id);
                      this.accountModal.destroy();
                      this.accountModal = undefined;
                      this.router.navigate(['/']);
                  },
                  accountSelected: (account) => {
                      this.router.navigate(['/profile']);
                  },
                  ok: (event) => {
                      if (!event || (event && event.type === 'close')) {
                          this.accountModal.destroy();
                          this.accountModal = undefined;
                      }
                      this.router.navigate(['/register']);
                  }
              });
              modal$.subscribe((modal) => {
                  this.accountModal = modal;
              });
          });
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
