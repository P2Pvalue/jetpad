import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing',
  template: `

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12 text-center bg-blue-gradient">
            <h2>Create and share documents</h2>
            <h2>Collaborative editing in real-time</h2>
            <form class="panel-body" (ngSubmit)="openDocument(documentId);" #documentIdForm="ngForm">
              <div class="col-md-8 col-md-offset-2">
                <div class="form-group">
                  <input [(ngModel)]="documentId" placeholder="Document name" name="documentId" #documentIdInput required class="form-control" id="documentIdInput">
                </div>
                <button class="btn btn-primary btn-lg no-margin" [disabled]="!documentIdForm.form.valid">Open or Create</button>
              </div>
            </form>
            <p class="text-muted">No login required - Copy the URL to share</p>
          </div>
        </div>
      </div>
    </section>

    <section style="padding: 60px 0px 190px;">
      <div class="container-fluid">
        <div class="row">

          <carousel [interval]="3000">
            <slide>
              <div class="row" style="width: 100%;">
                <div class="col-md-8">
                  <img class="center-block" src="assets/img/computer.png" alt="" style="margin-top: -115px;">
                </div>
                <div class="col-md-4 sm-text-center">
                  <h3>Edit<br/>rich-text<br/>documents<br/></h3>
                  <br/>
                  <h3>Auto-generated<br/>table of contents<br/></h3>
                  <p>

                  </p>
                </div>
              </div>
            </slide>
            <slide>
              <div class="row" style="width: 100%;">
                <div class="col-md-8">
                  <img class="center-block" src="assets/img/computer.png" alt="" style="margin-top: -115px;">
                </div>
                <div class="col-md-4 sm-text-center">
                  <h3>Make<br/>comments,<br/><br/>discuss<br/>with your peers</h3>
                  <p>

                  </p>
                </div>
              </div>
            </slide>
            <slide>
              <div class="row" style="width: 100%;">
                <div class="col-md-8">
                  <img class="center-block" src="assets/img/computer.png" alt="" style="margin-top: -115px;">
                </div>
                <div class="col-md-4 sm-text-center">
                  <h3>Add<br/>pictures<br/>and<br/>tables</h3>
                  <p>

                  </p>
                </div>
              </div>
            </slide>
          </carousel>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row row-eq-height">
          <div class="col-xs-6 bg-orange-gradient text-center">
            <h3 class="text-normal">
              <span class="icon-23 bottom-left"></span>
              Create public documents<br/>on Internet
            </h3>
          </div>
          <div class="col-xs-6 bg-orange-gradient text-center">
            <h3 class="text-normal">
              <span class="icon-share top-right"></span>
              Manage private documents<br/>with sharing control
            </h3>
          </div>
        </div>
      </div>
    </section>

    <section style="padding: 40px 0px;">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12 text-center">
            <h3 class="text-muted text-uppercase">Why Jetpad?</h3>
          </div>
          <div class="col-xs-12 col-md-4 text-center">
            <h4>
              <span class="icon-tick-check"></span>
              Privacy
            </h4>
            <p class="padding">
              Jetpad.net respects your privacy:
            </p>
            <p class="padding">
              Your content will be never used by or shared with other services.
            </p>
          </div>
          <div class="col-xs-12 col-md-4 text-center">
            <h4>
              <span class="icon-tick-check"></span>
              Internet Freedom
            </h4>
            <p class="padding">
              Jetpad gives you the freedom to install it on your own server.
            </p>
            <p class="padding">
              Connect your server with others to keep collaborating together.
            </p>
          </div>
          <div class="col-xs-12 col-md-4 text-center">
            <h4>
              <span class="icon-tick-check"></span>
              Open Source
            </h4>
            <p class="padding">
              Jetpad is Open Source.
            </p>
            <p class="padding">
              Anyone can extend, adapt or improve Jetpad.
            </p>
            <p class="padding">
              Check out source code or contribute on <a href="https://github.com/P2Pvalue/swellrt-pad">GitHub</a>.
            </p>
          </div>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
    `
})


export class LandingComponent {

  constructor(private router: Router) {
  }

  openDocument(_id: string) {
    if (_id) {
      _id = _id.split(" ").join("-").substr(0, 64);
      let link = ['edit', _id];
      this.router.navigate(link);
    }
  }

}
