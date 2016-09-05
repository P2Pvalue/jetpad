import { Component } from "@angular/core";
import { UserService, DocumentService } from "../../services";
import { Router } from "@angular/router";

@Component({
  selector: 'app-lateral-menu',
  template: `
        <div>
          <!-- Logged In user -->
          <div class="media" *ngIf="currentUser && !currentUser.anonymous">
            <div>
              <div class="col-md-3 col-md-offset-1">Name</div>
              <div class="col-md-3 col-md-offset-1">Participants</div>
              <div class="col-md-3 col-md-offset-1">Last edit</div>
            </div>
            <br>
            <div *ngFor="let document of documents">
              <div class="col-md-3 col-md-offset-1">
                <a (click)="openDocument(document.wave_id);">{{ document.root["doc-title"] }}</a>
              </div>
              <!--<div class="col-md-3 col-md-offset-1">Participants</div>
              <div class="col-md-3 col-md-offset-1">Last edit</div>-->
            </div>
          </div>
          <!-- Not Logged In user -->
          <div  *ngIf="!currentUser || currentUser.anonymous">
            <h5 class="lateral-menu-title text-center">If you want have a list of your documents you must to login</h5>
            <div class="col-md-3 col-md-offset-2">
              <button type="button" class="btn btn-default lateral-menu-button" [routerLink]=" ['/authentication'] ">Login</button>
            </div>
            <div class="col-md-3 col-md-offset-2">
              <button type="button" class="btn btn-default lateral-menu-button" [routerLink]=" ['/authentication'] ">Register</button>
            </div>
          </div>
        </div>
    `
})

export class LateralMenuComponent {

  // The logged in user
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

  openDocument(url: string) {
    let link = ['edit', url.substr(url.indexOf('/') + 1)];
    this.router.navigate(link);
  }
}
