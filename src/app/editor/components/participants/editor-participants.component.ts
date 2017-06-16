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

    private diffHighlight: boolean = false;

    public displayEditNameForm(display) {
        if (display) {
            this.name = this.me.profile.name;
            this.showEditNameForm = display;
        }
    }

    public saveEditNameForm() {
        this.showEditNameForm = false;

        if (!this.name) {
            if (!this.me.profile.name) {
                this.me.profile.setName('Anonymous');
            } else {
                this.me.profile.setName(this.name);
            }
        }
    }

    private isNotRegistered(profile) {
            return profile.anonymous && profile.name !== 'Anonymous';
    }

    private toggleParticipantPastList() {
    this.showParticipantsPastList = !this.showParticipantsPastList;
    }

    private switchDiffHighlight() {
        this.diffHighlight = !this.diffHighlight;
        this.diffHighlightEvent.emit(this.diffHighlight);
    }
}
