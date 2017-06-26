import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'jp-my-groups',
    template: `
        <div class="my-groups-panel">
            <jp-site-header></jp-site-header>
            <div class="panel-heading">
                <h3>My groups</h3>
                <form [formGroup]="createGroupForm" class="form-group">
                    <div class="input-group">
                        <label class="sr-only" for="nameGroupInput">Create</label>
                        <input class="form-control" id="nameGroupInput"
                            name="nameGroupInput" placeholder="Create a new group" 
                            formControlName="name">
                        <span class="input-group-btn">
                            <button type="submit" class="btn btn-primary hidden-xs">
                                Create</button>
                        </span>
                    </div>
                </form>
            </div>
            <div class="row">
                <div class="col col-xs-12 col-md-2 filter-link">
                    <button *ngFor="let group of groups;" (click)="selectGroup(group)"
                        type="button" class="btn btn-link">
                        <span class="arrow-right"></span>{{group.name}}</button>
                </div>
                <div class="col col-xs-12 col-md-10">
                    <jp-group-form 
                        [group]="selectedGroup"
                        (update)="onUpdateGroup($event)"
                        (addParticipant)="onAddParticipant($event)"
                        (removeParticipant)="onRemoveParticipant($event)"></jp-group-form>
                </div>
            </div>
        </div>
    `
})

export class MyGroupsComponent {

    public createGroupForm: FormGroup;

    public selectedGroup: any;

    public groups = [
        {
            id: '0000001',
            name: 'Grupo 1',
            participants: [
                {
                    name: 'Perico'
                },
                {
                    name: 'Pablo'
                }
            ]
        },
        {
            id: '0000002',
            name: 'Grupo 2',
            participants: [
                {
                    name: 'Perico'
                },
                {
                    name: 'Alex'
                }
            ]
        }
    ];

    constructor(private fb: FormBuilder) {
        this.selectedGroup = Object.assign({}, this.groups[0]);
        this.createForm();
    }

    public selectGroup(group) {
        this.selectedGroup =
            this.groups[this.groups.indexOf(group)];
    }

    public onUpdateGroup(group) {
        // TODO refactor with real API
        this.groups = this.groups.map((g) => {
            if (g.id === group.id) {
                return Object.assign({}, g, group);
            }
            return g;
        });
    }

    public onAddParticipant(added) {
        // TODO refactor with real API
        let index = 0;
        this.groups = this.groups.map((g, i) => {
            if (g.id === this.selectedGroup.id) {
                index = i;
                let newparticipants = g.participants;
                newparticipants.push({
                    name: added
                });
                return Object.assign({}, g, {participants: newparticipants});
            }
            return g;
        });
        this.selectedGroup = Object.assign({}, this.groups[index]);
    }

    public onRemoveParticipant(removed) {
        // TODO refactor with real API
        let index = 0;
        this.groups = this.groups.map((g, i) => {
            if (g.id === this.selectedGroup.id) {
                index = i;
                let newparticipants =
                    g.participants.filter((p) => p.name !== removed);
                return Object.assign({}, g, {participants: newparticipants});
            }
            return g;
        });
        this.selectedGroup = Object.assign({}, this.groups[index]);
    }

    private createForm() {
        this.createGroupForm = this.fb.group({
            name: ['', Validators.required]
        });
    }
}
