import {
    Component, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';

@Component({
    selector: 'jp-editor-toolbar',
    templateUrl: 'editor-toolbar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditorToolbarComponent {

    @Input() public styles: any;
    @Output() public styleEvent: EventEmitter<any> = new EventEmitter();
    @Output() public linkEvent: EventEmitter<any> = new EventEmitter();

    public readonly STYLE_FONT_FAMILY: string = 'fontFamily';
    public readonly STYLE_HEADER: string = 'header';
    public readonly STYLE_FONT_SIZE: string = 'fontSize';
    public readonly STYLE_FONT_WEIGHT: string = 'fontWeight';
    public readonly STYLE_TEXT_DECORATION: string = 'textDecoration';
    public readonly STYLE_FONT_STYLE: string = 'fontStyle';
    public readonly STYLE_VERTICAL_ALIGN: string = 'verticalAlign';
    public readonly STYLE_COLOR: string = 'color';
    public readonly STYLE_BG_COLOR: string = 'backgroundColor';
    public readonly STYLE_TEXT_ALIGN: string = 'textAlign';
    public readonly STYLE_LIST: string = 'list';
    public readonly STYLE_INDENT: string = 'indent';

    public readonly CLEARABLE_STYLES = [
        this.STYLE_HEADER, this.STYLE_FONT_FAMILY, this.STYLE_FONT_SIZE,
        this.STYLE_FONT_WEIGHT, this.STYLE_FONT_STYLE, this.STYLE_TEXT_DECORATION,
        this.STYLE_VERTICAL_ALIGN, this.STYLE_COLOR, this.STYLE_BG_COLOR,
        this.STYLE_TEXT_ALIGN, this.STYLE_LIST
    ];

    public loadFonts: boolean = false;
    // Put here all constant and default values
    // instead of hardcoding them in the template

    public readonly defaultHeading = '';

    public readonly defaultFontFamily = {
        name: 'Serif',
        css: 'Georgia, serif'
    };

    public readonly fontFamilies = [
        {
            name: 'Serif',
            css: 'Georgia, serif'
        },
        {
            name: 'Sans',
            css: '"Open Sans", sans-serif'
        },
        {
            name: 'Monospace',
            css: '"Roboto Mono", monospace'
        }
    ];

    // TODO to consider screen size, density... to set this and default size
    public readonly defaultFontSize = '16px';
    public readonly fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 34, 36];

    public readonly fontWeightBold = 'bold';
    public readonly fontStyleItalic = 'italic';

    public readonly textDecorationUnderline = 'underline';
    public readonly textDecorationStrike = 'line-through';

    public readonly textAlignLeft = 'left';
    public readonly textAlignCenter = 'center';
    public readonly textAlignRight = 'right';
    public readonly textAlignJustify = 'justify';

    public readonly listDecimal = 'decimal';
    public readonly listUnordered = 'unordered';

    public setStyle(style: string, value: any) {
        this.styleEvent.emit({name: style, value});
    }

    public toggleStyle(style, enableValue) {
        if (!this.styles[style]) {
            this.setStyle(style, enableValue);
        } else {
            this.setStyle(style, '');
        }
    }

    public toggleStyleMultiple(style, currentValue) {
        if (this.styles[style] &&
            this.styles[style].value === currentValue) {
            this.setStyle(style, '');
        } else {
            this.setStyle(style, currentValue);
        }
    }

    public checkStyle(style, value) {
        return this.styles[style] && (this.styles[style].value === value);
    }

    public editLink() {
        this.linkEvent.emit();
    }

    public clearStyle() {
        this.CLEARABLE_STYLES.forEach((style) => {
            this.styleEvent.emit({name: style, value: null});
        });
    }

}
