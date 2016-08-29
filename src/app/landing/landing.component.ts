import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing',
  template: `
    <div class="row">
        <div class="alert alert-dismissible alert-danger" *ngIf="wasError">
          <button type="button" class="close" data-dismiss="alert" (click)="wasError = false">×</button>
          <strong>{{msgError}}</strong>
        </div>
        
        <nav class="navbar navbar-default text-center">
          <h2>Create a document and collaborate with</h2>
          <h2>others!</h2>
          <form class="panel-body" (ngSubmit)="openDocument(documentId);" #documentIdForm="ngForm">
            <div class="col-md-4 col-md-offset-4">
            <div class="form-group input-group">
              <input [(ngModel)]="documentId" placeholder="Document ID here" name="documentId" #documentIdInput required class="form-control" id="documentIdInput">
              <span class="input-group-btn">
                <button class="btn btn-default" [disabled]="!documentIdForm.form.valid">Create</button>
              </span>
            </div>
            </div>            
          </form>
        </nav>

        <div class="panel panel-default text-center">
          <div class="panel-body">
              <div class="col-md-4 col-md-offset-1">
                <img height="200" class="center-block" src="assets/img/landing_1.png" alt="">            
              </div>
              <div class="col-md-6">
                <h4>Your online document editor</h4>
                <br>
                <p>
                  Write documents from any Web browser<br>
                  Use styles, pictures and tables
                </p>            
              </div>
          </div>
          <div class="panel-body">
            <div class="col-md-4 col-md-offset-1">
              <h4>Write documents in group</h4>
              <br>
              <p>
                See others writing in real-time<br>
                Make text comments<br>
                Review individual change history
              </p>            
            </div>
            <div class="col-md-6">
              <img height="200" class="center-block" src="assets/img/landing_2.png" alt="">            
            </div>  
          </div>
          <div class="panel-body">
              <div class="col-md-4 col-md-offset-1">
                <img height="200" class="center-block" src="assets/img/landing_3.png" alt="">            
              </div>
              <div class="col-md-6">
                <h4>Free and Open Source</h4>
                <br>
                <p>
                  Improve and adapt JetPad or install your<br>
                  own server
                </p>            
              </div>
          </div>
          <div class="panel-body">
            <div class="col-md-4 col-md-offset-1">
              <h4>We respect your privacy</h4>
              <br>
              <p>
                We don't use your data in any case
              </p>            
            </div>
            <div class="col-md-6">
              <img height="200" class="center-block" src="assets/img/landing_4.png" alt="">            
            </div>  
          </div>
        </div>
    </div>
    <app-footer></app-footer>
    `
})


export class LandingComponent {

  wasError: boolean = false;
  msgError: string;

  constructor(private router: Router) {
  }

  openDocument(_id: string) {
    if (!_id) {
      this.msgError = 'Write a name for the pad.';
      this.wasError = true;
      return;
    }
    this.wasError = false;
    let link = ['edit', _id];
    this.router.navigate(link);
  }

}
