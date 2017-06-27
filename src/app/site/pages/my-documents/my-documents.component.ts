import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jp-my-documents',
    template: `
        <div class="my-documents-panel">
            <jp-site-header [user]="user"></jp-site-header>
            
            <div class="my-documents-heading">
                <div class="title">
                    <h3>My documents</h3>
                    <div>
                        <button class="btn btn-link btn-primary" 
                            (click)="showAddForm = !showAddForm">
                            <i class="material-icons" *ngIf="!showAddForm">add</i>
                            <i class="material-icons" *ngIf="showAddForm">remove</i>
                        </button>
                        <div class="btn-group visible-xs">
                            <button type="button" 
                                class="btn btn-link btn-primary dropdown-toggle" 
                                data-toggle="dropdown" aria-haspopup="true" 
                                aria-expanded="false">
                                <i class="material-icons">filter_list</i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-right">
                                <li><a (click)="select('')">All</a></li>
                                <li><a (click)="select('#' + user.profile.name)">
                                    Mine</a></li>
                                <li role="separator" class="divider"></li>
                                <li>
                                    <a *ngFor="let group of userGroups;"
                                        (click)="select('@' + group.id)">
                                        {{group.name}}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="form">    
                    <form [formGroup]="createDocumentForm" *ngIf="showAddForm"
                        (ngSubmit)="onSubmit()"
                        class="form-group">
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
            </div>
            <div class="row">
                <div class="col hidden-xs col-md-2 filter-link">
                    <button type="button" class="btn btn-link"
                        (click)="select('')">All</button>
                    <button type="button" class="btn btn-link" 
                        (click)="select('#' + user.profile.name)">Mine</button>
                    <button type="button" *ngFor="let group of userGroups;"
                        (click)="select('@' + group.id)"
                        class="btn btn-link">{{group.name}}
                    </button>
                </div>
                <div class="col col-xs-12 col-md-10">
                    <jp-user-documents-view [documents]="documents"
                        [query]="query"
                        (search)="onSearch($event)">
                    </jp-user-documents-view>
                </div>
            </div>
        </div>
    `
})

export class MyDocumentsComponent implements OnInit {

    // TODO session service to rescue
    public user: any;

    public createDocumentForm: FormGroup;

    public showAddForm = false;

    public query = '';

    // TODO remove
    public documents = [
        {
            name: 'Briefing Jetpad 1',
            update: '22/04/2017',
            author: 'Pablo',
            group: ''
        },
        {
            name: 'Briefing Jetpad 2',
            update: '22/04/2017',
            author: 'Pablo',
            group: ''
        },
        {
            name: 'Briefing Jetpad 3',
            update: '22/04/2017',
            author: 'Pablo',
            group: 'group-2'
        },
        {
            name: 'Briefing Jetpad 4',
            update: '22/04/2017',
            author: 'Pablo',
            group: 'group-2'
        },
        {
            name: 'Briefing Jetpad 5',
            update: '22/04/2017',
            author: 'Pablo',
            group: 'group-2'
        },
        {
            name: 'Briefing Jetpad 6',
            update: '22/04/2017',
            author: 'Perico',
            group: 'group-1'
        },
        {
            name: 'Briefing Jetpad 7',
            update: '22/04/2017',
            author: 'Pablo',
            group: 'group-1'
        },
        {
            name: 'Briefing Jetpad 8',
            update: '22/04/2017',
            author: 'Perico',
            group: ''
        },
        {
            name: 'Briefing Jetpad 9',
            update: '22/04/2017',
            author: 'Perico',
            group: 'group-1'
        },
        {
            name: 'Briefing Jetpad 10',
            update: '22/04/2017',
            author: 'Pablo',
            group: 'group-1'
        },
        {
            name: 'Briefing Jetpad 11',
            update: '22/04/2017',
            author: 'Pablo',
            group: 'group-1'
        },
        {
            name: 'Briefing Jetpad 12',
            update: '22/04/2017',
            author: 'Pablo',
            group: 'group-1'
        }
    ];

    public userGroups = [
        {
            id: 'group-1',
            name: 'Group 1',
            created: new Date(),

        },
        {
            id: 'group-2',
            name: 'Group 2',
            created: new Date('05/06/2017')
        }
    ];

    private allDocuments = [];

    constructor(public userService: UserService,
                private router: Router,
                private route: ActivatedRoute,
                private fb: FormBuilder) {    }

    public ngOnInit() {
        this.user = this.route.snapshot.data['user'];
        this.createForm();
    }

    public onSearch(searchText) {
        // TODO implements
        window.alert(searchText + ' can not be searched, feature not yet implemented');
    }

    public onSubmit() {
        if (this.createDocumentForm.get('name').value !== '') {
            this.router.navigate(['/edit/' + this.createDocumentForm.get('name').value]);
        }
    }

    public select(query) {
        this.query = query;
    }

    private createForm() {
        this.createDocumentForm = this.fb.group({
            name: ['', Validators.required]
        });
    }

}
