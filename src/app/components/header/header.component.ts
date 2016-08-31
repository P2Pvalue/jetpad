import {Component, ElementRef, ViewChild} from "@angular/core";

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
            </div>
            <nav class="navbar navbar-default">
              <div class="container-fluid">
                <div class="navbar-header">
                  <a class="navbar-brand" [routerLink]=" ['./'] "><b>Jetpad</b></a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul class="nav navbar-nav navbar-right">
                    <li><app-user-panel></app-user-panel></li>
                    <li><span class="glyphicon glyphicon-menu-hamburger lateral-menu-button navbar-brand" 
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

  constructor() {}

  openLateralMenu() {
    this.changeLateralMenuWidth("33%");
  }

  closeLateralMenu() {
    this.changeLateralMenuWidth("0");
  }

  changeLateralMenuWidth(width: string) {
    this.lateralMenu.nativeElement.style.width = width;
  }
}
