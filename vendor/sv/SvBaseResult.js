'use strict';

/**
 * Базовый класс, объекты когорого возвращаются всеми валидаторами.
 * Обеспечивает единообразный интерфейс для получения информации о результате валидациию
 */
class SvBaseResult {
    constructor (){
        this.clean();
    }
    clean(){
        this._errMessages = [];
    }
    get isValid (){
        return this._errMessages.length < 1;
    }
    get errMessages(){
        return this._errMessages
    }
    addMessage (message){
        this._errMessages.push(message);
    }
    addMessages (messages){
        this._errMessages.concat(messages);
    }
    getErrMessage(separator){
        separator = separator || '; ';
        return this.errMessages.join(separator);
    }
    get errMessage(){
        return this.getErrMessage();
    }
}