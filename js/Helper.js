'use strict';
window.Helper = window.Helper || {};
/**
 * cookie
 * @type {Object}
 */

/*
var date = new Date(new Date().getTime() + 60 * 1000);
document.cookie = "name=value; path=/; expires=" + date.toUTCString();
// Так мы сохраняем куку с параметрами. ???Так кука хранится и передается на сервер???
"cName=cVal; domain=/  expires= Thu, 25 Oct 2018 16:14:44 GMT"

document.cookie
// Так нам возвращаются куки в JS.
"cName=cValue; cName1=cValue1"
*/
window.Helper.Cookie = window.Helper.Cookie || {
    /**
     * Стандартные имена cokie.
     * Set-Cookie: <name>=<value>[; <Max-Age>=<age>] [; expires=<date>][; domain=<domain_name>] [; path=<some_path>][; secure][; HttpOnly]
     */
    ALLOW_ATTRIBUTES : {
        expires : 'expires',
        path : 'path',
        domain : 'domain',
        'max-age' : 'max-age',
        secure : 'secure',
        HttpOnly : 'HttpOnly'
    },
    /**
     * Пользовательские имена cookie.
     * При обработке имя cookie заменяется на стандартное, а над значением производится какое-либо действие.
     */
    ALLOW_USER_ATTRIBUTES : {
        /**
         * Установка "expires".
         * К текущей дате добавляется указанное число.
         */
        userExpiresNumberAdd : 'userExpiresNumberAdd',
        /**
         * Установка "expires".
         * Преобразовывает число в дату.
         */
        userExpiresNumberToDate : 'userExpiresNumberToDate'
    },
    isEnabled : navigator.cookieEnabled,
    /**
     * @returns {Object}
     */
    getAll(){
        let result = {};
        let values = document.cookie.split('; ')
        values.forEach(function (value) {
            if (value !== ''){
                let parts =  value.split('=');
                result[parts[0]] = decodeURIComponent(parts[1]);
            }
        });
        return result;
    },
    /**
     *
     * @param name
     * @param defValue
     * @returns {String}
     */
    get(name, defValue){
        let cookies = this.getAll();
        if(name in cookies){
            return cookies[name];
        }
        return defValue;
    },
    /**
     *
     * @param {String} name
     * @param {mixed} value
     * @param {Object} properties
     * @returns {Window.Helper.Cookie}
     */
    set(name, value, properties){
        properties = properties || {};
        // properties.path = properties.path || '/';
        let newCookie = name + '=' + encodeURIComponent(value);
        let isFirstProperty = true;
        for (let pName in properties){
            /**
             * Реально устанавлимаемое свойство
             * @type {string}
             */
            let propertyName = pName;
            let propertyVal = properties[pName];
            // console.log('pName=' + pName, propertyVal);
            if (pName in this.ALLOW_USER_ATTRIBUTES){
                if (pName === this.ALLOW_USER_ATTRIBUTES.userExpiresNumberAdd){
                    if (typeof propertyVal !== 'number'){
                        throw new Error('Invalid user property type.')
                    }
                    let date = new Date(new Date().getTime() + propertyVal);
                    propertyVal = date.toUTCString();
                    propertyName = this.ALLOW_ATTRIBUTES.expires;
                } else if(pName === this.ALLOW_USER_ATTRIBUTES.userExpiresNumberToDate){
                    let date = new Date(propertyVal);
                    propertyVal = date.toUTCString();
                    propertyName = this.ALLOW_ATTRIBUTES.expires;
                }
            } else if(!(pName in this.ALLOW_ATTRIBUTES)){
                throw new Error('Invalid user property name.')
            } else {
                if (pName === 'expires'){
                    if (propertyVal instanceof Date){
                        propertyVal = propertyVal.toUTCString();
                    }
                }

            }
            isFirstProperty = false;
            newCookie += '; ' + propertyName +(propertyVal === undefined ? '' : '=' + propertyVal);
        }
        console.log('newCookie', newCookie);
        document.cookie = newCookie;
        return this;
    },
    /**
     * Устанавлевает куки из массива.
     * @param {Array} values
     * @returns {Window.Helper.Cookie}
     */
    setCookies(values){
        values.forEach(values, function (item) {
            this.set(item.name, item.value, item.properties);
        });
        return this;
    },
    /**
     * Удаляет указанную куку
     * @param name
     */
    del(name, path){
        let params = {
            'userExpiresNumberAdd' : -1
        };
        if (!!path){
            params.path = path;
        }
        this.set(name, '', params);
    }

};

window.Helper.Form = {
    /**
     * Возвращает позицию курсора в поле ввода текста
     * @param oField
     * @returns {number}
     */
    getCaretPosition(oField){
        // Initialize
        var iCaretPos = 0;

        // IE Support
        if (document.selection) {

            // Set focus on the element
            oField.focus();

            // To get cursor position, get empty selection range
            var oSel = document.selection.createRange();

            // Move selection start to 0 position
            oSel.moveStart('character', oField.value.length);

            // The caret position is selection length
            iCaretPos = oSel.text.length;
        }

        // Firefox support
        else if (oField.selectionStart || oField.selectionStart == '0')
            iCaretPos = oField.selectionStart;

        // Return results
        return iCaretPos;
    }
}