'use strict';

/**
 * SV - Super Validator
 * Точка входа. Основной класс плагина-валидатора.
 * Может использоваться отдельно, но в большинстве случаев достаточно глобального экземпляра SV(см.ниже)
 *
 */
class Sv {
    constructor(options) {
        this.validators = {};
    }

    /**
     * Возвращает true, если валидатор с указанным именем зарегестрирован.
     * @param vName
     * @returns {boolean}
     */
    isRegistered(vName) {
        return vName in this.validators;
    }

    /**
     * Регистрирует указаный валидатор со стандартным именем.
     * @param validator
     */
    reg(validator) {
        if (!(validator instanceof SvBaseValidator)) {
            throw new Error('Invalid validator type');
        }
        this.regByAlias(validator.vName, validator);
    }

    /**
     * Регистрирует валидатор с указанным псевдонимом.
     * @param vName
     * @param validator
     */
    regByAlias(vName, validator) {
        if (!(validator instanceof SvBaseValidator)) {
            throw new Error('Invalid validator type');
        }
        this.validators[vName] = validator;
    }

    /**
     * Разрегистрирует валидатор. Т.е. удаляет из списка доступных.
     * @param vName
     */
    unreg(vName) {
        delete this.validators[vName];
    }

    /**
     * Возвращает экземпляр зарегистрированного валидатора по его имени.
     * @param vName
     * @param silently
     * @returns {*}
     */
    getValidator(vName, silently) {
        silently = silently || false;
        let validator = this.validators[vName];
        if (!(validator instanceof SvBaseValidator) && !silently) {
            throw new Error('Validator not registered.');
        }
        return validator;
    }

    /**
     * Выполняет валидацию значения ипользуя заданное имя валидатора.
     * @param vName - Имя валидатора, который следует использовать.
     * @param value
     * @returns {SvBaseResult}
     */
    validate(vName, value) {
        let result = this.getValidator(vName).validate(value)
        return result;
    }

    /**
     * Перебирает элементы формы и привязывает валидацию, если это необходимо.
     * @param formEl
     */
    bindForm(formEl) {
        let inputs = formEl.querySelectorAll('input');
        [].forEach.call(inputs, function (inputEl) {
            this.bindInput(inputEl);
        }, this);
        let selects = formEl.querySelectorAll('select');
        [].forEach.call(selects, function (inputEl) {
            this.bindInput(inputEl);
        }, this);
    }

    /**
     * Связывает обработчики событий с указанным элементом.
     * @param inputEl
     */
    bindInput(inputEl) {
        let vName = inputEl.dataset.vName;
        if (!this.isRegistered(vName)) {
            console.log('@DEBUG: Unregistered vName(Validator Name) - ' + vName);
            return;
        }
        inputEl.addEventListener('keyup', (function (event) {
            this.validateEl(inputEl);
        }).bind(this));
        inputEl.addEventListener('blur', (function (event) {
            this.validateEl(inputEl);
        }).bind(this));
        inputEl.addEventListener('change', (function (event) {
            this.validateEl(inputEl);
        }).bind(this));
        // inputEl.addEventListener('focus', (function (event) {
        //     this.validateEl(inputEl);
        // }).bind(this));
    }

    /**
     * Выполняет валидацию указанного элемента.
     * @param inputEl
     */
    validateEl (inputEl){
        console.log('validate', inputEl)
        let vName = inputEl.dataset.vName;
        if (!this.isRegistered(vName)) {
            console.log('@DEBUG: Unregistered vName(Validator Name) - ' + vName);
            return;
        }
        let vResult = SV.validate(vName, inputEl.value),
            errEl = inputEl.closest('label').querySelector('.sv-error');
        if (vResult.isValid) {
            inputEl.classList.remove('invalid');
            inputEl.classList.add('valid');
            if(errEl !== null){
                inputEl.closest('label').removeChild(errEl);
            }
        } else {
            if (errEl === null){
                errEl = document.createElement('div');
                errEl.classList.add('sv-error');
                inputEl.closest('label').appendChild(errEl )
            }
            errEl.innerHTML = vResult.errMessage;
            inputEl.classList.remove('valid');
            inputEl.classList.add('invalid');
        }
    }
};
/**
 * Синглтон. Глобальный экземпляр плагина-валидатора.
 * По-умолчанию все валидаторы регистрируются в этом объекте.
 * @type {Sv}
 */
const SV = new Sv();