import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserPanelComponent } from '../user-panel';
import { SwellRTService } from '../services';

@Component({
    selector: 'app-landing',
    template: `
    <div class="row">

      <!-- <div class="col-md-3">
        <app-user-panel #userPanel></app-user-panel>
      </div>

      <div class="col-md-6 col-md-offset-1"> -->

        <div class="alert alert-dismissible alert-danger" *ngIf="wasError">
          <button type="button" class="close" data-dismiss="alert" (click)="wasError = false">×</button>
          <strong>{{msgError}}</strong>
        </div>

        <div class="panel panel-default text-center">
          <div class="panel-body">
              <div class="col-md-4 col-md-offset-1">
                <img height="200" class="center-block" src="assets/img/landing_1.jpg" alt="">            
              </div>
              <div class="col-md-6">
                <h4>Your online document editor</h4>
                <br>
                <p>
                  Write documents from any Web browser.<br>
                  Use styles, pictures and tables.
                </p>            
              </div>
          </div>
          <div class="panel-body">
            <div class="col-md-4 col-md-offset-1">
              <h4>Your online document editor</h4>
              <br>
              <p>
                Write documents from any Web browser.<br>
                Use styles, pictures and tables.
              </p>            
            </div>
            <div class="col-md-6">
              <img height="200" class="center-block" src="assets/img/landing_1.jpg" alt="">            
            </div>  
          </div>
          <div class="panel-body">
              <div class="col-md-4 col-md-offset-1">
                <img height="200" class="center-block" src="assets/img/landing_1.jpg" alt="">            
              </div>
              <div class="col-md-6">
                <h4>Your online document editor</h4>
                <br>
                <p>
                  Write documents from any Web browser.<br>
                  Use styles, pictures and tables.
                </p>            
              </div>
          </div>
          <div class="panel-body">
            <div class="col-md-4 col-md-offset-1">
              <h4>Your online document editor</h4>
              <br>
              <p>
                Write documents from any Web browser.<br>
                Use styles, pictures and tables.
              </p>            
            </div>
            <div class="col-md-6">
              <img height="200" class="center-block" src="assets/img/landing_1.jpg" alt="">            
            </div>  
          </div>
        </div>

        <!--<div class="panel panel-default">
          <form class="panel-body" (ngSubmit)="openDocument(documentId);" #documentIdForm="ngForm">
            <a (click)="documentIdInput.focus()"><h3>Open a Document</h3></a>
            <p>
              Do you have a shared document ID? Use it to open the document again...
            </p>

            <div class="form-group label-floating">
              <label class="control-label" for="documentIdInput">Document ID here</label>
              <input [(ngModel)]="documentId" name="documentId" #documentIdInput required class="form-control" id="documentIdInput">
            </div>

            <button class="btn btn-primary pull-right" [disabled]="!documentIdForm.form.valid">Open</button>
          </form>
        </div>-->

      <!--</div>-->

    </div>
    <app-footer></app-footer>
    `,

    directives: [UserPanelComponent]
  })



export class LandingComponent {

  wasError: boolean = false;
  msgError: string;

  constructor(private swellrt: SwellRTService, private router: Router) {
   }

  createDocument() {
    let randomId = btoa(Math.random().toString(36)).replace(/=/g, '');
    this.openDocument(randomId);
  }

  openDocument(_id: string) {
    if (!_id) {
      this.msgError = 'Write a name for the pad.';
      this.wasError = true;
      return;
    }
    this.wasError = false;
    let link = ['edit', _id ];
    this.router.navigate(link);
  }

}
