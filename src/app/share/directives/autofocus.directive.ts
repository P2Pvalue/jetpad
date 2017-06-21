import { Directive, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[myAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

    constructor(private elementRef: ElementRef) { };

    public ngAfterViewInit(): void {
        this.elementRef.nativeElement.focus();
    }
}
