'use strict';
class SvValidatorLogin extends SvBaseValidator {
    constructor() {
        super();
        this.vName = 'login';
        this.vMethod = this.V_METHODS.REGEX;
        this.vRegex = /^[\w]{3,14}$/i;
        this.vInvalidText = 'Значение не проходит контроль для Логина';
    }
}
SV.reg(new SvValidatorLogin());