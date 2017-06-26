import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
    selector: 'jp-user-documents-view',
    template: `
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="panel-heading">
                    <form [formGroup]="searchForm" (ngSubmit)="onSubmit()">
                        <div class="input-group">
                            <label class="sr-only" for="searchDocumentInput">Search</label>
                            <input class="form-control" id="searchDocumentInput" 
                                name="searchDocumentInput" placeholder="Find out a document" 
                                formControlName="search">
                            <span class="input-group-btn">
                                <button type="submit" class="btn btn-primary hidden-xs">
                                    Search</button>
                            </span>
                        </div>
                    </form>
                </div>
                <div class="documents-table">
                    <div class="header">
                        <div class="cell">
                            <a (click)="toggleOrder('name')">Name
                                <i class="material-icons" *ngIf="orderUp == 'name'">
                                    keyboard_arrow_up</i>
                                <i class="material-icons" *ngIf="orderDown == 'name'">
                                    keyboard_arrow_down</i>
                            </a>
                        </div>
                        <div class="cell">
                            <a (click)="toggleOrder('update')">Update
                                <i class="material-icons" *ngIf="orderUp == 'update'">
                                    keyboard_arrow_up</i>
                                <i class="material-icons" *ngIf="orderDown == 'update'">
                                    keyboard_arrow_down</i>
                            </a>
                        </div>
                        <div class="cell">
                            <a (click)="toggleOrder('author')">Author
                                <i class="material-icons" *ngIf="orderUp == 'author'">
                                    keyboard_arrow_up</i>
                                <i class="material-icons" *ngIf="orderDown == 'author'">
                                    keyboard_arrow_down</i>
                            </a>
                        </div>
                        <div class="cell">Actions</div>
                    </div>
                        <div class="doc-line" 
                            *ngFor="let document of currentDocuments; let i = index"> 
                            <div class="cell name">{{document.name}}</div>
                            <div class="cell" *ngIf="!document.editing">{{document.update}}</div>
                            <div class="cell" *ngIf="!document.editing">{{document.author}}</div>
                         
                            <div class="cell actions" class="visible-xs-inline-block">
                                <button class="btn btn-fab-mini" *ngIf="!document.editing" 
                                    (click)="toggleDocumentEdit(document)">
                                    <i class="material-icons">more_horiz</i></button>
                                <button class="btn btn-fab-mini" *ngIf="document.editing">
                                    <i class="material-icons">info</i>
                                </button>
                                <button class="btn btn-fab-mini" *ngIf="document.editing">
                                    <i class="material-icons" *ngIf="document.editing">
                                        share</i></button>
                                <button class="btn btn-fab-mini" *ngIf="document.editing">
                                    <i class="material-icons">delete</i></button>
                                <button class="btn btn-fab-mini"  *ngIf="document.editing"
                                    (click)="toggleDocumentEdit(document)">
                                    <i class="material-icons">more_vert</i></button>
                            </div>
                            <div class="cell actions btn-group-xs hidden-xs">
                                <button class="btn btn-fab-mini">
                                    <i class="material-icons">info</i>
                                </button>
                                <button class="btn btn-fab-mini">
                                    <i class="material-icons">share</i></button>
                                <button class="btn btn-fab-mini">
                                    <i class="material-icons">delete</i></button>
                            </div>
                        </div>
                </div>
                <nav class="documents-pagination" aria-label="Page navigation" 
                    *ngIf="pages > 1">
                    <ul class="pagination">
                        <li>
                            <a (click)="prev($event)" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li *ngFor="let numPage of pagesArray; let i = index"
                            [ngClass]="{'primary active': i == currentPage}">
                            <a (click)="gotoPage(i, $event)">{{i}}</a></li>
                        <li>
                            <a (click)="next($event)" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        
    `,
    styles: [`
        .input-group {
            max-width: 750px;
        }
        .btn-fab-mini {
            width: 30px;
            padding: 0;
            margin: 10px 5px;
        }
        .documents-table {
            display: flex;
            flex-direction: column;
        }
        .header {
            display: flex;
            flex-direction: row;
            align-items: baseline;
        }
        .doc-line {
            display: flex;
            flex-direction: row;
        }
        .doc-line > .name {
            flex-grow: 2;
        }
        .cell {
            align-self: center;
            flex-grow: 1;
            max-width: 360px;
        }
        .actions {
            max-width: 160px;
        }
        .panel {
            max-width: 960px;
        }
    `]
})

