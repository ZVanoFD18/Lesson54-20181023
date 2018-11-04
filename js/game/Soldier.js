'use strict';
/**
 * Класс "Солдат".  Прототипный стиль.
 * @type {Object}
 **/
function Soldier(){};
Soldier.prototype = {
    constructor : Soldier,
    /**
     * @type {Hiro}
     **/
    hiro: undefined,

    /**
     * @param {Hiro} hiro
     * @public
     **/
    setHiro: function (hiro) {
        if (undefined !== this.hiro) {
            alert('Мой герой "' + this.hiro.getName() + '"! Не стану дезертировать!');
            throw new Error('Герой уже привязан.');
        }
        this.hiro = hiro;
        return this;
    }
};
