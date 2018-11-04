'use strict';
class Auth {
    static isAuthorized (){
        let login=this.getLogin();
        return login !== undefined;
    }
    static getLogin(){
        let login=Helper.Cookie.get('login');
        return login;
    }
    static redirectToLogin(){
        window.location.href = 'login.html';
    }
    static redirectToGame(){
        window.location.href = 'game.html';
    }
    static bindLoginForm(formEl){
        // formEl.querySelector('input[name="phone"]').;
        (function (phoneEl) {
            var mask = '+___ __ ___ __ __';
            phoneEl.value = mask;
            phoneEl.addEventListener('keyup', function () {
                console.log('keyup/', doGetCaretPosition(event.target), event.which, event.target.value);
            });
            // +375 25 XXX XX XX
            phoneEl.addEventListener('keydown', function (event) {
                console.log('keydown/', doGetCaretPosition(event.target), event.which, event.target.value);
                let charCode = event.which,
                    charLett = String.fromCharCode(charCode),
                    charPos = Helper.Form.getCaretPosition(event.target);
                if ([
                    9, // tab
                    35, // end
                    36, // home
                    37, // left
                    39, // right
                    116 // F5
                ].indexOf(charCode) > -1) {
                    return;
                }
                event.preventDefault(); // Отменить действие по умолчанию
                // event.stopImmediatePropagation(); // Отменить обработку оставшихся обработчиков
                // event.stopPropagation(); // Остановить всплытие

                if (mask.charAt(charPos) === '_') {
                    phoneEl.value = phoneEl.value.slice(0, charPos) + charLett + phoneEl.value.slice(charPos + 1);
                    if (mask.charAt(charPos + 1) === '_') {
                        phoneEl.selectionStart = charPos + 1;
                    } else if (mask.length - 1 < charPos + 2) {
                        phoneEl.selectionStart = charPos;
                    } else {
                        phoneEl.selectionStart = charPos + 2;
                    }
                    phoneEl.selectionEnd = phoneEl.selectionStart;
                }
            })
        }).call(this, formEl.querySelector('input[name="phone"]'));
        formEl.addEventListener('submit', function (event) {
            if (Auth.saveAuth(formEl)){
                Auth.redirectToGame();
            }
        });
        SV.bindForm(formEl);
    }

    static saveAuth(formEl){
        let login = formEl.querySelector('input[name="login"]').value;
        let pass = formEl.querySelector('input[name="pass"]').value;
        if (login.length < 1){
            return false;
        }
        Helper.Cookie.set('login', login, {
            path : '/',
            userExpiresNumberAdd : 3*60*1000 // 3*60*1000 = 3 минуты
        });
        Helper.Cookie.set('pass', pass, {
            path : '/'
            // secure : undefined
            //HttpOnly : undefined
        });
        return true;
    }
    static clearAuth(formEl){
        Helper.Cookie.del('login', '/');
    }
}
