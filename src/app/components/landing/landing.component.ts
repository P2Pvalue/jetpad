import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing',
  template: `

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12 text-center bg-blue-gradient">
            <h2>Create a document and collaborate with</h2>
            <h2>real-time with others</h2>
            <form class="panel-body" (ngSubmit)="openDocument(documentId);" #documentIdForm="ngForm">
              <div class="col-md-8 col-md-offset-2">
                <div class="form-group">
                  <input [(ngModel)]="documentId" placeholder="Document ID here" name="documentId" #documentIdInput required class="form-control" id="documentIdInput">
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
          <div class="col-md-8">
            <img class="center-block" src="assets/img/computer.png" alt="" style="margin-top: -115px; margin-left: -15px;">
          </div>
          <div class="col-md-4 sm-text-center">
            <h4>Edit a document in a group simultaneosly</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Cras tincidunt magna elit, sagittis convallis lacus ornare nec.
              Nulla aliquet metus non quam facilisis tincidunt eagittis
              convallis lacus ornare nec.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row row-eq-height">
          <div class="col-xs-6 bg-orange-gradient text-center">
            <h4 class="text-normal">
              <span class="icon-23 bottom-left"></span>
              Create a public document for<br/>everyone on internet.
            </h4>
          </div>
          <div class="col-xs-6 bg-orange-gradient text-center">
            <h4 class="text-normal">
              <span class="icon-share top-right"></span>
              Manage your private documents<br/>and share with others.
            </h4>
          </div>
        </div>
      </div>
    </section>

    <section style="padding: 40px 0px;">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12 text-center">
            <h3 class="big text-muted text-uppercase">Why JetPad?</h3>
          </div>
          <div class="col-xs-12 col-md-4 text-center">
            <h4>
              <span class="icon-tick-check"></span>
              Privacy
            </h4>
            <p class="padding">
              JetPad.net respects your privacy: only stores documents.
              We will never use or give your contents to others.
            </p>
          </div>
          <div class="col-xs-12 col-md-4 text-center">
            <h4>
              <span class="icon-tick-check"></span>
              Innovation
            </h4>
            <p class="padding">
              We are an Open Source project.
            </p>
            <p class="padding">
              Anyone can extend, adapt or improve JetPad. Contribute now,
              visit our GitHub repo.
            </p>
          </div>
          <div class="col-xs-12 col-md-4 text-center">
            <h4>
              <span class="icon-tick-check"></span>
              Internet Freedom
            </h4>
            <p class="padding">
              JetPad gives you freedom to install yer with others to
              keep collaborating together.
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
