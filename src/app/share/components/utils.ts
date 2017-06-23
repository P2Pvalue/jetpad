/**
 * Generic function to fill error messages object with a form
 * @param form form model
 * @param errors form errors
 * @param validationMsg validation error messages
 * @param data
 */
export function onValueChanged(form: any, errors: any, validationMsg: any) {
    if (!form) {
        return;
    }
    let f = form;
    for (const field in errors) {
        if (field) {
            // clear previous error message (if any)
            errors[field] = '';
            const control = f.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = validationMsg[field];
                for (const key in control.errors) {
                    if (key) {
                        errors[field] += messages[key] + ' ';
                    }
                }
            }
        }
    }
}
