import {Component} from "@angular/core";

@Component({
  selector: 'app-footer',
  template: `
        <footer>
          <section class="collaborators">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-12 text-center">
                  <h3 class="text-muted text-uppercase">Team and Collaborators</h3>
                  <p>
                    JetPad es un grupo heterog&eacute;neo de programadores. Ingenieros,
                    dise&ntilde;adores, tecn&oacute;logos, soci&oacute;logos, investigadores,
                    marketers y activistas…
                    <br/>
                    La idea inicial ha sido desarrollada dentro del
                    proyecto de investigaci&oacute;n europeo P2Pvalue y del proyecto SwellRT
                  </p>
                </div>
                <div class="col-xs-4 col-sm-2 col-sm-offset-1 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/ucm_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/p2pvalue_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/grasia_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/surrey_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/p2pf_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 col-sm-offset-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/medialab_prado_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/techhub_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/devialab_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/redecentralize_logo.png" alt="">
                </div>
              </div>
            </div>
          </section>
          <section>
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-12 text-center bg-blue-gradient">
                  <h3>Subscribe to our newsletter</h3>
                  <form class="panel-body" #emailForm="ngForm">
                    <div class="col-md-8 col-md-offset-2">
                    <div class="form-group">
                      <input [(ngModel)]="email" placeholder="E-mail" name="email" #emailInput required class="form-control" id="emailInput">
                    </div>
                    <button class="btn btn-primary btn-lg no-margin" [disabled]="!emailForm.form.valid">Subscribe</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
          <nav class="navbar">
            <div class="col-xs-6 col-md-2 col-md-offset-1 img-wrapper mar-top-50">
              <!-- <a href="http://swellrt.org/"> -->
                <img class="center-block vertical-middle" src="assets/img/swellrt_logo_text.png" alt="">
              <!-- </a> -->
            </div>
            <div class="col-xs-6 col-md-2 img-wrapper mar-top-50">
              <!-- <a href="https://github.com/P2Pvalue"> -->
                <img class="center-block" src="assets/img/github_logo_text.png" alt="">
              <!-- </a> -->
            </div>
            <div class="col-xs-6 col-xs-offset-0 col-md-2 col-md-offset-3 sm-text-center">
              <h3>Jetpad</h3>
              <ul class="footer-links">
                <li><a [routerLink]=" ['./'] ">Home</a></li>
                <li><a [routerLink]=" ['./vision'] ">Vision and History</a></li>
                <li><a [routerLink]=" ['./'] ">Login</a></li>
                <li><a [routerLink]=" ['./'] ">Register</a></li>
              </ul>
            </div>
            <div class="col-xs-6 col-md-2 sm-text-center">
              <h3>Contact with us</h3>
              <ul class="footer-links">
                <li><a [routerLink]=" ['./'] ">@twitterjetpad</a></li>
                <li><a [routerLink]=" ['./'] ">GitHub-Gitter</a></li>
              </ul>
            </div>
            <div class="col-xs-12 text-center mar-top-30">
              <p>
                <span>
                  JetPad software is licensed under
                  <a>GNU Affero General Public License, version 3.</a>
                </span>
                <span>
                  JetPad.org is a service provided with no warranty under the following
                  <a [routerLink]=" ['./terms'] ">Terms of Use.</a>
                </span>
              </p>
            </div>
          </nav>
        </footer>
        `
})

export class FooterComponent {}
