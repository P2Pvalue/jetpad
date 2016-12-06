import {Component} from "@angular/core";

@Component({
  selector: 'app-footer',
  template: `
        <footer>
          <section class="collaborators">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-12 text-center">
                  <h3 class="text-muted text-uppercase">Supported by</h3>
                </div>

                <div class="col-xs-4 col-sm-2 col-sm-offset-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/ucm_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/p2pvalue_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/grasia_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 text-center img-wrapper">
                  <img class="center-block vertical-middle" src="assets/img/medialab_prado_logo.png" alt="">
                </div>
                <div class="col-xs-4 col-sm-2 col-sm-offset-3 col-xs-offset-5 text-center img-wrapper">
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

            <div class="col-xs-6 col-md-2 col-md-offset-1 img-wrapper text-center">
              <h3>Built with</h3>
              <!-- <a href="http://swellrt.org/"> -->
                <img class="center-block vertical-bottom" height="80px" src="assets/img/swellrt-logo-small-vertical.png" alt="">
              <!-- </a> -->
            </div>
            <div class="col-xs-6 col-md-2 img-wrapper text-center">
                <h3>Get the code</h3>
                <!-- <a href="https://github.com/P2Pvalue"> -->
                <img class="center-block vertical-bottom " height="60px" src="assets/img/github-mark.png" alt="">
              <!-- </a> -->
            </div>
            <div class="col-xs-6 col-xs-offset-0 col-md-2 col-md-offset-3 sm-text-center">
              <h3>Jetpad</h3>
              <ul class="footer-links">
                <li><a [routerLink]=" ['./'] ">Home</a></li>
                <!--
                <li><a [routerLink]=" ['./vision'] ">Vision and History</a></li>
                -->
                <li><a [routerLink]=" ['./'] ">Login</a></li>
                <li><a [routerLink]=" ['./'] ">Register</a></li>
              </ul>
            </div>
            <div class="col-xs-6 col-md-2 sm-text-center">
              <h3>Contact with us</h3>
              <ul class="footer-links">
                <li><a [routerLink]=" ['./'] ">@getjetpad</a></li>
                <!--
                <li><a [routerLink]=" ['./'] ">GitHub</a></li>
                -->
              </ul>
            </div>
            <div class="col-xs-12 text-center mar-top-30">
              <p>
                <span>
                  Jetpad software is licensed under
                  <a>GNU Affero General Public License, version 3.</a>
                </span>
                <span>
                  jetpad.net is a service provided with no warranty under the following
                  <a [routerLink]=" ['./terms'] ">Terms of Use.</a>
                </span>
              </p>
            </div>
          </nav>
        </footer>
        `
})

export class FooterComponent {}
