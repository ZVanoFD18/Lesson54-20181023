function ContextMenu(options){
    this.items = [];
}
ContextMenu.prototype = {
    /**
     * @type {Array}
     */
    items : undefined,
    /**
     *
     * @param {ContextMenuItem} item
     * @returns {this}
     */
    addItem : function (item) {
        if (!(item instanceof ContextMenuItem)){
            throw new Error("Invalid type of item");
        }
        this.items.push(item);
        return this;
    },
    /**
     *
     * @param {Array} items
     * @param {Function} callback
     * @returns {this}
     */
    addItemsByCallback : function (items, callback, scope) {
        items.forEach(function (item, index) {
            let newMenuItem = callback.call(scope ||this, item, index);
            this.addItem(newMenuItem);
        }, this);
        return this;
    },
    bindToDom : function (domEl) {
        let me = this;
        domEl.oncontextmenu = function () {
            return false;
        };
        domEl.addEventListener('contextmenu', (function (event) {
            event.cancelBubble = true;
            this.showAt(event.pageX, event.pageY);
            return false;
        }).bind(this));
    },
    /**
     * @type {DOMElement}
     */
    domMenu : undefined,
    showAt : function (x, y) {
        let menuDiv = document.createElement('div');
        menuDiv.classList.add('menuSelectHiro');
        menuDiv.style.left = (x - 5) + 'px';
        menuDiv.style.top = (y - 10) + 'px';
        this.items.forEach(function (item, index) {
            let newMenuItemDiv =  document.createElement('div');
            newMenuItemDiv.classList.add('menuSelectHiroItem');
            newMenuItemDiv.innerText = item.text;
            newMenuItemDiv.setAttribute('user-menu-index', index);
            newMenuItemDiv.addEventListener('click', this.onMeniItemClick.bind(this));
            menuDiv.appendChild(newMenuItemDiv);
        }, this);
        this.domMenu = menuDiv;
        let dropAt = undefined;
        menuDiv.mouseover = (function () {
            dropAt = undefined;
        }).bind(this);
        menuDiv.onmouseout = (function () {
            dropAt = new Date(Date.now() + 1500);
            let timer = setInterval((function () {
                if (dropAt === undefined){
                    clearInterval(timer);
                } else if(Date.now() > dropAt){
                    clearInterval(timer);
                    this.domMenu.remove();
                }
            }).bind(this), 100);
            // this.domMenu.remove();
        }).bind(this);
        document.body.appendChild(menuDiv);
    },
    onMeniItemClick : function (menuItemDom) {
        let menuIndex = parseInt(menuItemDom.srcElement.getAttribute('user-menu-index')),
            menuItem = this.items[menuIndex];
        menuItem.handler(menuItem);
        this.domMenu.remove();
    },
    destroyMenu : function () {
        this.domMenu.remove();
    }
};