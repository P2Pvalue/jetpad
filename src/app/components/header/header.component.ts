import {Component, ElementRef, ViewChild} from "@angular/core";
import {UserService, DocumentService} from "../../services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  template: `
        <header>

            <div #lateralMenu class="lateral-menu">
              
              <div class="clearfix no-gutter">
                <div class="col-sm-12 text-right">
                  <div class="close-button" (click)="closeLateralMenu()">
                    <i class="icon icon-cross"></i>
                  </div>
                </div>
              </div>
              <div class="clearfix container">
                <div class="col-sm-12">
                  <h4 class="lateral-menu-title">My documents</h4>
                  <hr>
                </div>
              </div>

              <div class="clearfix container">
                <!-- Logged In user -->
                <div *ngIf="currentUser && !currentUser.anonymous">
                  <div class="form clearfix">
                    <div class="col-sm-4">
                      <div class="input-select">
                        <select [(ngModel)]="order" name="order-by" id="order-by" class="form-control">
                          <option value="" selected>Order by ...</option>
                          <option value="title">Name</option>
                          <option value="authorId">Author</option>
                          <option value="timestamp">Last edit</option>
                        </select>
                        <i class="icon icon-arrow-down" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div class="col-sm-4 col-sm-offset-4">
                      <div class="form-group has-feedback">
                        <input class="form-control documents-list" type="text" placeholder="Search document" [(ngModel)]="filter">
                        <i class="icon icon-search form-control-feedback" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>

                  <div class="clearfix">
                    <div class="col-sm-12">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Participants</th>
                            <th>Last edit</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let document of documents | search:filter | order:order">
                            <td class="with-icon">
                              <i class="icon icon-share icon-middle cursor-pointer" ngIIclipboard [cbContent]="document.documentUrl" aria-hidden="true"></i>
                            </td>
                            <td>
                              <a class="documents-title" (click)="openDocument(document.editorId);">{{ document.title }}</a>
                            </td>
                            <td>
                              <div class="author" *ngIf="document.author">
                                <app-user-icon [user]="document.author"></app-user-icon>
                              </div>
                              <div class="contributors" *ngFor="let participant of document.participants | slice:0:3">
                                <app-user-icon [user]="participant"></app-user-icon>
                              </div>
                              <div class="view-more" *ngIf="document.participants.length > 3">
                                <i class="icon icon-dots icon-middle cursor-pointer" aria-hidden="true"></i>
                                <div class="drowdown-box">
                                  <div class="contributors" *ngFor="let participant of document.participants | slice:3">
                                    <app-user-icon [user]="participant"></app-user-icon>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              {{ document.modification }}
                            </td>
                            <td class="with-icon">
                              <!-- TODO: You can't delete documents on the server
                              <i *ngIf="currentUser.id === document.author" class="icon icon-close icon-middle cursor-pointer" aria-hidden="true"></i>
                              -->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
                <!-- END Logged In user -->

                <!-- Not Logged In user -->
                <div *ngIf="!currentUser || currentUser.anonymous">
                  <div class="col-sm-12">
                    <p>If you want have a list of your documents you must to login</p>
                  </div>
                  <div class="col-sm-12">
                    <button type="button" class="btn btn-primary btn-lower btn-with-icon mar-top-20" (click)="goToAuthenticationScreen() ">
                      <i class="icon icon-lock icon-middle"></i> Login
                    </button>
                    <button type="button" class="btn btn-primary btn-lower btn-with-icon mar-top-20" (click)="goToAuthenticationScreen() ">
                      <i class="icon icon-user icon-middle"></i> Register
                    </button>
                  </div>
                </div>
                <!-- END Not Logged In user -->
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
  filter: any;
  order = '';

  documents = [];

  constructor(private userService: UserService, private documentService: DocumentService, private router: Router) {
    router.events.subscribe(() => {
      this.closeLateralMenu();
    });
    userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if(user.anonymous) {
        this.documents = [];
      }
    });
    documentService.myDocuments.subscribe(document => {
      let index = this.documents.findIndex(x => x.id === document.id);
      if(index > -1) {
        this.documents.splice(index, 1, document);
      } else {
        this.documents.push(document);
      }
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
    this.changeLateralMenuPosition("-70%");
  }

  changeLateralMenuPosition(percentage: string) {
    this.lateralMenu.nativeElement.style.right = percentage;
  }
}
