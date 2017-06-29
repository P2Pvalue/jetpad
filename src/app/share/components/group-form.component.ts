import {
    Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { onValueChanged } from './utils';
@Component({
    selector: 'jp-group-form',
    template: `
        <div class="panel panel-default">
        <form [formGroup]="groupForm">   
            <div class="panel-body">
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon">ID</span>
                        <input class="form-control" placeholder="id participant"
                            formControlName="id" readonly>
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon">Name</span>
                        <input class="form-control"
                            placeholder="name participant"
                            formControlName="name">
                    </div>
                </div>
                <div class="form-group">
                    <button (click)="onClickUpdate()"
                        class="btn btn-primary btn-block" >
                        Update</button>
                </div>
                <div class="form-group">
                    <h4>Participants</h4>
                    <div class="input-group">
                        <input class="form-control"
                            placeholder="Write a name ..."
                            formControlName="newParticipant">
                        <span class="input-group-addon">
                            <button class="btn btn-primary" 
                            (click)="onAddParticipant()">
                                Add</button>
                        </span>
                    </div>
                    <div class="participant-line" 
                        *ngFor="let participant of group.participants;">
                        <div class="participant-name">
                            <span>{{participant.name}}</span>
                        </div>
                        <div class="participant-actions"
                            (click)="removeParticipant.emit(participant.name)">
                            <i class="material-icons">delete</i>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        </div>
    `,
    styles: [`
        .input-group-addon {
            min-width: 100px;
            text-align: left;
        }
        .participant-line{
            display: flex;
        }
        .participant-name{
            flex-grow: 2;
        }
        .input-group {
            max-width: 750px;
        }
        .panel {
            max-width: 800px;
        }
    `]
})

export class GroupFormComponent implements OnInit, OnChanges {

    @Input() public group: any;

    @Output() public update = new EventEmitter();

    @Output() public addParticipant = new EventEmitter();

    @Output() public removeParticipant = new EventEmitter();

    public groupForm: FormGroup;

    public formErrors: any = {
        name: '',
        id: '',
        newParticipant: ''
    };

    private validationMessages: any = {
        name: {
            required: 'Name is required.',
            minlength: 'Name must be at leat 5 characters long.',
            maxlength: 'Name cannot be more than 50 characters long.'
        },
        id: {
            required: 'Name is required.',
            minlength: 'Name must be at leat 5 characters long.',
            maxlength: 'Name cannot be more than 50 characters long.'
        },
        newParticipant: {
            required: 'Name participant is required.',
            exist: 'Name participant does not exist.'
        }
    };

    constructor(private fb: FormBuilder) {
        this.createForm();
    }

    public ngOnInit() {
        this.groupForm.valueChanges
            .subscribe(() =>
                onValueChanged(this.groupForm, this.formErrors, this.validationMessages));
        onValueChanged(this.groupForm, this.formErrors, this.validationMessages);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.groupForm) {
            this.groupForm.setValue({
                name: this.group.name,
                id: this.group.id,
                newParticipant: ''
            });
        }
    }

    public onClickUpdate() {
        this.update.emit({
            id: this.groupForm.get('id').value,
            name: this.groupForm.get('name').value,
            participants: this.group.participants
        });
    }

    public onAddParticipant() {
        this.addParticipant.emit(this.groupForm.get('newParticipant').value);
    }

    private createForm() {
        this.groupForm = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            newParticipant: ['', Validators.required]
        });
    }
}
