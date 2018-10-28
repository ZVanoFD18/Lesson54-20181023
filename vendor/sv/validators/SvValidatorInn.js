'use strict';
class SvValidatorInn extends SvBaseValidator {
    constructor() {
        super();
        this.vName = 'inn';
        this.vMethod = this.V_METHODS.REGEX;
        this.vRegex = /\d{10}/;
        this.vInvalidText = 'Значение не может быть INN';
    }
}
SV.reg(new SvValidatorInn());