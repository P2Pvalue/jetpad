import { Component } from '@angular/core';
import { Modal } from '../../core/services/jetpad-modal.service';

@Component({
    selector: 'jp-users-modal',
    template: `
        <div class="modal show">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" 
                            aria-hidden="true" (click)="onCancel()">×</button>
                        <h3 class="modal-title">
                            Manages user accounts
                        </h3>
                    </div>
                
                    <div class="modal-body">
                        <div class="list-group-item" *ngFor="let account of accounts">
                            <div class="row-picture">
                              <app-user-icon  [participantSession]="account"></app-user-icon>
                            </div>
                            <div class="row-content">
                           
                                <p class="list-group-item-heading">
                                    {{account.profile.name}}</p>
                                <p class="list-group-item-text">
                                    {{account.session.lastActivityTime | myMoment}}</p>
                                
                            </div>
                            <button class="btn btn-link">open</button> , 
                            <button class="btn btn-link">close session</button>
                            <!--
                            <div class="list-group-separator"></div>
                            -->
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary"  (click)="onOk()">
                            Add Account</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .modal {
            margin-top: 4em;
        }
        .list-group-item {
            display: flex;
            justify-content: space-between;
        }
    `]
})

@Modal()
export class UsersModalComponent {

    public ok: Function;
    public closeModal: Function;
    public accounts: any;

    public  onCancel(): void {
        this.onOk();
    }

    public  onOk(): void {
        setTimeout(() => {
            this.closeModal();
        }, 150);
        this.ok();
    }
}