export class UserDocumentsViewComponent implements OnInit, OnChanges {

    public MAX_LINES = 10;

    @Input() public documents: any[];

    @Output() public search = new EventEmitter();

    public pages: number;
    public pagesArray: any[];
    public currentDocuments: any[];
    public currentPage: number = 0;
    public editing = false;

    public orderUp: string;
    public orderDown: string;

    public searchForm: FormGroup;

    constructor(private fb: FormBuilder) { }

    public ngOnInit() {
        this.createForm();
    }

    public ngOnChanges() {
        let newPages = Math.floor(this.documents.length / this.MAX_LINES) + 1;
        if (this.pages !== newPages) {
            this.pages = newPages;
            this.pagesArray = new Array(this.pages);
            this.currentPage = 0;
            this.currentDocuments =
                this.calculateDocuments(this.documents, this.currentPage, this.MAX_LINES);
        }
    }

    public next(event: Event) {
        event.preventDefault();
        this.currentPage = (this.currentPage + 1) % this.pages;
        this.currentDocuments =
            this.calculateDocuments(this.documents, this.currentPage, this.MAX_LINES);
    }

    public prev(event: Event) {
        event.preventDefault();
        this.currentPage = (this.currentPage - 1) % this.pages;
        this.currentDocuments =
            this.calculateDocuments(this.documents, this.currentPage, this.MAX_LINES);
    }

    public gotoPage(pageNumber, event) {
        event.preventDefault();
        this.currentPage = pageNumber;
        this.currentDocuments =
            this.calculateDocuments(this.documents, this.currentPage, this.MAX_LINES);
    }

    public toggleOrder(columnName) {
        let up = true;
        if (columnName === this.orderUp) {
            this.orderDown = columnName;
            this.orderUp = '';
        } else if (columnName === this.orderDown) {
            this.orderUp = columnName;
            this.orderDown = '';
            up = false;
        } else {
            this.orderUp = columnName;
            this.orderDown = '';
        }
        this.documents = this.sortDocuments(this.documents, columnName, up);
        this.currentDocuments =
            this.calculateDocuments(this.documents, this.currentPage, this.MAX_LINES);
    }

    public toggleDocumentEdit(document) {
        document.editing = !document.editing;
        this.editing = !this.editing;
    }

    public onSubmit() {
        this.search.emit(this.searchForm.get('search').value);
    }

    private createForm() {
        this.searchForm = this.fb.group({
            search: ''
        });
    }

    private calculateDocuments(documents, currentPage, maxLines) {
        if (!documents) {
            return [];
        }
        let docs: any;
        if (documents.length > maxLines) {
            docs =  documents.slice(currentPage * maxLines, (currentPage + 1) * maxLines)
                .map((doc) => Object.assign({}, doc, {editing: false}));
        } else {
            docs =  documents.slice(0, documents.length)
                .map((doc) => Object.assign({}, doc, {editing: false}));
        }
        console.log(docs);
        return docs;
    }

    private sortDocuments(documents, field, direction) {
        return documents.sort((docA, docB) => {
            if (field === 'name') {
                return direction ? docA.name <= docB.name : docA.name > docB.name;
            } else if (field === 'author') {
                return direction ? docA.author <= docB.author : docA.author > docB.author;
            } else  if (field === 'update') {
                return direction ? docA.update <= docB.update : docA.update > docB.update;
            } else {
                return 0;
            }
        });
    }

}
