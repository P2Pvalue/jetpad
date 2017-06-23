import { Component, Input } from '@angular/core';

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
                    <button class="btn btn-link btn-warning" *ngIf="!user">
                        <a routerLink="/login">Login</a>
                    </button>
                </li>
                <li>
                    <button class="btn btn-link" *ngIf="!user">
                        <a routerLink="/register">Register</a>
                    </button>
                </li>
                <li>
                    <button class="btn btn-link" *ngIf="user">
                        <a routerLink="/profile">Profile</a>
                    </button>
                </li>
                <li>
                    <button class="btn btn-link" *ngIf="user">
                        <a routerLink="/logout">Logout</a>
                    </button>
                </li>
            </ul>
        </div>
    </nav>
    `
})

export class SiteHeaderComponent {

  @Input() public user: any;

}
