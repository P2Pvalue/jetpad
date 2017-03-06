import {Modal} from "../../../core/services/jetpad-modal.service";
import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'participants-modal',
    template:`
    <div class="participants-modal">
        <h1>List of document participants</h1>
        <button (click)="onCancel()">×</button>
        <div class="participants-modal-content">
          <ul>
            <li *ngFor="let participant of participants">
                <span>{{participant.name}}</span>
                <span>{{participant.sessionId}}</span>
            </li>
          </ul> 
        </div>
       
        <div class="btn-group btn-group-lg btn-group-justified" role="group">
          <!--<div class="btn-group" role="group">
            <button type="button" class="btn btn-danger" (click)="onCancel()">Cancel</button>
          </div>-->
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-success" (click)="onOk()">Ok</button>
          </div>
        </div>
    </div>
    `,
    styles:[`
    .participants-modal > button {
      position: absolute;
      top: 4px;
      right: 4px;
    }
    .participants-modal > h1 {
      text-align: center;
      border-bottom: groove #7F7F7F;
      margin: 10px 5px;
    }
    .participants-modal > .participants-modal-content {
      overflow-y: scroll;
      position: absolute;
      height: 70%;
      width: 100%;
    }
    .participants-modal > .btn-group {
      position: fixed;
      margin: 5px 0;
      padding: 0 5px;
      bottom: 0;
    }
    .participants-modal > .btn-group > .btn-group > .btn-danger {
      padding-right: 2px;
    }
    .participants-modal > .btn-group > .btn-group > .btn-success {
      padding-left: 2px;
    }
  `]
})

@Modal()
export class ParticipantsModalComponent implements OnInit {

    private currentState: string = 'inactive';
    ok: Function;
    closeModal: Function;

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
    }
}