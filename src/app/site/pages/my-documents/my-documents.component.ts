import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'jp-my-documents',
    template: `
        <div class="my-documents-panel">
            <jp-site-header [user]="userService.currentUser| async"></jp-site-header>
            
            <div class="panel-heading">
                <h3>My documents</h3>
                <form [formGroup]="createDocumentForm">
                    <div class="input-group">
                        <label class="sr-only" for="nameDocumentInput">Create</label>
                        <input class="form-control" id="nameDocumentInput" 
                            name="nameDocumentInput" placeholder="Create a new document" 
                            formControlName="name">
                        <span class="input-group-btn">
                            <button type="submit" class="btn btn-primary hidden-xs">
                                Create</button>
                        </span>
                    </div>
                </form>
            </div>
            <div class="panel-body">
                <div class="row">
                <div class="col col-xs-12 col-md-2 filter-link">
                    <button type="button" class="btn btn-link">
                        <span class="arrow-right"></span>Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                </div>
                <div class="col col-xs-12 col-md-10">
                    <jp-user-documents-view [documents]="documents"
                        (search)="onSearch($event)">
                    </jp-user-documents-view>
                </div>
            </div>
            </div>
            
            <!--<div class="row">
                <div class="col-xs-12">
                    <h2 class="text-center">My documents</h2>
                </div>
            </div>-->
            <!--<div class="row">
                <form [formGroup]="createDocumentForm">
                    <div class="form-group">
                        <label class="sr-only" for="nameDocumentInput">Search</label>
                        <input class="form-control" id="nameDocumentInput" 
                            name="nameDocumentInput" placeholder="Create a new document" 
                            formControlName="name">
                    </div>
                </form>
            </div>-->
            <!--<div class="row">
                <div class="col col-xs-12 col-md-2">
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                    <button type="button" class="btn btn-link">Link</button>
                </div>
                <div class="col col-xs-12 col-md-10">
                    <jp-user-documents-view [documents]="documents"></jp-user-documents-view>
                </div>
            </div>-->
        </div>
    `
})

export class MyDocumentsComponent {

    public createDocumentForm: FormGroup;

    // TODO remove
    public documents = [
        {
            name: 'Briefing Jetpad 1',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 2',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 3',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 4',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 5',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 6',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 7',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 8',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 9',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 10',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 11',
            update: '22/04/2017',
            author: 'Pablo'
        },
        {
            name: 'Briefing Jetpad 12',
            update: '22/04/2017',
            author: 'Pablo'
        }
    ];

    constructor(public userService: UserService, private fb: FormBuilder) {
        this.createForm();
    }

    public onSearch(searchText) {
        // TODO implements
        window.alert(searchText + ' can not be searched, feature not yet implemented');
    }

    private createForm() {
        this.createDocumentForm = this.fb.group({
            name: ['', Validators.required]
        });
    }

}
