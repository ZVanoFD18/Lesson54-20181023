'use strict';
/**
 * Класс "Герой". Прототипный стиль.
 * @type {Object}
 **/
function Hiro(name){
  this.name = name;
  this.soldiers = Object.create(this.soldiers);
  this.recruitSoldiers();
};

Hiro.prototype = {
    // constructor : Hiro,
    /**
     * Перечисление "Результат атаки".
     * @type {Object}
     **/
    AttackResult: {
        /**
         * Результат - герой победил.
         * @type {String}
         **/
        WIN: 'HIRO_WIN',
        LOSE: 'HIRO_LOSE',
        DRAW: 'HIRO_DRAW'
    },
    /**
     * Опция "Максимальное количество солдат".
     * @type {Number}
     **/
    maxSoldiers: 100,
    name: undefined,
    level: 1,
    battlesCount: 0,
    /**
     * @type {Array of Soldier}
     **/
    soldiers: [],
    getName: function () {
        return this.name;
    },
    getLevel: function () {
        return this.level;
    },
    getBattlesCount: function () {
        return this.battlesCount;
    },
    getSoldiersCount: function () {
        return this.soldiers.length;
    },
    getPower: function () {
        let result = this.soldiers.length * this.level;
        return result;
    },
    /**
     * Рекрутирует солдат для текущего героя.
     * @private
     **/
    recruitSoldiers: function () {
        let count = parseInt(Math.random() * this.maxSoldiers);
        for (let i = 0; i <= count; i++) {
            let soldier = new Soldier();
            soldier.setHiro(this);
            this.soldiers.push(soldier);
        }
    },
    /**
     * @private
     **/
    levelUp: function () {
        ++this.level;
    },
    /**
     * Выполняет действие "атака противника".
     * @public
     **/
    attack: function (enemy) {
        let myPower = this.getPower(),
            enemyPower = enemy.getPower();
        if (myPower > enemyPower) {
            this.setAttackResult(this.AttackResult.WIN);
            enemy.setAttackResult(this.AttackResult.LOSE);
        } else if (myPower < enemyPower) {
            this.setAttackResult(this.AttackResult.LOSE);
            enemy.setAttackResult(this.AttackResult.WIN);
        } else {
            this.setAttackResult(this.AttackResult.DRAW);
            enemy.setAttackResult(this.AttackResult.DRAW);
        }
    },
    /**
     * Обрадатывает результат сражения.
     * @public
     **/
    setAttackResult: function (attackResult) {
        ++this.battlesCount;
        switch (attackResult) {
            case this.AttackResult.WIN:
                this.levelUp();
                alert(this.getName() + '/Я победил :)');
                break;
            case this.AttackResult.LOSE:
                alert(this.getName() + '/Я проиграл :(');
                break;
            case this.AttackResult.DRAW:
                alert(this.getName() + '/Ничья. Давай еще раз ;-)');
                break;
            default:
                throw new Error('Не поддерживаемый оезультат соревнования');
        }
    }
};
