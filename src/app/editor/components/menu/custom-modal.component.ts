import {Modal} from "../../../core/services/jetpad-modal.service";
import {Component, OnInit} from "@angular/core";
@Component({
  selector: "my-custom-modal",
  template: `
    <div class="my-custom-modal">
        <h1>Modal (todo)</h1>
        <button (click)="onCancel()">×</button>
        <ul>
          <li *ngFor="let snack of snacks">{{snack}}</li>
          <li *ngFor="let cap of capullo">{{cap.text}}</li>
        </ul>
        <div>
            <button (click)="onCancel()">
                <span>Cancel</span>
            </button>
            <button  class="btn btn-success" (click)="onOk()">
                <span>Ok</span>
            </button>
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
    }
    
  `
  ]
})

@Modal()
export class MyCustomModalComponent implements OnInit {

  private currentState: string = 'inactive';
  ok: Function;
  destroy: Function;
  closeModal: Function;
  parentHeight: number;
  snacks = ["newyorkers", "mars", "snickers"];

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
}
