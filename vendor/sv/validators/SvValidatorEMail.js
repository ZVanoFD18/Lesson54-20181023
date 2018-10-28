'use strict';
class SvValidatorEMail extends SvBaseValidator {
    constructor() {
        super();
        this.vName = 'eMail';
        this.vMethod = this.V_METHODS.REGEX;
        this.vRegex = /([\wА-Яа-я]+)@(\w+)\.([\wа-я]{2,})/i;
        this.vInvalidText = 'Значение не может быть eMail';
    }
};

SV.reg(new SvValidatorEMail());