'use strict';
class SvValidatorNumber extends SvBaseValidator {
    constructor() {
        super();
        this.vName = 'number';
        this.vMethod = this.V_METHODS.REGEX;
        this.vRegex =  /^\d+$/;
        this.vInvalidText = 'Значение не проходит контроль для поля "Положительное целое число"';
    }
}
SV.reg(new SvValidatorNumber());