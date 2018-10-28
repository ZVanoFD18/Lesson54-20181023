'use strict';
class SvValidatorPassword extends SvBaseValidator {
    constructor() {
        super();
        this.vName = 'password';
        this.vMethod = this.V_METHODS.REGEX;
        this.vRegex =  /^[\w\_А-Яа-я$#@&]{7,14}$/i;
        this.vInvalidText = 'Значение не проходит контроль для поля "Пароль"';
    }
}
SV.reg(new SvValidatorPassword());