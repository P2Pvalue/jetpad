import { Component } from "@angular/core";
import { UserService, DocumentService } from "../../services";

@Component({
  selector: 'app-lateral-menu',
  template: `
        <div>
          <!-- Logged In user -->
          <div class="media" *ngIf="currentUser && !currentUser.anonymous">
            <h4>LOGGED USER! ;)</h4>
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

  constructor(private userService: UserService, private documentService: DocumentService) {
    userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if(!user.anonymous) {
        documentService.getMyDocuments();
      }
    });
  }
}
