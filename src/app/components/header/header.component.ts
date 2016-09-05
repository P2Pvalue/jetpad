import {Component, ElementRef, ViewChild} from "@angular/core";
import {UserService, DocumentService} from "../../services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  template: `
        <header>
          <div class="row">
            <div #lateralMenu class="lateral-menu">
              <div>
                <h4 class="lateral-menu-title text-center">MY DOCUMENTS</h4>
                <a href="javascript:void(0)" class="close-button" (click)="closeLateralMenu()">&times;</a>
              </div>
              <hr>
              <div>
                <!-- Logged In user -->
                <div class="media" *ngIf="currentUser && !currentUser.anonymous">
                  <div>
                    <div class="col-md-4 col-md-offset-1">Name</div>
                    <div class="col-md-3 col-md-offset-1">Participants</div>
                    <div class="col-md-2 col-md-offset-1">Last edit</div>
                  </div>
                  <br>
                  <div *ngFor="let document of documents">
                    <div class="col-md-4 col-md-offset-1">
                      <a (click)="openDocument(document.wave_id);">{{ document.root["doc-title"] }}</a>
                    </div>
                    <div class="col-md-3 col-md-offset-1">Participants</div>
                    <div class="col-md-2 col-md-offset-1">Last edit</div>
                  </div>
                </div>
                <!-- Not Logged In user -->
                <div  *ngIf="!currentUser || currentUser.anonymous">
                  <h5 class="lateral-menu-title text-center">If you want have a list of your documents you must to login</h5>
                  <div class="col-md-3 col-md-offset-2">
                    <button type="button" class="btn btn-default lateral-menu-button" (click)="goToAuthenticationScreen() ">Login</button>
                  </div>
                  <div class="col-md-3 col-md-offset-2">
                    <button type="button" class="btn btn-default lateral-menu-button" (click)="goToAuthenticationScreen() ">Register</button>
                  </div>
                </div>
              </div>
            </div>
            <nav class="navbar navbar-default">
              <div class="container-fluid">
                <div class="navbar-header">
                  <a class="navbar-brand" [routerLink]=" ['./'] "><b>Jetpad</b></a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul class="nav navbar-nav navbar-right">
                    <li><app-user-panel></app-user-panel></li>
                    <li><span class="glyphicon glyphicon-menu-hamburger link-cursor navbar-brand" 
                              aria-hidden="true" (click)="openLateralMenu()"></span></li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </header>
        `
})

export class HeaderComponent {

  @ViewChild('lateralMenu') lateralMenu: ElementRef;

  currentUser: any;
  documents: any;

  constructor(private userService: UserService, private documentService: DocumentService, private router: Router) {
    userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    documentService.myDocuments.subscribe(documents => {
      this.documents = documents;
    });
  }

  goToAuthenticationScreen() {
    this.navigate(['authentication']);
  }

  openDocument(url: string) {
    this.navigate(['edit', url.substr(url.indexOf('/') + 1)]);
  }

  navigate(link) {
    this.closeLateralMenu();
    this.router.navigate(link);
  }

  openLateralMenu() {
    this.changeLateralMenuPosition("0");
  }

  closeLateralMenu() {
    this.changeLateralMenuPosition("-40%");
  }

  changeLateralMenuPosition(percentage: string) {
    this.lateralMenu.nativeElement.style.right = percentage;
  }
}
