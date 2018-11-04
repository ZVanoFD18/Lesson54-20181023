function ContextMenuItem(text, itemId, userData, handler) {
    this.text = text;
    this.itemId = itemId;
    this.userData = userData || undefined;
    this.handler = handler || function () {
    }
    this.set = function (propName, propVal) {
        if (!(this.hasOwnProperty(propName))){
            throw new Error('Unknown property '+ propName);
        }
        this[propName] = propVal;
        return this;
    }
}