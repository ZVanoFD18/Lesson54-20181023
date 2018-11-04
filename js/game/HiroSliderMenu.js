'use strict';

class HiroSliderMenu {
    constructor(options) {
        if (typeof (options) !== 'object') {
            throw new Error('Не указаны опции.');
        }
        if (!options.renderTo) {
            throw new Error('Не указано куда рендерить');
        }
        this.options = options;
        this.items = options.items || [];
        this.contextMenu = undefined;
        this.onHiroSelected = this.options.onHiroSelected || this.onHiroSelected;
        this.onGoToChat = this.options.onGoToChat || this.onGoToChat;
        this.init();
    }

    init() {
        this.menuItemsEl = this.options.renderTo.querySelector('.hiro-slider-menu-items');
        this.items.forEach(function (item, index) {
            let newMenuItemEl = document.createElement('div');
            newMenuItemEl.setAttribute('data-item-index', index);
            newMenuItemEl.classList.add('hiro-slider-menu-item', item.classForSlideMenu);
            this.menuItemsEl.appendChild(newMenuItemEl);
        }, this);
        this.buttonPrev = this.options.renderTo.querySelector('.hiro-slider-menu-prev');
        this.buttonNext = this.options.renderTo.querySelector('.hiro-slider-menu-next');
        this.buttonPrev.addEventListener('click', this.onButtonPrevClick.bind(this));
        this.buttonNext.addEventListener('click', this.onButtonNextClick.bind(this));
        this.menuItemsEl.addEventListener('click', this.onMenuClick.bind(this));
    }

    onButtonPrevClick(event) {
        alert('@TODO: prev/click');
    }

    onButtonNextClick(event) {
        alert('@TODO: next/click');
    }

    onMenuClick(event) {
        if (!event.target.classList.contains('hiro-slider-menu-item')) {
            return;
        }
        let itemIndex = +event.target.getAttribute('data-item-index'),
            item = this.items[itemIndex];
        let handlerMenuItem = (function (menuItem) {
            if (menuItem.itemId === 'go2pos1') {
                this.onHiroSelected(item, 1);
            } else if (menuItem.itemId === 'go2pos2') {
                this.onHiroSelected(item, 2);
            } else if (menuItem.itemId === 'go2chat') {
                this.onGoToChat(item);
            }
        }).bind(this);
        if (this.contextMenu instanceof ContextMenu) {
            this.contextMenu.destroyMenu();
            this.contextMenu = undefined;
        }
        this.contextMenu = new ContextMenu();
        this.contextMenu.addItem((new ContextMenuItem())
            .set('text', 'В 1ю позицию')
            .set('itemId', 'go2pos1')
            .set('handler', handlerMenuItem)
        );
        this.contextMenu.addItem((new ContextMenuItem())
            .set('text', 'Во 2ю позицию')
            .set('itemId', 'go2pos2')
            .set('handler', handlerMenuItem)
        );
        this.contextMenu.addItem((new ContextMenuItem())
            .set('text', 'Героя в чат')
            .set('itemId', 'go2chat')
            .set('handler', handlerMenuItem)
        );
        this.contextMenu.showAt(event.pageX, event.pageY);
    }

    onHiroSelected(item, posIndex) {
        console.log('@WARN: Нужно переопределить обработчик onHiroSelected');
    }

    onGoToChat(item) {
        console.log('@WARN: Нужно переопределить обработчик onGoToChat');
    }
};