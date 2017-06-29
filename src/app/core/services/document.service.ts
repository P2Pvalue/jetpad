import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService, SwellService, ObjectService } from './index';
import { Router } from '@angular/router';

@Injectable()
export class DocumentService {
    public static editor(parentElementId, widgets, annotations) {
        return SwellService.getSdk().editor(parentElementId, widgets, annotations);
    }

    public document: any;
    public currentDocument = new Subject<any>();
    public currentDocumentIsPrivate = new Subject<any>();
    public myDocuments = new Subject<any>();
    public myDocumentsInterval: any;

    public ANONYMOUS_DOCUMENT_PARTICIPANT = '_anonymous_@' + this.SWELLRT_DOMAIN;
    public PUBLIC_DOCUMENT_PARTICIPANT = '@' + this.SWELLRT_DOMAIN;
    public ANONYMOUS_PARTICIPANT = '_anonymous_';

    public projection = {
        'wave_id': 1,
        'participants': 1,
        'root.doc-title': 1,
        'root.doc.lastmodtime': 1, 'root.doc.author': 1
    };

    constructor(@Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string,
                @Inject('JETPAD_URL') private JETPAD_URL: string,
                private userService: UserService,
                private objectService: ObjectService,
                private router: Router) {
        userService.currentUser.subscribe((user) => {
            clearInterval(this.myDocumentsInterval);
            if (!user.anonymous) {
                this.getUserDocuments(user);
                this.myDocumentsInterval = setInterval(() => this.getUserDocuments(user), 3000);
            }
        });
    }

    public getDocumentUrl(waveId: any) {
        return this.JETPAD_URL + '/edit/' + this.getEditorId(waveId);
    }

    public getEditorId(waveId: any) {
        return waveId.substr(waveId.indexOf('/') + 1);
    }

    public userHasPermission() {
   /*     return this.document.getParticipants().includes(this.PUBLIC_DOCUMENT_PARTICIPANT) ||
            this.document.getParticipants().includes(this.userService.getUser().id);*/
    }

    public publicDocument() {
        return this.document.getParticipants().includes(this.PUBLIC_DOCUMENT_PARTICIPANT);
    }

    public anonymousDocument() {
        return this.document.getParticipants().includes(this.ANONYMOUS_DOCUMENT_PARTICIPANT);
    }

    public newAnonymousDocument() {
        return this.document.getParticipants().length
            === 1 && this.document.getParticipants()[0].startsWith(this.ANONYMOUS_PARTICIPANT);
    }

    public makeDocumentAnonymous() {
        this.document.addParticipant(this.ANONYMOUS_DOCUMENT_PARTICIPANT);
        this.makeDocumentPublic();
    }

    public addParticipant(participant: string) {
        this.document.addParticipant(participant);
    }

    public removeParticipant(participant: string) {
        this.document.removeParticipant(participant);
    }

    public makeDocumentPublic() {
        this.addParticipant(this.PUBLIC_DOCUMENT_PARTICIPANT);
        this.currentDocumentIsPrivate.next(false);
    }

    public makeDocumentPrivate() {
        this.removeParticipant(this.PUBLIC_DOCUMENT_PARTICIPANT);
        this.currentDocumentIsPrivate.next(true);
    }

    public getUserDocuments(user: any) {
        let query = {
            _query: {participants: {$eq: user.id, $ne: this.ANONYMOUS_DOCUMENT_PARTICIPANT}},
            _projection: this.projection
        };
        SwellService.getSdk().query(query,
            (documents) => this.parseDocuments(documents.result), (error) => console.error(error));
    }

    public parseDocuments(myDocuments) {
        let that = this;
        return myDocuments.map((document) => {
            let modification;
            let date = new Date(document.root.doc.lastmodtime);
            if (date.toDateString() === new Date().toDateString()) {
                modification = ('0' + date.getHours()).slice(-2)
                    + ':' + ('0' + date.getMinutes()).slice(-2);
            } else {
                modification = date.getDate() + ' ' + date.toUTCString().split(' ')[2];
            }
            let author;
            return this.userService.getUserProfiles([document.root.doc.author])
                .then((authorProfile) => {
                    if (authorProfile.length) {
                        author = authorProfile[0];
                    }
                    let participants = document.participants.filter((participant) => {
                        return !participant.startsWith('@')
                            && !participant.startsWith('_anonymous_')
                            && participant !== document.root.doc.author;
                    });
                    if (participants.length > 0) {
                        return that.userService.getUserProfiles(participants);
                    } else {
                        return [];
                    }
                }).then((participantProfiles) => {
                let parsedDocument = {
                    id: document.wave_id,
                    // TODO to review
                    title: document.root['doc-title'],
                    author,
                    modification,
                    participants: participantProfiles,
                    authorId: document.root.doc.author,
                    timestamp: document.root.doc.lastmodtime,
                    editorId: that.getEditorId(document.wave_id),
                    documentUrl: that.getDocumentUrl(document.wave_id)
                };
                that.myDocuments.next(parsedDocument);
            });
        });
    }

    public open(id: string) {
        this.close();
        id = this.SWELLRT_DOMAIN + '/' + id;
        return this.objectService.open(id);
    }

    public close() {
        if (this.document) {
            this.objectService.close(this.document.id());
            this.document = undefined;
        }
    }
}
