import { Directive, Attribute, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, Validators, ValidatorFn } from '@angular/forms';
@Directive({
    selector: '[validateEqual]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: EqualValidatorDirective, multi: true}
    ]
})
export class EqualValidatorDirective implements Validator, OnChanges {
    @Input() public name: string;

    private valFn = Validators.nullValidator;

    public ngOnChanges(changes: SimpleChanges): void {
        let change = changes['validateEqual'];
        if (change) {
            this.valFn = equalValidator(this.name);
        } else {
            this.valFn = Validators.nullValidator;
        }
    }

    public validate(control: AbstractControl): {[key: string]: any} {
        return this.valFn(control);
    }
}

export function equalValidator(value: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        // self value
        let v = control.value;

        // control vlaue
        let e = control.root.get(value);

        // value not equal
        if (e && v !== e.value) {
            return {validateEqual: false};
        }
        if (e) {
            if (e.errors && Object.keys(e.errors).length) {
                if (Object.keys(e.errors).indexOf('validateEqual') > -1) {
                    delete e.errors['validateEqual'];
                    e.setErrors(null);
                }
            }
        }
        return null;
    };
}
