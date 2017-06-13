import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SwellService } from '.';

/**
 * Wrap an unique SwellRT editor instance associated with the
 * current client instance.
 *
 */
@Injectable()
export class EditorService {

    /**
     * Handle changes in swellrt's editor caret position and selection.
     *
     * @param serviceRef
     * @param range
     * @param editorRef
     * @param selection
     */
    private static selectionHandler(serviceRef: EditorService,
                                    range: any,
                                    editorRef: any,
                                    selection: any) {

        serviceRef.stylesSubject
            .next(editorRef.getAnnotation(['paragraph/', 'style/', 'link'], selection.range));

        serviceRef.selectionSubject.next(selection);
    }

    /** Styles at the current caret position. */
    public stylesSubject: Subject<any> = new Subject<any>();

    /** Selection has changed */
    public selectionSubject: Subject<any> = new Subject<any>();

    /** Reference to the swellrt editor instance */
    private editor: any;

    constructor(private swell: SwellService) {    }

    /**
     * Initialize dom element with swell service instance.
     * @param elemId dom element identifier
     * @returns Observable
     */
    public init(elemId): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            that.swell.getClient().subscribe( (service) => {
                that.editor = that.swell.getSdk().Editor.createWithId(elemId, service);
                observer.next(that.editor);
                observer.complete();
            });
        });
    }

    public initDocObject(doc: any, docid: string) {
        let title = doc.get('title');
        let text = doc.get('text');

        let isNew = !title || !text;

        if (!title) {
            doc.put('title', this.docIdToTitle(docid));
        }

        if (!text) {
            doc.put('text', this.swell.getSdk().Text.create(''));
        }

        if (isNew) {
            doc.setPublic(true);
        }

        // init comments
        let comments = doc.get('comments');

        if (!comments) {
            doc.put('comments', this.swell.getSdk().Map.create());
        }
    }

    public attachText(text: any): void {
        this.editor.set(text);
        this.startInteractive();
        this.editor.edit(true);
    }

    private startInteractive(): void {
        this.editor.setSelectionHandler((range, editorRef, selection) => {
            return EditorService.selectionHandler(this, range, editorRef, selection);
        });
    }

    private docIdToTitle(id: string) {
        let s = id.replace('-', ' ');
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}
