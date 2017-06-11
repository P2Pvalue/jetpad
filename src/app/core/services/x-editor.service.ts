import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SwellService } from '.';

declare let swellrt: any;

/**
 * Wrap an unique SwellRT editor instance associated with the
 * current client instance.
 *
 * TODO ensure editor DOM container is set after wiew is ready. 
 * SwellRT should be fixed.
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

        serviceRef.caretStylesSubject
            .next(editorRef.getAnnotation(['paragraph/', 'style/', 'link'], selection.range));

        serviceRef.selectionSubject.next(selection);
    }


    /** Styles at the current caret position. */
    public stylesSubject: Subject<any> = new Subject<any>();

    /** Selection has changed */
    public selectionSubject: Subject<any> = new Subject<any>();

    /** Reference to the swellrt editor instance */
    private editor: any;

    constructor(private swell: SwellService) {

        /**
         * Create a default editor instance attached to the swellrt service.
         * Texts and DOM container can be attached later.
         */
        this.swell.readySubject.subscribe( (isReady) => {
            if (isReady) {
                this.editor =
                    swellrt.Editor.createWithId('editor-container', this.swell.getClient());
            }
        });

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



}
