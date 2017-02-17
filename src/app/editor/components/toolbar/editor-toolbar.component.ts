import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

declare let window: any;



@Component({
  selector: 'jp-editor-toolbar',
  templateUrl: 'editor-toolbar.component.html'
})

export class EditorToolbarComponent implements OnInit {

  @Input() styles: any;
  @Output() styleEvent: EventEmitter<any> = new EventEmitter();
  @Output() linkEvent: EventEmitter<any> = new EventEmitter();

  readonly STYLE_HEADER: string = "header";
  readonly STYLE_FONT_FAMILY: string = "fontFamily";
  readonly STYLE_FONT_SIZE: string = "fontSize";
  readonly STYLE_FONT_WEIGHT: string = "fontWeight";
  readonly STYLE_FONT_STYLE: string = "fontStyle";
  readonly STYLE_TEXT_DECORATION: string = "textDecoration";
  readonly STYLE_VERTICAL_ALIGN: string = "verticalAlign";
  readonly STYLE_COLOR: string = "color";
  readonly STYLE_BG_COLOR: string = "backgroundColor";
  readonly STYLE_TEXT_ALIGN: string = "textAlign";
  readonly STYLE_LIST: string = "list";
  readonly STYLE_INDENT: string = "indent";

  // Put here all constant and default values
  // instead of hardcoding them in the template

  readonly defaultHeading = "";

  readonly defaultFontFamily = "Open Sans";
  readonly fontFamilies = ["Open Sans", "Droid Serif", "Liberation Sans", "Liberation Serif", "Roboto Mono"];

  // TODO to consider screen size, density... to set this and default size
  readonly defaultFontSize = "14px";
  readonly fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 34, 36];

  readonly fontWeightBold = "bold";
  readonly fontStyleItalic = "italic";

  readonly textDecorationUnderline = "underline";
  readonly textDecorationStrike = "line-through";

  readonly textAlignLeft = "left";
  readonly textAlignCenter = "center";
  readonly textAlignRight = "right";
  readonly textAlignJusity = "justify";

  readonly listDecimal = "decimal";
  readonly listUnordered = "unordered";

  ngOnInit() {

  }

  setStyle(style: string, value: any) {
    this.styleEvent.emit({ name: style, value: value });
  }

  toggleStyle(style, enableValue) {
    if (!this.styles[style]) {
      this.setStyle(style, enableValue);
    } else {
      this.setStyle(style, "");
    }
  }

  toggleStyleMultiple(style, currentValue) {
    if (this.styles[style] &&
        this.styles[style].value == currentValue) {
      this.setStyle(style, "");
    } else {
      this.setStyle(style, currentValue);
    }
  }

  checkStyle(style, value) {
    return this.styles[style] && (this.styles[style].value == value);
  }

  editLink() {
    this.linkEvent.emit();
  }

}
