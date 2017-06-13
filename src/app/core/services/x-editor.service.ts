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

    /** Styles at the current caret position. */
    public stylesSubject: Subject<any> = new Subject<any>();

    /** Selection has changed */
    public selectionSubject: Subject<any> = new Subject<any>();

    /**
     * Initialize dom element with swell service instance.
     * @param elemId dom element identifier
     * @returns Observable boolean when ready
     */
    public init(elemId): Observable<boolean> {
        let that = this;
        return Observable.create(function subscribe(observer) {
            that.swell.getClient().subscribe( (service) => {
                that.editor = that.swell.getSdk().Editor.createWithId(elemId, service);
                observer.next(true);
                observer.complete();
            });
        });
    }

    public attachText(text: any): void {
        this.editor.set(text);
        this.startInteractive();
        this.editor.edit(true);
    }

    constructor(private swell: SwellService) {    }

    /** Reference to the swellrt editor instance */
    private editor: any;

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

    private startInteractive(): void {
        this.editor.setSelectionHandler((range, editorRef, selection) => {
            return EditorService.selectionHandler(this, range, editorRef, selection);
        });
    }



}
