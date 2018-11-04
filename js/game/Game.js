'use strict';

/**
 * Класс "Приложение". Функциональный стиль.
 * @type {Object}
 **/
function Game() {
    let data = {
        isInit: false,
        isBattle: false,
        hiroes: [],
        hiro1: undefined,
        hiro2: undefined,
        hiro1menuSelect: new ContextMenu(),
        hiro2menuSelect: new ContextMenu(),
        sounds: {
            hiro1: 'resources/horse-galope.mp3',
            hiro2: 'resources/zvuk-poezda.mp3',
        },
        /**
         * @type {HiroSliderMenu}
         */
        sliderMenu: undefined,
        /**
         *@type {Chat}
         */
        chat: undefined
    };
    /**
     * Выполняет инициализацию объека.
     **/
    this.init = function (hiroesConfig) {
        if (data.isInit) {
            console.warn('Попытка повторной инициализации.');
            return;
        }
        document.addEventListener('contextmenu', function (event) {
            console.log('disable context menu');
            event.preventDefault();
        });
        document.getElementById('idButtonSave').addEventListener('click', (event) => {
            this.save();
        });
        document.getElementById('idButtonLoad').addEventListener('click', (event) => {
            this.load();
        });
        document.getElementById('idButtonClear').addEventListener('click', (event) => {
            this.clear();
        });
        data.chat = new Chat({
            renderTo: document.getElementById('hiroes-chat')
        });
        if (!this.load()){
            if (!hiroesConfig) {
                throw new Error('Не указаны герои.')
            }
            hiroesConfig.forEach(function (hiroConfig) {
                let hiro = new Hiro(hiroConfig.name);
                data.hiroes.push(hiro);
            });
        }
        data.sliderMenu = new HiroSliderMenu({
            renderTo: document.getElementById('hiro-slide-menu'),
            items: (function () {
                let items = [];
                hiroesConfig.forEach(function (hiroConfig) {
                    items.push({
                        name: hiroConfig.name,
                        classForSlideMenu: hiroConfig.classForSlideMenu
                    })
                });
                return items;
            }).call(this),
            onHiroSelected(item, posIndex) {
                let hiro = undefined;
                for (let i = 0; i < data.hiroes.length; i++) {
                    if (item.name === data.hiroes[i].name) {
                        hiro = data.hiroes[i];
                        break;
                    }
                }
                onSelectHiro(hiro, posIndex === 1);
            },
            onGoToChat(item) {
                data.chat.setSender(item.name);
                data.chat.open();
            }
        });

        document.getElementById('btnSelectHiro1').onclick = btnSelectHiro1.bind(this);
        data.hiro1menuSelect.addItemsByCallback(data.hiroes, function (hiro, index) {
            return new ContextMenuItem(hiro.name, index, hiro, function (menuItem) {
                onSelectHiro(menuItem.userData, true);
            });
        }).bindToDom(document.getElementById('btnSelectHiro1'));
        document.getElementById('btnSelectHiro2').onclick = btnSelectHiro2.bind(this);
        data.hiro2menuSelect.addItemsByCallback(data.hiroes, function (hiro, index) {
            return new ContextMenuItem(hiro.name, index, hiro, function (menuItem) {
                onSelectHiro(menuItem.userData, false);
            });
        }).bindToDom(document.getElementById('btnSelectHiro2'));
        document.getElementById('btnDoBattle').onclick = btnDoBattle.bind(this);
        // Сохраняем состояние игры.
        // Не катит, потому что на главной странице при нажатии на кнопку "idButtonLogout" очищается авторизация.
        // window.addEventListener('beforeunload', ()=>{
        //     this.save();
        //     return false;
        // }, true);
        // window.onbeforeunload = (function(){
        //     console.log('onbeforeunload', document.cookie)
        //     this.save();
        //     return undefined;
        // }).bind(this);

        data.isInit = true;
    };

    /**
     * Выбор конкретного героя в конкретную позицию.
     * @param hiro
     * @param isHiro1
     */
    function onSelectHiro(hiro, isHiro1) {
        if ((data.hiro1 === hiro && isHiro1)
            || (data.hiro2 === hiro && !isHiro1)
        ) {
            alert('Герой уже выбран');
        } else if (isHiro1 && hiro === data.hiro2) {
            alert('Герой уже выбран в позиции 2');
        } else if (!isHiro1 && hiro === data.hiro1) {
            alert('Герой уже выбран в позиции 1');
        } else if (isHiro1) {
            data.hiro1 = hiro;
            displayHiro(hiro);
        } else {
            data.hiro2 = hiro;
            displayHiro(hiro);
        }
    }

    /**
     * Возвращает случайно выбранного героя, исключая указанного.
     * @param {Hiro|undefined} excludeHiro - Исключая героя
     * @param {Number|undefined} attempt - счетчик попыток (рекурсия)
     **/
    function getRandomHiro(excludeHiro, attempt) {
        attempt = attempt || 0;
        if (data.hiroes.length < 2) {
            throw new Error('Недостаточно героев');
        }
        let newHiroIndex = parseInt(Math.random() * data.hiroes.length - 1);
        let newHiro = data.hiroes[newHiroIndex];
        let result;
        if (newHiro === excludeHiro) {
            result = getRandomHiro(excludeHiro, ++attempt);
        } else {
            result = newHiro;
        }
        console.debug('Выбран случайный герой', result.getName(), 'попытка', attempt,
            'Исключая героя', excludeHiro ? excludeHiro.getName() : 'empty');
        return result;
    }

    /**
     * Выполняет действие "Выбрать героя 1"
     **/
    function btnSelectHiro1() {
        data.hiro1 = getRandomHiro(data.hiro2);
        displayHiro(data.hiro1);
    }


    /**
     * Выполняет действие "Выбрать героя 2"
     **/
    function btnSelectHiro2() {
        data.hiro2 = getRandomHiro(data.hiro1);
        displayHiro(data.hiro2);
    }

    /**
     * Выполняет действие "Сражение между выбраными героями"
     **/
    function btnDoBattle() {
        if (data.inBattle) {
            return;
        }
        if (!(data.hiro1 && data.hiro2)) {
            alert('Нужно выбрать героев.');
            return;
        }
        data.inBattle = true;
        animateAttack(function () {
            data.hiro1.attack(data.hiro2);
            displayHiro(data.hiro1);
            displayHiro(data.hiro2);
            data.inBattle = false;
        });
    }

    function animateAttack(callback) {
        let domHiro1 = document.getElementById('hiro1'),
            domHiro2 = document.getElementById('hiro2'),
            domBattlefield = document.getElementById('battlefield'),
            hiro1initLeft = parseInt(getComputedStyle(domHiro1).left),
            hiro2initRight = parseInt(getComputedStyle(domHiro2).right)
        ;
        var hiro1audio = new Audio(data.sounds.hiro1),
            hiro2audio = new Audio(data.sounds.hiro2);
        // hiro1audio.src = data.sounds.hiro1;
        // hiro2audio.src = data.sounds.hiro2;
        hiro1audio.loop = true;
        hiro2audio.loop = true;
        hiro1audio.play();
        hiro2audio.play();
        let interval = setInterval((function () {
            let battlefieldWidth = parseInt(getComputedStyle(domBattlefield).width);
            let hiro1Styles = getComputedStyle(domHiro1);
            domHiro1.style.left = (parseInt(hiro1Styles.left) + 10) + 'px';
            domHiro2.style.right = (parseInt(getComputedStyle(domHiro2).right) + 10) + 'px';
            if ((battlefieldWidth / 2) - parseInt(hiro1Styles.width) < parseInt(domHiro1.style.left)) {
                domHiro1.style.left = hiro1initLeft;
                domHiro2.style.right = hiro2initRight;
                // delete hiro1audio;
                hiro1audio.pause();
                hiro2audio.pause();
                clearInterval(interval);
                callback();
            }
        }).bind(this), 250)
    }

    /**
     * Выполняет действие "Отобразить информацию о герое"
     * @param {Hiro} hiro - герой, информацию о котором следует отобразить в HTML.
     **/
    function displayHiro(hiro) {
        let dom;
        if (hiro === data.hiro1) {
            dom = document.getElementById('hiro1');
        } else {
            dom = document.getElementById('hiro2');
        }
        dom.getElementsByClassName('hiro-name-value')[0].textContent = hiro.getName();
        dom.getElementsByClassName('hiro-level-value')[0].textContent = hiro.getLevel();
        dom.getElementsByClassName('hiro-power-value')[0].textContent = hiro.getPower();
        dom.getElementsByClassName('hiro-battles-value')[0].textContent = hiro.getBattlesCount();
        dom.getElementsByClassName('hiro-soldiers-value')[0].textContent = hiro.getSoldiersCount();
    }

    /**
     * Очищает сохраненные данные игрока.
     */
    this.clear = ()=>{
        localStorage.removeItem(Auth.getLogin());
        Auth.redirectToGame();
    };
    /**
     * Сохраняет ход игры.
     */
    this.save = () => {
        let saveData = {
            version : 1,
            hiro1name : data.hiro1 instanceof Hiro ? data.hiro1.getName() : '',
            hiro2name : data.hiro2 instanceof Hiro ? data.hiro2.getName() : '',
            hiroes: [],
            chat: {
                isHidden: data.chat.isHidden()
            }
        };
        data.hiroes.forEach((hiro) => {
            saveData.hiroes.push(hiro.serialize());
        });
        console.log(saveData);

        saveData = JSON.stringify(saveData);
        localStorage.setItem(Auth.getLogin(), saveData);
    }
    /**
     * Загружает ход игры.
     * @returns {boolean}
     */
    this.load = () => {
        let loadedData = localStorage.getItem(Auth.getLogin());
        if (loadedData === null){
            return false;
        }
        loadedData = JSON.parse(loadedData);
        if (loadedData.version !== 1){
            return false;
        }
        if (loadedData.chat.isHidden) {
            data.chat.collapse();
        } else {
            data.chat.open();
        }
        let newHiroes = [],
            hiro1, hiro2;
        loadedData.hiroes.forEach((hiroStr)=>{
            let newHiro = new Hiro(null);
            if (!newHiro.deserialize(hiroStr)){
                return false;
            }
            newHiroes.push(newHiro);
            if (newHiro.getName() === loadedData.hiro1name){
                hiro1 = newHiro;
            } else if (newHiro.getName() === loadedData.hiro2name){
                hiro2 = newHiro;
            }
        });
        data.hiroes = newHiroes;
        if (hiro1 instanceof Hiro){
            data.hiro1 = hiro1;
            displayHiro(data.hiro1);
        }
        if (hiro2 instanceof Hiro){
            data.hiro2 = hiro2;
            displayHiro(data.hiro2);
        }
        return true;
    }

}
