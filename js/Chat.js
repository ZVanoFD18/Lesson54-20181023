'use strict';

class Chat {
    constructor(options) {
        if (typeof (options) !== 'object') {
            throw new Error('Не указаны опции.');
        }
        if (!options.renderTo) {
            throw new Error('Не указано куда рендерить');
        }
        this.options = options;
        this.chatEl = this.options.renderTo;
        this.chatOpenedEl = this.chatEl.querySelector('.chat-opened');
        this.chatCollapsedEl = this.chatEl.querySelector('.chat-collapsed');
        this.chatFormEl = this.chatOpenedEl.getElementsByClassName('chat-form')[0];
        this.init();
    }

    init() {
        this.chatFormEl.elements['button-send'].addEventListener('click', this.onButtonSendClick.bind(this));
        this.chatCollapsedEl.querySelector('.chat-collapsed-text').addEventListener('click', this.onChatCollapsedTextClick.bind(this));
        this.chatOpenedEl.querySelector('.chat-icon-normalize').addEventListener('click', this.onChatIconNormalizeClick.bind(this));
        this.chatOpenedEl.querySelector('.chat-icon-close').addEventListener('click', this.onChatIconCloseClick.bind(this));
        this.chatOpenedEl.querySelector('.chat-icon-collapse').addEventListener('click', this.onChatIconCollapseClick.bind(this));
        this.chatOpenedEl.querySelector('.chat-title-text').addEventListener('mousedown', this.onChatTitleTextMousedown.bind(this));
    }

    onChatCollapsedTextClick(event) {
        this.chatOpenedEl.classList.toggle('chat-hidden');
        this.chatCollapsedEl.classList.toggle('chat-hidden');
    }

    onChatIconNormalizeClick(event) {
        this.chatOpenedEl.style.right = '0px';
        this.chatOpenedEl.style.top = '0px';
        this.chatOpenedEl.style.left = 'auto';
    }

    onChatIconCloseClick(event) {
        this.chatOpenedEl.classList.add('chat-hidden');
        this.chatCollapsedEl.classList.add('chat-hidden');
    }

    onChatIconCollapseClick(event) {
        this.chatOpenedEl.classList.toggle('chat-hidden');
        this.chatCollapsedEl.classList.toggle('chat-hidden');
    }

    onChatTitleTextMousedown(eventDown) {
        eventDown.target.classList.add('chat-title-text-moveing');
        //console.log('mousedown');
        let startPos = this.chatOpenedEl.getBoundingClientRect(),
            offsetX = startPos.x - eventDown.clientX,
            offsetY = startPos.y - eventDown.clientY
        ;
        document.addEventListener('mouseup', function fDocumentMouseup() {
            //console.log('mouseup');
            document.removeEventListener('mouseup', fDocumentMouseup);
            document.removeEventListener('mousemove', fDocumentMousemove);
            eventDown.target.classList.remove('chat-title-text-moveing');
        });
        //this.chatOpenedEl.style.right = 'unset'; // https://developer.mozilla.org/en-US/docs/Web/CSS/unset
        this.chatOpenedEl.style.right = 'auto';
        let fDocumentMousemove = (function (eventMove) {
            this.chatOpenedEl.style.top = eventMove.clientY + offsetY + 'px';
            this.chatOpenedEl.style.left = eventMove.clientX + offsetX + 'px';
        }).bind(this);
        document.addEventListener('mousemove', fDocumentMousemove);
    }

    onButtonSendClick(event) {
        event.preventDefault();
        let newMessageEl = document.createElement('div');
        newMessageEl.classList.add('messages-row');
        newMessageEl.appendChild((function () {
            let el = document.createElement('span');
            //el.dataset.id="hiro-name"
            el.classList.add('messages-sender');
            el.innerHTML = this.chatFormEl.elements['hiro'].value;
            return el;
        }).call(this));
        newMessageEl.appendChild((function () {
            let el = document.createElement('span');
            el.classList.add('messages-text');
            el.innerHTML = this.chatFormEl.elements['message'].value;
            return el;
        }).call(this));

        this.chatOpenedEl.querySelector('[data-id="messages"]').appendChild(newMessageEl);
        return false;
    }
    isHidden(){
        let isHidden = this.chatOpenedEl.classList.contains('chat-hidden');
        return isHidden;
    }

    open() {
        this.chatOpenedEl.classList.remove('chat-hidden');
        this.chatCollapsedEl.classList.add('chat-hidden');
    }
    collapse (){
        this.chatOpenedEl.classList.add('chat-hidden');
        this.chatCollapsedEl.classList.remove('chat-hidden');
    }

    setSender(value) {
        this.chatFormEl.elements['hiro'].value = value
    }
}
