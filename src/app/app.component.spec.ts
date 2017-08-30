import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
    inject,
    async,
    TestBed,
    ComponentFixture
} from '@angular/core/testing';

/**
 * Load the implementations that should be tested
 */
import { AppComponent } from './app.component';
import { SessionService } from './core/services/session.service';
import { SwellService } from './core/services/swell.service';
import { Observable } from 'rxjs';

describe(`App`, () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let sessionService: SessionService;
    let sessionSpy: any;

    /**
     * async beforeEach
     */
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AppComponent ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [SessionService, SwellService]
        })
        /**
         * Compile template and css
         */
            .compileComponents();
    }));

    /**
     * Synchronous beforeEach
     */
    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp    = fixture.componentInstance;

        sessionService = fixture.debugElement.injector.get(SessionService);
        sessionSpy = spyOn(sessionService, 'startDefaultSession')
            .and.returnValue(Observable.create((observer) => observer.next()));

        /**
         * Trigger initial data binding
         */
        fixture.detectChanges();
    });

    it(`should be readly initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });

    it('should log ngOnInit', () => {
        spyOn(console, 'debug');
        expect(console.debug).not.toHaveBeenCalled();

        comp.ngOnInit();
        expect(sessionSpy.calls.any()).toBe(true, 'startDefaultSession called');
        expect(console.debug).toHaveBeenCalled();
    });

});
