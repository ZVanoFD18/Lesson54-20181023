'use strict';

/**
 * Валидация телефонных номеров международного формата.
 * Пример валидации черех функцию обратного вызоваю
 */
class SvValidatorPhoneInnational extends SvBaseValidator {
    constructor() {
        super();
        this.vName = 'phoneInnational';
        this.vMethod = this.V_METHODS.CALLBACK;
        this.vCallback = this.callback;
        this.vInvalidText = 'Значение не может быть международным номером. Допускается номенр формата "+375 25 XXX XX XX"';
    }

    /**
     *  номер телефона в международном формате +375 25 XXX XX XX, где +375 – код страны,
     *  25 – префикс сети оператора life:), ХХХХХХХ – номер абонента.
     * @param value
     */
    callback(value){
        this.vResult.clean();
        if(!/^\+\d{3}\s*\d{2}\s*\d{3}\s*\d{2}\s*\d{2}$/i.test(value)){
            this.vResult.addMessage('callback/Не пройдена валидация. Сообщение 1.')
            this.vResult.addMessage('callback/Не пройдена валидация. Сообщение 2.')
            return false;
        }
        return true;
    }
};

SV.reg(new SvValidatorPhoneInnational());