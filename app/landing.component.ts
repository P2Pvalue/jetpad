import { Component } from 'angular2/core';
import { Router } from 'angular2/router';
import { UserPanelComponent } from './user-panel.component';
import { SwellRTService } from './service/swellrt.service';

@Component({
    selector: 'landing',
    template: `


    <div class="row">

      <div class="col-md-3">
        <user-panel></user-panel>
      </div>

      <div class="col-md-6 col-md-offset-1">

        <div class="alert alert-dismissible alert-danger" *ngIf="wasError">
          <button type="button" class="close" data-dismiss="alert" (click)="wasError = false">×</button>
          <strong>{{msgError}}</strong>
        </div>

        <div class="panel panel-default">
          <div class="panel-body">
            <a href="javascript:void(0)" (click)="createDocument()"><h3>Create a new Document</h3></a>
            <p>
              Write a document. Share and edit it with others.
            </p>
          </div>
        </div>

        <div class="panel panel-default">
          <div class="panel-body">
            <a href="javascript:void(0)" (click)="openDocument(documentId.value)"><h3>Open a Document</h3></a>
            <p>
              Do you have a shared document ID? Use it to open the document again...
            </p>

            <div class="form-group label-floating">
              <label class="control-label" for="documentIdInput">Document ID here</label>
              <input #documentId class="form-control" id="documentIdInput" type="text">
            </div>

            <a href="javascript:void(0)" (click)="openDocument(documentId.value)" class="btn btn-primary pull-right">Open</a>
          </div>
        </div>

        <div class="panel panel-default">
          <div class="panel-body">
            <a href="javascript:void(0)"><h3>Sign up</h3></a>
            <p>
              Take advantage of being a registered user of Papel.
              Manage all the documents you collaborate with on the cloud.
            </p>
          </div>
        </div>

      </div>

    </div>
    `,

    directives:[UserPanelComponent]
  })



export class LandingComponent {

  wasError: boolean = false;
  msgError: string;

  constructor(private _swellrt: SwellRTService, private _router: Router) {
   }

  createDocument() {
    this.wasError = false;
  }

  openDocument(_id: string) {
    this.wasError = false;
    let link = ['EditDocument', { id: _id }];
   this._router.navigate(link);


  }

}
