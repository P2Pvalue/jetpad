import {Component, ElementRef, ViewChild} from "@angular/core";
import {UserService, DocumentService} from "../../services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  template: `
        <header>

            <div #lateralMenu class="lateral-menu">
              <div>
                <h4 class="lateral-menu-title text-center">MY DOCUMENTS</h4>
                <a href="javascript:void(0)" class="close-button" (click)="closeLateralMenu()">&times;</a>
              </div>
              <hr>
              <div>
                <!-- Logged In user -->
                <div class="clearfix" *ngIf="currentUser && !currentUser.anonymous">
                  <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                      <input class="form-control documents-list" type="text" [(ngModel)]="filter">
                    </div>
                  </div>
                  <br>
                  <div class="row documents-list">
                    <div class="col-md-3 col-md-offset-2">Name</div>
                    <div class="col-md-3 col-md-offset-1">Participants</div>
                    <div class="col-md-2 col-md-offset-1">Last edit</div>
                  </div>
                  <br>
                  <div *ngFor="let document of documents | search:filter | slice:0:15">
                    <div class="col-md-1 col-md-offset-1">
                      <small><span class="glyphicon glyphicon-share" aria-hidden="true"></span></small>
                      <small><span *ngIf="currentUser.id === document.author" class="glyphicon glyphicon-trash" aria-hidden="true"></span></small>
                    </div>
                    <div class="col-md-3">
                      <a class="documents-list" (click)="openDocument(document.editorId);">{{ document.title }}</a>
                    </div>
                    <div class="col-md-3 col-md-offset-1"><p class="documents-list">{{ document.participants }}</p></div>
                    <div class="col-md-2 col-md-offset-1"><p class="documents-list">{{ document.modification }}</p></div>
                  </div>
                </div>
                <!-- Not Logged In user -->
                <div  *ngIf="!currentUser || currentUser.anonymous">
                  <h5 class="lateral-menu-title text-center">If you want have a list of your documents you must to login</h5>
                  <div class="col-md-3 col-md-offset-3">
                    <button type="button" class="btn btn-default lateral-menu-button" (click)="goToAuthenticationScreen() ">Login</button>
                  </div>
                  <div class="col-md-3 col-md-offset-1">
                    <button type="button" class="btn btn-default lateral-menu-button" (click)="goToAuthenticationScreen() ">Register</button>
                  </div>
                </div>
              </div>
            </div>
            <nav class="navbar">
              <div class="container-fluid">
                <div class="navbar-header">
                  <a class="navbar-brand logo" [routerLink]=" ['./'] ">
                    <img alt="JET PAD" height="53" width="94" src="assets/img/jetpad-logo.png">
                  </a>
                </div>
                <div class="collapse navbar-collapse">
                  <ul class="nav navbar-nav navbar-right">
                    <li>
                      <app-user-panel></app-user-panel>
                    </li>
                    <li>
                      <span class="navbar-brand menu-icon" aria-hidden="true" (click)="openLateralMenu()">
                        <i class="icon icon-menu-vertical"></i>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

        </header>
        `
})

export class HeaderComponent {

  @ViewChild('lateralMenu') lateralMenu: ElementRef;

  currentUser: any;
  documents: any;
  filter:any;

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

  openDocument(editorId: string) {
    this.navigate(['edit', editorId]);
  }

  navigate(link) {
    this.closeLateralMenu();
    this.router.navigate(link);
  }

  openLateralMenu() {
    this.changeLateralMenuPosition("0");
  }

  closeLateralMenu() {
    this.changeLateralMenuPosition("-50%");
  }

  changeLateralMenuPosition(percentage: string) {
    this.lateralMenu.nativeElement.style.right = percentage;
  }
}
