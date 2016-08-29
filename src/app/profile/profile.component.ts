import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  template: `
    <div class="row">
        <div class="alert alert-dismissible alert-danger" *ngIf="wasError">
          <button type="button" class="close" data-dismiss="alert" (click)="wasError = false">×</button>
          <strong>{{msgError}}</strong>
        </div>
       

        <div class="panel panel-default text-center">
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


export class ProfileComponent {

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
