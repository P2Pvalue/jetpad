import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'jp-editor-participants',
    templateUrl: './editor-participants.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditorParticipantsComponent {

    @Input() public participantsPast: any[];
    @Input() public participantsRecent: any[];

    @Input() public me: any;

    @Input() public showInDialog: boolean = false;

    @Output() public diffHighlightEvent: EventEmitter<any> = new EventEmitter();

    public name: string;
    public showEditNameForm: boolean = false;
    public showParticipantsPastList: boolean = false;

    public diffHighlight: boolean = false;

    public displayEditNameForm(display) {
        if (display) {
            this.name = this.me.profile.name;
            this.showEditNameForm = display;
        }
    }

    public saveEditNameForm() {
        this.showEditNameForm = false;

        if (this.name && this.name.length > 0) {
            if (!this.me.profile.name) {
                this.me.profile.setName('Anonymous');
            } else {
                this.me.profile.setName(this.name);
            }
        }
    }

    public isNotRegistered(profile) {
            return profile.anonymous && profile.name !== 'Anonymous';
    }

    public toggleParticipantPastList() {
        this.showParticipantsPastList = !this.showParticipantsPastList;
    }

    public switchDiffHighlight() {
        this.diffHighlight = !this.diffHighlight;
        this.diffHighlightEvent.emit(this.diffHighlight);
    }
}
