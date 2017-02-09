import {Modal} from "../../../core/services/jetpad-modal.service";
import {Component, OnInit} from "@angular/core";
@Component({
  selector: "my-custom-modal",
  template: `
    <div class="my-custom-modal">
        <h1>Modal (todo)</h1>
        <button (click)="onCancel()">×</button>
        <div class="custom-modal-content">
          <ul>
            <li *ngFor="let snack of snacks" (click) = onSelect(snack)>{{snack}}</li>
            <li *ngFor="let cap of capullo" (click) = onSelect(cap.text)>{{cap.text}}</li>
          </ul> 
        </div>
       
        <div class="btn-group btn-group-lg btn-group-justified" role="group">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-danger" (click)="onCancel()">Cancel</button>
          </div>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-success" (click)="onOk()">Ok</button>
          </div>
        </div>
    </div>
    `,
  styles:[`
    .my-custom-modal > button {
      position: absolute;
      top: 4px;
      right: 4px;
    }
    .my-custom-modal > h1 {
      text-align: center;
      border-bottom: groove #7F7F7F;
      margin: 10px 5px;
    }
    .my-custom-modal > .custom-modal-content {
      overflow-y: scroll;
      position: absolute;
      height: 70%;
      width: 100%;
    }
    .my-custom-modal > .btn-group {
      position: fixed;
      margin: 5px 0;
      padding: 0 5px;
      bottom: 0;
    }
    .my-custom-modal > .btn-group > .btn-group > .btn-danger {
      padding-right: 2px;
    }
    .my-custom-modal > .btn-group > .btn-group > .btn-success {
      padding-left: 2px;
    }
  `
  ]
})

@Modal()
export class MyCustomModalComponent implements OnInit {

  private currentState: string = 'inactive';
  ok: Function;
  select: Function;
  destroy: Function;
  closeModal: Function;
  parentHeight: number;
  snacks = ["newyorkers", "mars", "snickers", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno", "uno"];

  ngOnInit(): void {
    this.currentState = 'active';
  }

  onCancel(): void{
    this.currentState = 'inactive';
    //console.log(this.parentHeight);
    setTimeout(() => {
      this.closeModal();
    }, 150);
  }

  onOk(): void{
    this.currentState = 'inactive';
    setTimeout(() => {
      this.closeModal();
    }, 150);
    this.ok(this.snacks);
  }

  onSelect(hola:string): void {
    this.select(hola);
  }
}
